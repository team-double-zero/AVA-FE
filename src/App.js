import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import Setting from './components/Setting';
import ItemDetail from './components/ItemDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import { getRefreshToken, refreshAccessToken, clearAllTokens } from './utils/tokenUtils';

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
          aiGenerated: true,
          content: '# 네오 시티 2087\n\n2087년, 기술과 자본이 지배하는 거대 도시입니다...',
          feedbackHistory: []
        },
        { 
          id: 2, 
          type: 'worldview',
          title: '판타지 왕국 설정', 
          description: '중세 판타지 배경', 
          status: 'review', 
          feedbackCount: 2,
          createdAt: '2024-01-14',
          aiGenerated: true,
          content: '# 아르카나 왕국\n\n마법이 존재하는 중세 판타지 세계...',
          feedbackHistory: []
        },
        { 
          id: 3, 
          type: 'worldview',
          title: '우주 정거장 배경', 
          description: 'SF 우주 정거장 설정', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-13',
          aiGenerated: true,
          content: '# 오메가 스테이션\n\n지구 궤도상의 거대한 우주 정거장...',
          feedbackHistory: []
        }
      ],
      character: [
        { 
          id: 1, 
          type: 'character',
          title: '주인공 - 알렉스', 
          description: '사이버 해커 캐릭터', 
          status: 'pending',
          feedbackCount: 1,
          createdAt: '2024-01-16',
          aiGenerated: true,
          worldviewId: 1,
          imageUrl: '/images/alex-character.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 알렉스 첸\n**나이**: 28세\n**직업**: 사이버 해커...',
          feedbackHistory: []
        },
        { 
          id: 2, 
          type: 'character',
          title: '조력자 - 미라', 
          description: '마법사 캐릭터', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-15',
          aiGenerated: true,
          worldviewId: 2,
          imageUrl: '/images/mira-character.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 미라 스톰\n**나이**: 25세\n**직업**: 궁정 마법사...',
          feedbackHistory: []
        },
        { 
          id: 3, 
          type: 'character',
          title: '빌런 - 다크로드', 
          description: '최종 보스 캐릭터', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-18',
          aiGenerated: true,
          worldviewId: 2,
          imageUrl: '/images/darklord-character.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 다크로드 바론\n**나이**: 불명\n**직업**: 어둠의 군주...',
          feedbackHistory: []
        }
      ],
      episode: [
        { 
          id: 1, 
          type: 'episode',
          title: '첫 번째 만남', 
          description: '주인공과 조력자의 첫 만남', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-20',
          aiGenerated: true,
          worldviewId: 1,
          content: '# 에피소드 1: 첫 번째 만남\n\n알렉스가 미라를 처음 만나는 순간...',
          feedbackHistory: []
        },
        { 
          id: 2, 
          type: 'episode',
          title: '비밀 임무', 
          description: '극비 해킹 임무', 
          status: 'pending',
          feedbackCount: 1,
          createdAt: '2024-01-19',
          aiGenerated: true,
          worldviewId: 1,
          content: '# 에피소드 2: 비밀 임무\n\n기업의 서버에 침투하는 위험한 임무...',
          feedbackHistory: []
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
          characterId: 1,
          content: '# 시나리오: 게임 시작\n\n**장면**: 네오 시티의 뒷골목\n\n알렉스: "이번 일만 성공하면..."',
          feedbackHistory: []
        },
        { 
          id: 2, 
          type: 'scenario',
          title: '중간 보스전 대본', 
          description: '중간 보스 대화', 
          status: 'pending',
          feedbackCount: 2,
          createdAt: '2024-01-16',
          aiGenerated: true,
          worldviewId: 1,
          characterId: 2,
          content: '# 시나리오: 중간 보스전\n\n**장면**: 폐허가 된 공장\n\n보스: "네가 그 해커로군..."',
          feedbackHistory: []
        },
        { 
          id: 3, 
          type: 'scenario',
          title: '최종 결전 시나리오', 
          description: '클라이맥스 장면', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-21',
          aiGenerated: true,
          worldviewId: 1,
          characterId: 3,
          content: '# 시나리오: 최종 결전\n\n**장면**: 네오 시티 중앙 타워 옥상\n\n다크로드: "마침내 만났군..."',
          feedbackHistory: []
        }
      ],
      video: [
        { 
          id: 1, 
          type: 'video',
          title: '오프닝 영상', 
          description: '게임 인트로 영상', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-22',
          aiGenerated: true,
          videoUrl: '/videos/opening-intro.mp4',
          duration: '00:02:30',
          feedbackHistory: []
        },
        { 
          id: 2, 
          type: 'video',
          title: '캐릭터 소개 영상', 
          description: '주요 캐릭터 소개', 
          status: 'pending',
          feedbackCount: 1,
          createdAt: '2024-01-21',
          aiGenerated: true,
          videoUrl: '/videos/character-intro.mp4',
          duration: '00:01:45',
          feedbackHistory: []
        },
        { 
          id: 3, 
          type: 'video',
          title: '게임플레이 트레일러', 
          description: '게임 플레이 영상', 
          status: 'pending',
          feedbackCount: 0,
          createdAt: '2024-01-20',
          aiGenerated: true,
          videoUrl: '/videos/gameplay-trailer.mp4',
          duration: '00:03:15',
          feedbackHistory: []
        }
      ]
    },
    working: {
      worldview: [
        { 
          id: 4, 
          type: 'worldview',
          title: '우주 전쟁 배경', 
          description: 'SF 우주 배경 설정', 
          status: 'generating',
          feedbackCount: 3,
          createdAt: '2024-01-13',
          aiGenerated: true,
          workStatus: 'revision_requested',
          content: '# 은하계 전쟁\n\n서기 3021년, 은하계를 뒤흔드는 대전쟁...',
          feedbackHistory: []
        }
      ],
      character: [
        { 
          id: 4, 
          type: 'character',
          title: '사령관 - 라이더', 
          description: '우주 함대 사령관', 
          status: 'generating',
          feedbackCount: 1,
          createdAt: '2024-01-15',
          aiGenerated: true,
          worldviewId: 3,
          workStatus: 'revision_requested',
          imageUrl: '/images/rider-character.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 라이더 스카이\n**나이**: 35세\n**직업**: 함대 사령관...',
          feedbackHistory: []
        }
      ],
      episode: [
        { 
          id: 3, 
          type: 'episode',
          title: '첫 번째 전투', 
          description: '초기 전투 시퀀스', 
          status: 'generating',
          feedbackCount: 0,
          createdAt: '2024-01-18',
          aiGenerated: true,
          worldviewId: 3,
          workStatus: 'generating',
          content: '# 에피소드 3: 첫 번째 전투\n\n함대가 적과 조우하는 순간...',
          feedbackHistory: []
        }
      ],
      scenario: [
        { 
          id: 4, 
          type: 'scenario',
          title: '작전 회의 시나리오', 
          description: '전략 회의 장면', 
          status: 'generating',
          feedbackCount: 2,
          createdAt: '2024-01-16',
          aiGenerated: true,
          worldviewId: 3,
          characterId: 4,
          workStatus: 'revision_requested',
          content: '# 시나리오: 작전 회의\n\n**장면**: 사령부 회의실\n\n라이더: "이번 작전은 매우 중요하다..."',
          feedbackHistory: []
        }
      ],
      video: [
        { 
          id: 4, 
          type: 'video',
          title: '전투 시퀀스 영상', 
          description: '우주 전투 장면', 
          status: 'generating',
          feedbackCount: 1,
          createdAt: '2024-01-17',
          aiGenerated: true,
          videoUrl: '/videos/space-battle.mp4',
          duration: '00:04:20',
          workStatus: 'generating',
          feedbackHistory: []
        }
      ]
    },
    approved: {
      worldview: [
        { 
          id: 5, 
          type: 'worldview', 
          title: '메인 도시 설정', 
          description: '중앙 도시 배경',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-10',
          aiGenerated: true,
          content: '# 메인 도시 - 아르카디아\n\n게임의 중심이 되는 번화한 도시입니다. 상점들과 여관, 그리고 모험가 길드가 위치해 있습니다...',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'worldview', 
          title: '던전 설정', 
          description: '지하 던전 배경',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-09',
          aiGenerated: true,
          content: '# 고대 유적 던전\n\n오래된 마법사들의 탑 지하에 숨겨진 던전입니다. 다양한 몬스터들과 보물이 기다리고 있습니다...',
          feedbackHistory: []
        }
      ],
      character: [
        { 
          id: 5, 
          type: 'character', 
          title: '상점 NPC', 
          description: '아이템 판매 캐릭터',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-08',
          aiGenerated: true,
          worldviewId: 5,
          imageUrl: '/images/shop-keeper.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 머로우 상인\n**나이**: 45세\n**직업**: 잡화점 주인\n\n친절하고 정직한 상인으로 모험가들에게 필요한 아이템들을 판매합니다...',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'character', 
          title: '가이드 NPC', 
          description: '튜토리얼 가이드',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-07',
          aiGenerated: true,
          worldviewId: 5,
          imageUrl: '/images/guide-npc.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 엘라 가이드\n**나이**: 28세\n**직업**: 신규 모험가 안내원\n\n새로운 모험가들을 도와주는 친절한 가이드입니다...',
          feedbackHistory: []
        }
      ],
      episode: [
        { 
          id: 4, 
          type: 'episode', 
          title: '프롤로그', 
          description: '이야기의 시작',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-06',
          aiGenerated: true,
          worldviewId: 5,
          content: '# 에피소드 1: 프롤로그\n\n새로운 모험가가 아르카디아 도시에 도착하는 순간부터 이야기가 시작됩니다...',
          feedbackHistory: []
        },
        { 
          id: 5, 
          type: 'episode', 
          title: '튜토리얼', 
          description: '게임 사용법 안내',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-05',
          aiGenerated: true,
          worldviewId: 5,
          content: '# 에피소드 2: 튜토리얼\n\n플레이어가 게임의 기본 조작법과 시스템을 배우는 에피소드입니다...',
          feedbackHistory: []
        }
      ],
      scenario: [
        { 
          id: 5, 
          type: 'scenario', 
          title: '튜토리얼 시나리오', 
          description: '초기 학습 과정',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-04',
          aiGenerated: true,
          worldviewId: 5,
          characterId: 6,
          content: '# 시나리오: 튜토리얼\n\n**장면**: 아르카디아 도시 광장\n\n엘라: "안녕하세요! 새로운 모험가시군요. 제가 도움을 드리겠습니다..."',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'scenario', 
          title: '첫 번째 퀘스트', 
          description: '첫 임무 대본',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-03',
          aiGenerated: true,
          worldviewId: 5,
          characterId: 5,
          content: '# 시나리오: 첫 번째 퀘스트\n\n**장면**: 머로우의 잡화점\n\n머로우: "이런, 창고에서 물건이 좀 없어졌어요. 도와주실 수 있나요?"',
          feedbackHistory: []
        }
      ],
      video: [
        { 
          id: 5, 
          type: 'video', 
          title: '튜토리얼 영상', 
          description: '게임 가이드 영상',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-02',
          aiGenerated: true,
          videoUrl: '/videos/tutorial-guide.mp4',
          duration: '00:02:30',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'video', 
          title: '엔딩 영상', 
          description: '게임 엔딩 시퀀스',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-01',
          aiGenerated: true,
          videoUrl: '/videos/ending-sequence.mp4',
          duration: '00:05:45',
          feedbackHistory: []
        }
      ]
    }
  });

  // useEffect는 hooks 중에서 useState 다음에 배치
  useEffect(() => {
    const initializeAuth = async () => {
      // 개발 모드에서는 토큰 복원을 스킵
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        console.log('개발 모드: 토큰 복원 스킵');
        return;
      }

      const userData = localStorage.getItem('userData');
      const refreshToken = getRefreshToken();
      
      if (userData && refreshToken) {
        try {
          const parsedUserData = JSON.parse(userData);
          
          // Refresh Token으로 새로운 Access Token 요청
          await refreshAccessToken();
          
          // 성공하면 사용자 상태 설정
          setUser(parsedUserData);
          console.log('Authentication restored with new access token');
          
        } catch (error) {
          console.error('Failed to restore authentication:', error);
          // 토큰 갱신 실패 시 모든 데이터 정리
          clearAllTokens();
        }
      } else if (userData || refreshToken) {
        // 일부 데이터만 있는 경우 정리
        console.log('Incomplete authentication data, clearing...');
        clearAllTokens();
      }
    };

    initializeAuth();
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
    clearAllTokens();
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
        {currentView.type === 'detail' ? (
          <ItemDetail
            item={currentView.data}
            onBack={handleBack}
            onApprove={handleApprove}
            onFeedback={handleFeedback}
          />
        ) : (
          <main className="main-content">
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
          </main>
        )}
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
