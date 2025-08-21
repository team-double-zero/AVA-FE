import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import Setting from './components/Setting';
import ItemDetail from './components/ItemDetail';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState({ type: 'tab', data: null });
  
  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  
  // Pull-to-refresh 관련 상태
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  // 슬라이드 애니메이션 관련 상태
  const [slideOffset, setSlideOffset] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [itemsData, setItemsData] = useState({
    pending: {
      worldview: [
        { 
          id: 1, 
          type: 'worldview',
          title: '사이버펑크 2077 세계관', 
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
      ],
      video: [
        { 
          id: 1, 
          type: 'video',
          title: '오프닝 영상', 
          description: '게임 시작 트레일러', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-18',
          aiGenerated: true,
          worldviewId: 1,
          scenarioId: 1
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
      ],
      video: [
        { 
          id: 2, 
          type: 'video',
          title: '캐릭터 소개 영상', 
          description: '주요 캐릭터 소개 영상', 
          status: 'generating',
          feedbackCount: 1,
          createdAt: '2024-01-19',
          aiGenerated: true,
          worldviewId: 1,
          characterId: 1,
          workStatus: 'generating'
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
      ],
      video: [
        { id: 1, type: 'video', title: '튜토리얼 영상', description: '게임 방법 안내 영상' },
        { id: 2, type: 'video', title: '예고편', description: '게임 홍보 영상' }
      ]
    }
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analysis', label: 'Analysis', icon: '📈' },
    { id: 'setting', label: 'Setting', icon: '⚙️' }
  ];

  // 새로고침 함수
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // 실제 새로고침 로직 (예: 데이터 다시 불러오기)
    await new Promise(resolve => setTimeout(resolve, 1500)); // 시뮬레이션
    
    setIsRefreshing(false);
    setPullDistance(0);
    setCanPull(false);
  };

  // 스와이프 이벤트 핸들러
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    
    // 화면 최상단에 있는지 확인
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setCanPull(scrollTop === 0);
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY
    });
    
    if (canPull && !isRefreshing && touchStart.y > 0) {
      const deltaY = touch.clientY - touchStart.y;
      if (deltaY > 0) {
        // 아래로 드래그 중
        e.preventDefault(); // 기본 스크롤 방지
        const distance = Math.min(deltaY * 0.5, 100); // 최대 100px까지
        setPullDistance(distance);
        return;
      }
    }
    
    // 상세 페이지가 아닌 경우에만 탭 슬라이드 처리
    if (currentView.type === 'tab' && touchStart.x > 0) {
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      
      // 가로 드래그가 세로 드래그보다 큰 경우에만 처리
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault(); // 기본 스크롤 방지
        setIsSliding(true);
        
        // 드래그 오프셋 계산 (화면 너비 대비 퍼센트)
        const screenWidth = window.innerWidth;
        const dragPercent = (deltaX / screenWidth) * 100;
        setDragOffset(dragPercent);
      }
    }
  };

  const handleTouchEnd = () => {
    // Pull-to-refresh 처리
    if (canPull && pullDistance > 60 && !isRefreshing) {
      handleRefresh();
      return;
    } else if (canPull) {
      // 새로고침 임계값에 도달하지 않으면 원래 위치로 복원
      setPullDistance(0);
      setCanPull(false);
      return;
    }

    // 슬라이딩 상태 리셋
    setIsSliding(false);

    if (!touchStart.x || !touchEnd.x) {
      // 터치 상태 리셋
      setTouchStart({ x: 0, y: 0 });
      setTouchEnd({ x: 0, y: 0 });
      setDragOffset(0);
      return;
    }

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    // Pull-to-refresh가 활성화된 상태에서는 가로 스와이프 무시
    if (canPull || isRefreshing) {
      setDragOffset(0);
      return;
    }

    // 상세 페이지에서 스와이프 처리
    if (currentView.type === 'detail') {
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          // 왼쪽 스와이프 - 뒤로 가기
          handleBack();
        }
      }
      setDragOffset(0);
      setTouchStart({ x: 0, y: 0 });
      setTouchEnd({ x: 0, y: 0 });
      return;
    }

    // 탭 페이지에서 스와이프 처리
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    // 드래그 거리가 충분하거나 빠른 스와이프인 경우 탭 전환
    const swipeThreshold = 30; // 화면의 30% 이상 드래그하면 전환
    const shouldSwitch = Math.abs(dragOffset) > swipeThreshold || Math.abs(deltaX) > minSwipeDistance;
    
    if (shouldSwitch && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        // 왼쪽 스와이프 - 다음 탭 (오른쪽으로 이동)
        const nextIndex = currentTabIndex < tabs.length - 1 ? currentTabIndex + 1 : 0;
        setActiveTab(tabs[nextIndex].id);
      } else {
        // 오른쪽 스와이프 - 이전 탭 (왼쪽으로 이동)
        const prevIndex = currentTabIndex > 0 ? currentTabIndex - 1 : tabs.length - 1;
        setActiveTab(tabs[prevIndex].id);
      }
    }

    // 터치 상태 리셋
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
    setDragOffset(0);
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
      
      case 'scenario':
        // 시나리오 승인 시 영상 생성
        return {
          id: getNextId('video'),
          type: 'video',
          title: `${approvedItem.title} 영상`,
          description: `${approvedItem.title}를 기반으로 한 영상`,
          status: 'generating',
          feedbackCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          aiGenerated: true,
          worldviewId: approvedItem.worldviewId,
          characterId: approvedItem.characterId,
          scenarioId: approvedItem.id,
          workStatus: 'generating'
        };
      
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    // 상세 페이지 표시
    if (currentView.type === 'detail') {
      return (
        <div className="detail-view">
          <ItemDetail
            item={currentView.data}
            onBack={handleBack}
            onApprove={handleApprove}
            onFeedback={handleFeedback}
          />
        </div>
      );
    }

    // 현재 탭 인덱스 계산
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const totalOffset = slideOffset + dragOffset;

    return (
      <div className="tabs-container">
        <div 
          className="tabs-slider"
          style={{
            transform: `translateX(${-currentTabIndex * 100 + totalOffset}%)`,
            transition: isSliding ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {tabs.map((tab, index) => (
            <div key={tab.id} className="tab-slide">
              {tab.id === 'dashboard' && (
                <Dashboard 
                  itemsData={itemsData}
                  onItemClick={handleItemClick}
                />
              )}
              {tab.id === 'analysis' && <Analysis />}
              {tab.id === 'setting' && <Setting />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="app"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      {(canPull || isRefreshing) && (
        <div 
          className="pull-refresh-indicator"
          style={{
            transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
            opacity: Math.min(1, pullDistance / 60)
          }}
        >
          <div className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>
            {isRefreshing ? '🔄' : '↓'}
          </div>
          <span className="refresh-text">
            {isRefreshing ? '새로고침 중...' : pullDistance > 60 ? '놓아서 새로고침' : '아래로 당겨서 새로고침'}
          </span>
        </div>
      )}

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
          onClick={() => setActiveTab('dashboard')}
        >
          Avazon
        </h1>
        <button className="settings-button">
          ⚙️
        </button>
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
                setActiveTab(tab.id);
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
      <div 
        className="app-container"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: canPull && !isRefreshing ? 'none' : 'transform 0.3s ease'
        }}
      >
        <main className="main-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default App;