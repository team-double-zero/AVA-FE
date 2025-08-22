import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import Setting from './components/Setting';
import ItemDetail from './components/ItemDetail';
import Login from './components/Login';
import Signup from './components/Signup';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 모든 useState hooks를 최상단에 배치 (React Hooks 규칙 준수)
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState({ type: 'tab', data: null });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [showAuthModal, setShowAuthModal] = useState('login');
  const [itemsData, setItemsData] = useState({
    pending: {
      worldview: [
        { 
          id: 1, 
          type: 'worldview',
          title: '미래형 도시 배경', 
          description: '미래형 디스토피아 설정', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-15',
          aiGenerated: true
        },
        { 
          id: 2, 
          type: 'worldview',
          title: '판타지 왕국 설정', 
          description: '중세 판타지 배경', 
          status: 'review', 
          feedbackCount: 2,
          createdAt: '2024-01-14',
          aiGenerated: true
        }
      ],
      character: [
        { 
          id: 1, 
          type: 'character',
          title: '주인공 캐릭터 - 알렉스', 
          description: '사이버 해커 캐릭터', 
          status: 'pending',
          feedbackCount: 1,
          createdAt: '2024-01-16',
          aiGenerated: true,
          worldviewId: 1
        }
      ],
      scenario: [
        { 
          id: 1, 
          type: 'scenario',
          title: '1막 오프닝 시나리오', 
          description: '게임 시작 부분', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-17',
          aiGenerated: true,
          worldviewId: 1,
          characterId: 1
        }
      ]
    },
    working: {
      worldview: [
        { 
          id: 3, 
          type: 'worldview',
          title: '우주 전쟁 배경', 
          description: 'SF 우주 배경 설정', 
          status: 'generating',
          feedbackCount: 3,
          createdAt: '2024-01-13',
          aiGenerated: true,
          workStatus: 'revision_requested'
        }
      ],
      character: [
        { 
          id: 2, 
          type: 'character',
          title: '조력자 - 미라', 
          description: '마법사 캐릭터', 
          status: 'generating',
          feedbackCount: 1,
          createdAt: '2024-01-15',
          aiGenerated: true,
          worldviewId: 2,
          workStatus: 'revision_requested'
        },
        { 
          id: 3, 
          type: 'character',
          title: '빌런 - 다크로드', 
          description: '최종 보스 캐릭터', 
          status: 'generating',
          feedbackCount: 0,
          createdAt: '2024-01-18',
          aiGenerated: true,
          worldviewId: 1,
          workStatus: 'generating'
        }
      ],
      scenario: [
        { 
          id: 2, 
          type: 'scenario',
          title: '중간 보스전 대본', 
          description: '중간 보스 대화', 
          status: 'generating',
          feedbackCount: 2,
          createdAt: '2024-01-16',
          aiGenerated: true,
          worldviewId: 1,
          characterId: 2,
          workStatus: 'revision_requested'
        }
      ]
    },
    approved: {
      worldview: [
        { id: 1, type: 'worldview', title: '메인 도시 설정', description: '중앙 도시 배경' },
        { id: 2, type: 'worldview', title: '던전 설정', description: '지하 던전 배경' }
      ],
      character: [
        { id: 1, type: 'character', title: '상점 NPC', description: '아이템 판매 캐릭터' },
        { id: 2, type: 'character', title: '가이드 NPC', description: '튜토리얼 가이드' }
      ],
      scenario: [
        { id: 1, type: 'scenario', title: '튜토리얼 시나리오', description: '초기 학습 과정' },
        { id: 2, type: 'scenario', title: '첫 번째 퀘스트', description: '첫 임무 대본' }
      ]
    }
  });

  // useEffect는 hooks 중에서 useState 다음에 배치
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // URL 경로에 따라 activeTab 설정
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      setActiveTab('dashboard');
    } else if (path === '/analysis') {
      setActiveTab('analysis');
    } else if (path === '/setting') {
      setActiveTab('setting');
    }
  }, [location.pathname]);

  // 탭 전환 함수
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'dashboard':
        navigate('/dashboard');
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
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analysis', label: 'Analysis', icon: '📈' },
    { id: 'setting', label: 'Setting', icon: '⚙️' }
  ];

  // 로그인 성공 핸들러
  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  // 인증 모드 전환
  const handleAuthSwitch = (authType) => {
    setShowAuthModal(authType);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // 스와이프 이벤트 핸들러
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    // 세로 스와이프가 가로 스와이프보다 크면 무시
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    
    // 스와이프 거리가 최소 거리보다 작으면 무시
    if (Math.abs(deltaX) < minSwipeDistance) return;

    // 상세 페이지에서 스와이프 처리
    if (currentView.type === 'detail') {
      if (deltaX > 0) {
        // 왼쪽 스와이프 - 뒤로 가기
        handleBack();
      }
      return;
    }

    // 탭 페이지에서 스와이프 처리
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    if (deltaX > 0) {
      // 왼쪽 스와이프 - 이전 탭
      const prevIndex = currentTabIndex > 0 ? currentTabIndex - 1 : tabs.length - 1;
      handleTabChange(tabs[prevIndex].id);
    } else {
      // 오른쪽 스와이프 - 다음 탭
      const nextIndex = currentTabIndex < tabs.length - 1 ? currentTabIndex + 1 : 0;
      handleTabChange(tabs[nextIndex].id);
    }

    // 터치 상태 리셋
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  // 아이템 클릭 처리
  const handleItemClick = (item) => {
    setCurrentView({ type: 'detail', data: item });
  };

  // 뒤로 가기
  const handleBack = () => {
    setCurrentView({ type: 'tab', data: null });
  };

  // 아이템 승인 처리
  const handleApprove = (item) => {
    setItemsData(prevData => {
      const newData = { ...prevData };
      
      // 승인 대기에서 제거
      if (prevData.pending[item.type]) {
        newData.pending[item.type] = prevData.pending[item.type].filter(i => i.id !== item.id);
      }
      
      // 승인된 아이템에 추가
      if (!newData.approved[item.type]) {
        newData.approved[item.type] = [];
      }
      newData.approved[item.type].push({
        ...item,
        status: 'approved',
        approvedAt: new Date().toISOString().split('T')[0]
      });

      // 다음 단계 아이템 생성
      const nextStepItem = generateNextStepItem(item);
      if (nextStepItem) {
        if (!newData.working[nextStepItem.type]) {
          newData.working[nextStepItem.type] = [];
        }
        newData.working[nextStepItem.type].push(nextStepItem);
      }

      return newData;
    });

    // 대시보드로 돌아가기
    setCurrentView({ type: 'tab', data: null });
  };

  // 피드백 처리
  const handleFeedback = (item, feedbackText) => {
    setItemsData(prevData => {
      const newData = { ...prevData };
      
      // 승인 대기에서 제거
      if (prevData.pending[item.type]) {
        newData.pending[item.type] = prevData.pending[item.type].filter(i => i.id !== item.id);
      }
      
      // 작업 중 아이템에 추가 (수정 요청 상태)
      if (!newData.working[item.type]) {
        newData.working[item.type] = [];
      }
      newData.working[item.type].push({
        ...item,
        status: 'generating',
        feedbackCount: item.feedbackCount + 1,
        workStatus: 'revision_requested',
        lastFeedback: feedbackText,
        feedbackAt: new Date().toISOString().split('T')[0]
      });

      return newData;
    });

    // 대시보드로 돌아가기
    setCurrentView({ type: 'tab', data: null });
  };

  // 다음 단계 아이템 생성
  const generateNextStepItem = (approvedItem) => {
    const getNextId = (type) => {
      const allItems = [
        ...itemsData.pending[type] || [],
        ...itemsData.working[type] || [],
        ...itemsData.approved[type] || []
      ];
      return Math.max(...allItems.map(item => item.id), 0) + 1;
    };

    switch (approvedItem.type) {
      case 'worldview':
        // 세계관 승인 시 캐릭터 생성
        return {
          id: getNextId('character'),
          type: 'character',
          title: `${approvedItem.title}의 주요 캐릭터`,
          description: `${approvedItem.title} 세계관에 맞는 캐릭터`,
          status: 'generating',
          feedbackCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          aiGenerated: true,
          worldviewId: approvedItem.id,
          workStatus: 'generating'
        };
      
      case 'character':
        // 캐릭터 승인 시 시나리오 생성
        return {
          id: getNextId('scenario'),
          type: 'scenario',
          title: `${approvedItem.title} 중심 시나리오`,
          description: `${approvedItem.title}가 등장하는 시나리오`,
          status: 'generating',
          feedbackCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          aiGenerated: true,
          worldviewId: approvedItem.worldviewId,
          characterId: approvedItem.id,
          workStatus: 'generating'
        };
      
      default:
        return null;
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
    >
      {/* Top Header */}
      <header className="top-header">
        <button 
          className="menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h1 
          className="app-title"
          onClick={() => handleTabChange('dashboard')}
        >
          Avazon
        </h1>
        <div className="header-right">
          <span className="user-name">{user?.nickname || user?.email}</span>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">메뉴</h2>
          <button 
            className="close-button"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                handleTabChange(tab.id);
                setSidebarOpen(false);
              }}
            >
              <span className="sidebar-icon">{tab.icon}</span>
              <span className="sidebar-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="app-container">
        <main className="main-content">
          {currentView.type === 'detail' ? (
            <ItemDetail
              item={currentView.data}
              onBack={handleBack}
              onApprove={handleApprove}
              onFeedback={handleFeedback}
            />
          ) : (
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  itemsData={itemsData}
                  onItemClick={handleItemClick}
                />
              } />
              <Route path="/dashboard" element={
                <Dashboard 
                  itemsData={itemsData}
                  onItemClick={handleItemClick}
                />
              } />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
