import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// 새로운 구조의 컴포넌트들
import { AppProvider, ErrorBoundary, AppRoutes } from './app/index';
import { useItemsData } from './features/dashboard/hooks';
import { tokenUtils } from './shared/lib';

// 기존 컴포넌트들 (임시로 사용)
import Login from './components/Login';
import Signup from './components/Signup';
import ItemDetail from './components/ItemDetail';

// 아이콘 imports
import iconDashboard from './assets/icons/icon_dashboard.svg';
import iconBrowser from './assets/icons/icon_browser.svg';
import iconAnalysis from './assets/icons/icon_analysis.svg';
import iconSetting from './assets/icons/icon_setting.svg';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 모든 useState hooks를 최상단에 배치 (React Hooks 규칙 준수)
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState({ type: 'tab', data: null });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [showAuthModal, setShowAuthModal] = useState('login');
  
  // 스와이프 상태 추가
  const [isSwipingAllowed, setIsSwipingAllowed] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [wheelTimeout, setWheelTimeout] = useState(null);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  
  // 탭 전환 애니메이션 관련 상태
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [canSwipe, setCanSwipe] = useState(true);
  const [swipeThreshold] = useState(100); // 탭 전환 임계점 (픽셀)

  // 아이템 데이터 관리 (새로운 훅 사용)
  const { 
    itemsData, 
    // isLoading: itemsLoading, 
    // error: itemsError,
    approveItem,
    submitFeedback 
  } = useItemsData();

  // useEffect는 hooks 중에서 useState 다음에 배치
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 앱 초기화 중... 인증 상태 확인');
      
      // 초기화 시작 플래그 설정
      tokenUtils.setIsInitializing(true);
      
      const userData = localStorage.getItem('userData');
      const refreshToken = tokenUtils.getRefreshToken();
      
      console.log('📋 저장된 데이터 확인:', {
        hasUserData: !!userData,
        hasRefreshToken: !!refreshToken,
        hasValidStoredToken: tokenUtils.hasValidStoredToken(),
        devMode: process.env.REACT_APP_DEV_MODE
      });

      // 필수 데이터가 모두 있는지 확인
      if (!userData || !refreshToken) {
        console.log('⚠️ 필수 인증 데이터 없음 - 로그인 필요');
        if (userData || refreshToken) {
          tokenUtils.clearAllTokens(); // 불완전한 데이터 정리
        }
        setUser(null);
        tokenUtils.setIsInitializing(false); // 초기화 완료
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        
        // 개발 모드에서 admin 사용자는 바로 복원
        if (process.env.REACT_APP_DEV_MODE === 'true' && parsedUserData.email === 'admin@test.com') {
          console.log('🔧 개발 모드: admin 사용자 즉시 복원');
          const dummyAccessToken = 'dev_access_token_' + Date.now();
          tokenUtils.setAccessToken(dummyAccessToken);
          setUser(parsedUserData);
          tokenUtils.setIsInitializing(false); // 초기화 완료
          return;
        }
        
        // 저장된 토큰의 유효성 확인
        if (tokenUtils.hasValidStoredToken()) {
          // 토큰이 여전히 유효하면 즉시 복원 (갱신하지 않음)
          console.log('✅ 저장된 토큰이 유효함 - 즉시 복원 (갱신 없음)');
          
          // 메모리에 Access Token이 없으므로 저장된 토큰 정보로 더미 토큰 생성
          // 실제 API 요청 시에는 apiRequest에서 필요시 갱신됨
          const dummyAccessToken = 'valid_stored_token_' + Date.now();
          tokenUtils.setAccessToken(dummyAccessToken);
          setUser(parsedUserData);
          tokenUtils.setIsInitializing(false); // 초기화 완료
        } else {
          // 토큰이 만료되었거나 없으면 새로 발급
          console.log('🔑 토큰이 만료됨 - 새로 발급 필요');
          
          try {
            const newAccessToken = await tokenUtils.refreshAccessToken();
            if (newAccessToken) {
              setUser(parsedUserData);
              console.log('✅ 토큰 갱신 후 복원 성공:', parsedUserData.username || parsedUserData.email);
              tokenUtils.setIsInitializing(false); // 초기화 완료
            }
          } catch (error) {
            console.error('❌ 토큰 갱신 실패:', error);
            tokenUtils.clearAllTokens();
            setUser(null);
            tokenUtils.setIsInitializing(false); // 초기화 완료 (실패)
          }
        }
        
      } catch (error) {
        console.error('사용자 데이터 파싱 실패:', error);
        tokenUtils.clearAllTokens();
        setUser(null);
        tokenUtils.setIsInitializing(false); // 초기화 완료 (실패)
      }
    };

    initializeAuth();
    
    // 전역 스크롤 및 터치 방지
    const preventAllScrolling = (e) => {
      // main-content 내부가 아닌 경우 스크롤 방지
      const target = e.target;
      const mainContent = target.closest('.main-content');
      
      if (!mainContent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventKeyboardScrolling = (e) => {
      // 스페이스바, 화살표 키 등으로 인한 페이지 스크롤 방지
      const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // space, page up/down, home, end, arrows
      if (scrollKeys.includes(e.keyCode)) {
        const target = e.target;
        const mainContent = target.closest('.main-content');
        
        if (!mainContent) {
          e.preventDefault();
          return false;
        }
      }
    };

    // 브라우저 기본 제스처 방지
    const preventGestures = (e) => {
      // main-content 내부가 아닌 경우 모든 터치 방지
      const target = e.target;
      const mainContent = target.closest('.main-content');
      
      if (!mainContent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // 탭 전환 처리 중일 때는 추가 제스처 방지
      if (!canSwipe) {
        console.log('Preventing gesture - tab change in progress');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // 가로 스와이프로 뒤로가기/앞으로가기 방지 (기존 로직 유지)
      if (e.touches && e.touches.length === 1) {
        const deltaX = Math.abs(e.touches[0].clientX - window.innerWidth / 2);
        const deltaY = Math.abs(e.touches[0].clientY - window.innerHeight / 2);
        
        if (deltaX > deltaY && deltaX > 50) {
          console.log('Preventing browser gesture');
          e.preventDefault();
        }
      }
    };
    
    // 전역 이벤트 리스너 추가
    document.addEventListener('touchstart', preventGestures, { passive: false });
    document.addEventListener('touchmove', preventGestures, { passive: false });
    document.addEventListener('wheel', preventAllScrolling, { passive: false });
    document.addEventListener('scroll', preventAllScrolling, { passive: false });
    document.addEventListener('keydown', preventKeyboardScrolling, { passive: false });
    
    // 정리 함수
    return () => {
      document.removeEventListener('touchstart', preventGestures);
      document.removeEventListener('touchmove', preventGestures);
      document.removeEventListener('wheel', preventAllScrolling);
      document.removeEventListener('scroll', preventAllScrolling);
      document.removeEventListener('keydown', preventKeyboardScrolling);
    };
  }, [canSwipe]);

  // URL 경로에 따라 activeTab 설정
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      setActiveTab('dashboard');
    } else if (path === '/browse') {
      setActiveTab('browse');
    } else if (path === '/analysis') {
      setActiveTab('analysis');
    } else if (path === '/setting') {
      setActiveTab('setting');
    }
  }, [location.pathname]);

  // 탭 전환 함수
  const handleTabChange = (tabId) => {
    // 같은 탭으로 전환 시도하면 무시 (가장 먼저 체크)
    if (activeTab === tabId) {
      console.log('Tab change ignored - same tab');
      return;
    }
    
    if (!canSwipe) {
      console.log('Tab change blocked - already processing');
      return; // 스와이프 중이면 탭 변경 방지
    }
    
    console.log('Tab changing from', activeTab, 'to', tabId);
    
    setActiveTab(tabId);
    switch (tabId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'browse':
        navigate('/browse');
        break;
      case 'analysis':
        navigate('/analysis');
        break;
      case 'setting':
        navigate('/setting');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // 탭 인덱스 계산
  const getTabIndex = (tabId) => {
    return tabs.findIndex(tab => tab.id === tabId);
  };

  // 탭 오프셋 계산
  const getTabOffset = () => {
    const currentIndex = getTabIndex(activeTab);
    return -(currentIndex * 25) + swipeOffset; // 25% = 100% / 4 tabs
  };

  // 탭 정의
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: iconDashboard },
    { id: 'browse', label: 'Browse', icon: iconBrowser },
    { id: 'analysis', label: 'Analysis', icon: iconAnalysis },
    { id: 'setting', label: 'Setting', icon: iconSetting }
  ];

  // 로그인 성공 핸들러
  const handleLoginSuccess = (accessToken, userData) => {
    // Access Token은 이미 tokenUtils에서 설정됨
    // userData만 localStorage에 저장
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  // 인증 모드 전환
  const handleAuthSwitch = (authType) => {
    setShowAuthModal(authType);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    tokenUtils.clearAllTokens();
    setUser(null);
  };

  // 스와이프 이벤트 핸들러들
  const handleTouchStart = (e) => {
    if (!isSwipingAllowed || currentView.type === 'detail') return;
    
    if (!canSwipe) {
      console.log('Touch start ignored - already processing');
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
    setTouchEnd({ x: 0, y: 0 });
    setSwipeDirection(null);
    setIsHorizontalSwipe(false);
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isSwipingAllowed || !touchStart.x || currentView.type === 'detail' || !canSwipe) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    setTouchEnd({ x: currentX, y: currentY });

    const deltaX = touchStart.x - currentX;
    const deltaY = touchStart.y - currentY;
    
    if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setIsHorizontalSwipe(true);
        setIsSwiping(true);
        
        const currentTabIndex = getTabIndex(activeTab);
        const maxDelta = window.innerWidth * 0.4;
        const normalizedDelta = Math.max(-maxDelta, Math.min(maxDelta, deltaX));
        
        const isAtLeftBoundary = currentTabIndex === 0 && deltaX < 0;
        const isAtRightBoundary = currentTabIndex === tabs.length - 1 && deltaX > 0;
        
        if (!isAtLeftBoundary && !isAtRightBoundary) {
          const offsetPercentage = (normalizedDelta / maxDelta) * 25;
          setSwipeOffset(offsetPercentage);
          
          const progress = Math.abs(deltaX) / swipeThreshold;
          setSwipeProgress(Math.min(progress, 1));
          
          setSwipeDirection(deltaX > 0 ? 'left' : 'right');
        }
        
        e.preventDefault();
        e.stopPropagation();
      } else {
        setIsHorizontalSwipe(false);
        setSwipeDirection(null);
        setIsSwiping(false);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!canSwipe) {
      console.log('Already processing swipe, ignoring');
      return;
    }
    
    if (!isHorizontalSwipe || !isSwiping) {
      resetSwipeState();
      return;
    }
    
    setCanSwipe(false);
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSwipingAllowed || !touchStart.x || !touchEnd.x || currentView.type === 'detail') {
      resetSwipeState();
      setTimeout(() => setCanSwipe(true), 300);
      return;
    }

    const deltaX = touchStart.x - touchEnd.x;
    const deltaTime = Date.now() - touchStart.time;
    const maxSwipeTime = 800;

    if (deltaTime > maxSwipeTime) {
      console.log('Swipe too slow');
      resetSwipeState();
      setTimeout(() => setCanSwipe(true), 300);
      return;
    }
    
    const shouldChangeTab = Math.abs(deltaX) >= swipeThreshold * 0.6 || swipeProgress >= 0.25;
    
    if (shouldChangeTab) {
      const currentTabIndex = getTabIndex(activeTab);
      
      if (deltaX > 0 && currentTabIndex < tabs.length - 1) {
        handleTabChange(tabs[currentTabIndex + 1].id);
      } else if (deltaX < 0 && currentTabIndex > 0) {
        handleTabChange(tabs[currentTabIndex - 1].id);
      }
      
      setTimeout(() => setCanSwipe(true), 500);
    } else {
      setTimeout(() => setCanSwipe(true), 300);
    }

    resetSwipeState();
  };

  // 스와이프 상태 리셋 함수
  const resetSwipeState = () => {
    setTouchStart({ x: 0, y: 0, time: 0 });
    setTouchEnd({ x: 0, y: 0 });
    setSwipeDirection(null);
    setIsHorizontalSwipe(false);
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeOffset(0);
  };

  // 휠 이벤트 핸들러
  const handleWheel = (e) => {
    if (!isSwipingAllowed || currentView.type === 'detail') return;

    if (!canSwipe) {
      console.log('Wheel: Already processing, ignoring');
      return;
    }

    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
    const minWheelDistance = 30;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (Math.abs(deltaX) < minWheelDistance) {
      return;
    }

    setCanSwipe(false);
    e.preventDefault();

    if (wheelTimeout) {
      clearTimeout(wheelTimeout);
    }

    const currentTabIndex = getTabIndex(activeTab);
    const direction = deltaX > 0 ? 'left' : 'right';
    setSwipeDirection(direction);

    if (deltaX > 0 && currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id);
    } else if (deltaX < 0 && currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id);
    }

    const newTimeout = setTimeout(() => {
      setSwipeDirection(null);
    }, 300);
    setWheelTimeout(newTimeout);

    setTimeout(() => setCanSwipe(true), 400);
  };

  // 아이템 클릭 처리
  const handleItemClick = (item) => {
    setCurrentView({ type: 'detail', data: item });
  };

  // 뒤로 가기
  const handleBack = () => {
    setCurrentView({ type: 'tab', data: null });
  };

  // 아이템 승인 처리 (새로운 훅 사용)
  const handleApprove = async (item) => {
    try {
      await approveItem(item);
      setCurrentView({ type: 'tab', data: null });
    } catch (error) {
      console.error('Failed to approve item:', error);
    }
  };

  // 피드백 처리 (새로운 훅 사용)
  const handleFeedback = async (item, feedbackText) => {
    try {
      await submitFeedback(item, feedbackText);
      setCurrentView({ type: 'tab', data: null });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  // 로그인 상태 체크 - 모든 hooks와 함수 정의 이후에 배치
  if (!user) {
    return (
      <div className="app">
        {showAuthModal === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => handleAuthSwitch('signup')}
          />
        ) : (
          <Signup 
            onSignupSuccess={() => handleAuthSwitch('login')}
            onSwitchToLogin={() => handleAuthSwitch('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className="app"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Swipe Indicator */}
      {swipeDirection && (
        <div className={`swipe-indicator ${swipeDirection}`}>
          <div className="swipe-arrow">
            {swipeDirection === 'left' ? '→' : '←'}
          </div>
          <div className="swipe-text">
            {swipeDirection === 'left' ? '다음 탭' : '이전 탭'}
          </div>
        </div>
      )}

      {/* Swipe Progress Indicator */}
      {isSwiping && (
        <div className={`swipe-progress-indicator ${!isSwiping ? 'hidden' : ''}`}>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${swipeProgress * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {swipeProgress >= 0.25 ? '놓으면 탭 전환' : '더 밀어주세요'}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className={`app-container ${currentView.type === 'detail' ? 'detail-view' : ''}`}>
        {currentView.type === 'detail' ? (
          <ItemDetail
            item={currentView.data}
            onBack={handleBack}
            onApprove={handleApprove}
            onFeedback={handleFeedback}
            onSwipeDisable={setIsSwipingAllowed}
          />
        ) : (
          <div 
            className={`tabs-container ${isSwiping ? 'swiping' : ''}`}
            style={{
              transform: `translateX(${getTabOffset()}%)`
            }}
          >
            <div className="tab-panel">
              <main className="main-content">
                <AppRoutes 
                  itemsData={itemsData}
                  onItemClick={handleItemClick}
                  onApprove={handleApprove}
                  onFeedback={handleFeedback}
                  user={user}
                  onLogout={handleLogout}
                />
              </main>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Header */}
      <footer className="bottom-header">
        <div className="help-rotator">
          <div className="help-carousel">
            <div className="help-text">💡 좌우 스와이프로 탭 전환</div>
            <div className="help-text">🎯 항목을 클릭해서 자세히 보기</div>
            <div className="help-text">⚡ 피드백으로 AI가 개선</div>
            <div className="help-text">🚀 승인하면 다음 단계 생성</div>
          </div>
        </div>
        
        <div className="tab-indicator">
          <div className="tab-dots">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                title={tab.label}
              >
                <div className="tab-icon">
                  <img src={tab.icon} alt={tab.label} />
                </div>
                <span className="tab-label">{tab.label.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="header-right">
          <span className="user-name">{user?.username ? `${user.username}님` : user?.nickname ? `${user.nickname}님` : `${user?.email}님`}</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;