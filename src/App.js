import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// 새로운 구조의 컴포넌트들
import { AppProvider, ErrorBoundary, AppRoutes } from './app/index';
import { useItemsData } from './features/dashboard/hooks';
import { SeriesDetailPage } from './features/dashboard';
import { tokenUtils } from './shared/lib';

// 기존 컴포넌트들 (임시로 사용)
import { LoginPage as Login } from './features/auth';
import { SignupPage as Signup } from './features/auth';
import { ItemDetail } from './features/item-detail';

// 아이콘 imports
import iconDashboard from './assets/icons/icon_dashboard.svg';
import iconBrowser from './assets/icons/icon_browser.svg';
import iconAnalysis from './assets/icons/icon_analysis.svg';
import iconSetting from './assets/icons/icon_setting.svg';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 기본 상태
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState({ type: 'tab', data: null });
  const [showAuthModal, setShowAuthModal] = useState('login');

  // 아이템 데이터 관리 (새로운 훅 사용)
  const { 
    itemsData, 
    // isLoading: itemsLoading, 
    // error: itemsError,
  } = useItemsData();

  // 사용자 인증 상태 확인
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

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
    // 같은 탭으로 전환 시도하면 무시
    if (activeTab === tabId) {
      return;
    }
    
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

  // 아이템 클릭 처리
  const handleItemClick = (item) => {
    if (item.type === 'series') {
      // 시리즈 아이템인 경우 시리즈 상세 페이지로 이동
      setCurrentView({ type: 'seriesDetail', data: item });
    } else {
      // 다른 아이템은 기존대로 상세 페이지로 이동
      setCurrentView({ type: 'detail', data: item });
    }
  };

  // 뒤로 가기
  const handleBack = () => {
    setCurrentView({ type: 'tab', data: null });
  };

  // 아이템 승인 처리 (새로운 훅 사용)
  const handleApprove = (item) => {
    console.log('승인:', item);
  };

  // 피드백 처리
  const handleFeedback = (item, feedback) => {
    console.log('피드백:', item, feedback);
  };

  // 로그인하지 않은 경우 인증 모달 표시
  if (!user) {
    return (
      <div className="auth-container">
        {showAuthModal === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => handleAuthSwitch('signup')}
          />
        ) : (
          <Signup 
            onSwitchToLogin={() => handleAuthSwitch('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      {/* Main Content */}
      <div className={`app-container ${(currentView.type === 'detail' || currentView.type === 'seriesDetail') ? 'detail-view' : ''}`}>
        {currentView.type === 'detail' ? (
          <ItemDetail
            item={currentView.data}
            onBack={handleBack}
            onApprove={handleApprove}
            onFeedback={handleFeedback}
          />
        ) : currentView.type === 'seriesDetail' ? (
          <SeriesDetailPage
            seriesData={currentView.data}
            onBack={handleBack}
            isLoading={false}
          />
        ) : (
          <div className="tabs-container">
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
            <div className="help-text">💡 탭을 클릭해서 이동</div>
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
