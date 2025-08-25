import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Browse from './components/Browse';
import Analysis from './components/Analysis';
import Setting from './components/Setting';
import ItemDetail from './components/ItemDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import { getRefreshToken, refreshAccessToken, clearAllTokens } from './utils/tokenUtils';

// 아이콘 imports
import iconDashboard from './icons/icon_dashboard.svg';
import iconBrowser from './icons/icon_browser.svg';
import iconAnalysis from './icons/icon_analysis.svg';
import iconSetting from './icons/icon_setting.svg';

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
          title: '아르카디아 왕국', 
          description: '판타지 중세 세계관',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-10',
          aiGenerated: true,
          content: '# 아르카디아 왕국\n\n마법과 검이 공존하는 판타지 세계. 왕국의 중심에는 광대한 도시 아르카디아가 있고, 주변을 다양한 던전과 위험한 지역이 둘러싸고 있다. 왕국의 평화는 용맹한 모험가들에 의해 지켜지고 있다...',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'worldview', 
          title: '네오 시티 2087', 
          description: '사이버펑크 미래 세계',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-09',
          aiGenerated: true,
          content: '# 네오 시티 2087\n\n2087년, 거대 기업들이 세계를 지배하는 디스토피아 미래. 네온 불빛이 가득한 도시는 첨단 기술과 사회적 불평등이 공존한다. 사이버 개조와 인공지능이 일상화된 세계에서 해커들과 반란군들이 시스템에 저항한다...',
          feedbackHistory: []
        }
      ],
      character: [
        { 
          id: 5, 
          type: 'character', 
          title: '머로우 상인', 
          description: '아이템 판매 캐릭터',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-08',
          aiGenerated: true,
          worldviewId: 5,
          episodeId: 4,
          imageUrl: '/images/shop-keeper.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 머로우 상인\n**나이**: 45세\n**직업**: 잡화점 주인\n\n친절하고 정직한 상인으로 모험가들에게 필요한 아이템들을 판매합니다. 왕국 전역을 여행하며 수집한 다양한 이야기도 들려줍니다...',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'character', 
          title: '엘라 가이드', 
          description: '튜토리얼 가이드',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-07',
          aiGenerated: true,
          worldviewId: 5,
          episodeId: 5,
          imageUrl: '/images/guide-npc.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 엘라 가이드\n**나이**: 28세\n**직업**: 신규 모험가 안내원\n\n모험가 길드의 새 회원들을 안내하는 역할을 맡고 있습니다. 친절하고 유쾌한 성격으로 신규 모험가들에게 인기가 많습니다...',
          feedbackHistory: []
        },
        { 
          id: 7, 
          type: 'character', 
          title: '제이크 레이서', 
          description: '사이버 레이서',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-06',
          aiGenerated: true,
          worldviewId: 6,
          episodeId: 6,
          imageUrl: '/images/cyber-racer.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 제이크 레이서\n**나이**: 25세\n**직업**: 언더그라운드 레이서\n\n네오 시티의 불법 레이싱 챔피언. 사이버넷 해킹 능력과 뛰어난 드라이빙 기술을 겸비했다. 거대 기업 마크로텍의 비밀을 우연히 알게 된 후 쫓기는 신세가 됨...',
          feedbackHistory: []
        },
        { 
          id: 8, 
          type: 'character', 
          title: '아이리스', 
          description: 'AI 해킹 전문가',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-05',
          aiGenerated: true,
          worldviewId: 6,
          episodeId: 7,
          imageUrl: '/images/ai-hacker.jpg',
          content: '## 캐릭터 프로필\n\n**이름**: 아이리스\n**나이**: 23세\n**직업**: 해커\n\n천재적인 해킹 실력을 가진 저항군 멤버. 10대 시절 자신의 뇌에 신경 인터페이스를 직접 이식해 AI와 직접 통신할 수 있는 능력을 가지게 됨. 거대 기업들의 정보를 훔쳐 저항군에 제공...',
          feedbackHistory: []
        }
      ],
      episode: [
        { 
          id: 4, 
          type: 'episode', 
          title: '아르카디아 프롤로그', 
          description: '모험의 시작',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-06',
          aiGenerated: true,
          worldviewId: 5,
          content: '# 에피소드 1: 아르카디아 프롤로그\n\n주인공이 아르카디아 왕국에 처음 도착하는 이야기. 모험가 길드에 등록하고 첫 임무를 받기까지의 과정을 다룬다. 처음으로 머로우 상인과 만나게 되고, 왕국의 주요 지역들을 소개받는다...',
          feedbackHistory: []
        },
        { 
          id: 5, 
          type: 'episode', 
          title: '아르카디아 튜토리얼', 
          description: '기본 시스템 학습',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-05',
          aiGenerated: true,
          worldviewId: 5,
          content: '# 에피소드 2: 아르카디아 튜토리얼\n\n엘라 가이드의 안내로 게임의 기본 시스템을 배우는 에피소드. 전투, 아이템 사용, 스킬 시스템 등을 익히고 간단한 전투 시뮬레이션을 통해 플레이어가 게임 메커니즘에 적응할 수 있도록 돕는다...',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'episode', 
          title: '네오 시티의 밤', 
          description: '레이싱 대결',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-04',
          aiGenerated: true,
          worldviewId: 6,
          content: '# 에피소드 1: 네오 시티의 밤\n\n네온 불빛으로 가득한 네오 시티의 밤거리에서 펼쳐지는 불법 레이싱 대회를 중심으로 이야기가 시작된다. 주인공 제이크는 대회에서 우승하며 명성을 쌓지만, 레이스 도중 마크로텍 기업의 비밀 정보가 담긴 데이터 칩을 우연히 획득하게 된다...',
          feedbackHistory: []
        },
        { 
          id: 7, 
          type: 'episode', 
          title: '디지털 저항군', 
          description: '마크로텍에 대항',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-03',
          aiGenerated: true,
          worldviewId: 6,
          content: '# 에피소드 2: 디지털 저항군\n\n마크로텍 기업의 보안 부대에 쫓기는 제이크는 해커 아이리스와 만나 저항군에 합류한다. 이들은 마크로텍이 개발 중인 뇌 제어 시스템의 존재를 밝혀내고, 이를 막기 위한 계획을 세운다...',
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
          episodeId: 5,
          characterId: 6,
          content: '# 시나리오: 튜토리얼\n\n**장면**: 아르카디아 도시 광장\n\n엘라: "안녕하세요! 새로운 모험가시군요. 제가 도움을 드리겠습니다. 먼저 기본적인 조작법부터 알려드릴게요..."\n\n[플레이어는 엘라의 안내에 따라 이동, 공격, 아이템 사용 등의 기본 조작을 배운다]\n\n엘라: "잘 하셨어요! 이제 간단한 전투 훈련을 해볼까요? 저기 훈련용 허수아비로 기본 공격을 시도해보세요."',
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
          episodeId: 4,
          characterId: 5,
          content: '# 시나리오: 첫 번째 퀘스트\n\n**장면**: 머로우의 잡화점\n\n머로우: "어서 오세요, 새로운 모험가님! 제 가게에 오신 것을 환영합니다."\n\n[플레이어는 상점을 둘러본다]\n\n머로우: "이런, 창고에서 물건이 좀 없어졌어요. 도시 외곽의 고블린들이 약탈한 것 같은데... 혹시 도와주실 수 있나요? 물건을 되찾아오시면 특별한 보상을 드리겠습니다."',
          feedbackHistory: []
        },
        { 
          id: 7, 
          type: 'scenario', 
          title: '레이스 대결', 
          description: '불법 레이싱 장면',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-02',
          aiGenerated: true,
          worldviewId: 6,
          episodeId: 6,
          characterId: 7,
          content: '# 시나리오: 레이스 대결\n\n**장면**: 네오 시티 언더그라운드 서킷\n\n[화려한 네온사인과 개조된 호버카들이 출발선에 늘어서 있다]\n\nMC: "레이디스 앤 젠틀맨! 오늘 밤의 메인 이벤트! 디펜딩 챔피언 제이크 레이서와 새로운 도전자 블랙 쉐도우의 대결!"\n\n제이크: "이번에도 내가 우승할 거야. 준비됐어, 쉐도우?"\n\n블랙 쉐도우: "오늘 밤, 네 연승 기록은 끝날 거다."\n\n[경적 소리와 함께 레이스 시작]',
          feedbackHistory: []
        },
        { 
          id: 8, 
          type: 'scenario', 
          title: '해커의 잠입', 
          description: '마크로텍 침투',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-01',
          aiGenerated: true,
          worldviewId: 6,
          episodeId: 7,
          characterId: 8,
          content: '# 시나리오: 해커의 잠입\n\n**장면**: 마크로텍 본사 보안 게이트\n\n아이리스: "이 게이트의 보안 시스템은 최고 수준이야. 내 신경 인터페이스로 해킹해볼게."\n\n[아이리스는 눈을 감고 집중하며 디지털 세계와 연결된다]\n\n아이리스: "보안 프로토콜이 계속 변하고 있어... 하지만 패턴을 발견했어. 30초 안에 문을 열 수 있을 거야."\n\n제이크: "서둘러. 보안 드론이 이쪽으로 오고 있어."',
          feedbackHistory: []
        }
      ],
      video: [
        { 
          id: 5, 
          type: 'video', 
          title: '아르카디아 튜토리얼 영상', 
          description: '게임 가이드 영상',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-02',
          aiGenerated: true,
          worldviewId: 5,
          episodeId: 5,
          videoUrl: '/videos/tutorial-guide.mp4',
          duration: '00:02:30',
          feedbackHistory: []
        },
        { 
          id: 6, 
          type: 'video', 
          title: '아르카디아 프롤로그 시네마틱', 
          description: '게임 오프닝 시퀀스',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-01',
          aiGenerated: true,
          worldviewId: 5,
          episodeId: 4,
          videoUrl: '/videos/prologue-cinematic.mp4',
          duration: '00:03:45',
          feedbackHistory: []
        },
        { 
          id: 7, 
          type: 'video', 
          title: '네오 시티 레이스 트레일러', 
          description: '레이싱 시퀀스 영상',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-01',
          aiGenerated: true,
          worldviewId: 6,
          episodeId: 6,
          videoUrl: '/videos/neo-city-race.mp4',
          duration: '00:02:15',
          feedbackHistory: []
        },
        { 
          id: 8, 
          type: 'video', 
          title: '디지털 저항군 티저', 
          description: '해킹 시퀀스 영상',
          status: 'approved',
          feedbackCount: 0,
          createdAt: '2024-01-01',
          aiGenerated: true,
          worldviewId: 6,
          episodeId: 7,
          videoUrl: '/videos/digital-resistance.mp4',
          duration: '00:01:45',
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
    clearAllTokens();
    setUser(null);
  };

  // 스와이프 이벤트 핸들러
  const handleTouchStart = (e) => {
    if (!isSwipingAllowed || currentView.type === 'detail') return;
    
    // 이미 스와이프 처리 중이면 무시 (더 엄격하게 체크)
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
    
    console.log('Touch Start:', { x: e.touches[0].clientX, y: e.touches[0].clientY, canSwipe });
  };

  const handleTouchMove = (e) => {
    if (!isSwipingAllowed || !touchStart.x || currentView.type === 'detail' || !canSwipe) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    setTouchEnd({
      x: currentX,
      y: currentY
    });

    // 스와이프 방향 미리 계산 및 표시
    const deltaX = touchStart.x - currentX;
    const deltaY = touchStart.y - currentY;
    
    console.log('Touch Move Delta:', { deltaX, deltaY, abs: { x: Math.abs(deltaX), y: Math.abs(deltaY) } });
    
    // 이동 거리가 충분히 클 때만 방향 판단
    if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
      // 가로 스와이프가 세로 스와이프보다 클 때
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setIsHorizontalSwipe(true);
        setIsSwiping(true);
        
        const currentTabIndex = getTabIndex(activeTab);
        const maxDelta = window.innerWidth * 0.4; // 화면 폭의 40%를 최대 드래그로 설정
        const normalizedDelta = Math.max(-maxDelta, Math.min(maxDelta, deltaX));
        
        // 탭 경계 확인
        const isAtLeftBoundary = currentTabIndex === 0 && deltaX < 0;
        const isAtRightBoundary = currentTabIndex === tabs.length - 1 && deltaX > 0;
        
        if (!isAtLeftBoundary && !isAtRightBoundary) {
          // 스와이프 오프셋 계산 (25% 기준으로 조정)
          const offsetPercentage = (normalizedDelta / maxDelta) * 25; // 25% = 100% / 4 tabs
          setSwipeOffset(offsetPercentage);
          
          // 진행률 계산 (더 관대하게 설정)
          const progress = Math.abs(deltaX) / swipeThreshold;
          setSwipeProgress(Math.min(progress, 1));
          
          // 스와이프 방향 설정
          setSwipeDirection(deltaX > 0 ? 'left' : 'right');
          
          console.log('Swipe offset:', offsetPercentage, 'Progress:', progress);
        }
        
        // 가로 스와이프로 판단되면 기본 스크롤 방지
        e.preventDefault();
        e.stopPropagation();
        console.log('Horizontal swipe detected, preventing scroll');
      } else {
        // 세로 스와이프는 기본 스크롤 허용
        setIsHorizontalSwipe(false);
        setSwipeDirection(null);
        setIsSwiping(false);
        console.log('Vertical swipe detected, allowing scroll');
      }
    }
  };

  const handleTouchEnd = (e) => {
    console.log('Touch End Called', { canSwipe, isHorizontalSwipe, isSwiping });
    
    // 이미 스와이프 처리 중이면 무시 (가장 먼저 체크)
    if (!canSwipe) {
      console.log('Already processing swipe, ignoring');
      return;
    }
    
    // 가로 스와이프가 아니었다면 처리하지 않음
    if (!isHorizontalSwipe || !isSwiping) {
      resetSwipeState();
      console.log('Not horizontal swipe, ignoring');
      return;
    }
    
    // 스와이프 처리 시작 - 즉시 canSwipe를 false로 설정하여 중복 실행 방지
    setCanSwipe(false);
    
    // 가로 스와이프인 경우 기본 동작 방지
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSwipingAllowed || !touchStart.x || !touchEnd.x || currentView.type === 'detail') {
      resetSwipeState();
      // 일정 시간 후 canSwipe 복원
      setTimeout(() => setCanSwipe(true), 300);
      return;
    }

    const deltaX = touchStart.x - touchEnd.x;
    const deltaTime = Date.now() - touchStart.time;
    const maxSwipeTime = 800; // 최대 스와이프 시간 증가

    console.log('Swipe Analysis:', { 
      deltaX, 
      deltaTime, 
      swipeThreshold,
      absX: Math.abs(deltaX),
      swipeProgress,
      canSwipe
    });

    // 스와이프 시간이 너무 길면 무시
    if (deltaTime > maxSwipeTime) {
      console.log('Swipe too slow');
      resetSwipeState();
      setTimeout(() => setCanSwipe(true), 300);
      return;
    }
    
    // 임계점 확인 - 더 관대한 조건
    const shouldChangeTab = Math.abs(deltaX) >= swipeThreshold * 0.6 || swipeProgress >= 0.25;
    
    if (shouldChangeTab) {
      // 탭 페이지에서 스와이프 처리
      const currentTabIndex = getTabIndex(activeTab);
      console.log('Current tab index:', currentTabIndex, 'Active tab:', activeTab);
      
      if (deltaX > 0 && currentTabIndex < tabs.length - 1) {
        // 왼쪽 스와이프 - 다음 탭 (dashboard → browse → analysis → setting)
        console.log('Swiping to next tab:', tabs[currentTabIndex + 1].id);
        handleTabChange(tabs[currentTabIndex + 1].id);
      } else if (deltaX < 0 && currentTabIndex > 0) {
        // 오른쪽 스와이프 - 이전 탭
        console.log('Swiping to previous tab:', tabs[currentTabIndex - 1].id);
        handleTabChange(tabs[currentTabIndex - 1].id);
      } else {
        console.log('No tab change - at boundary');
      }
      
      // 탭 전환 후 더 긴 대기 시간
      setTimeout(() => setCanSwipe(true), 500);
    } else {
      console.log('Swipe not strong enough, reverting');
      // 탭 전환하지 않을 때는 짧은 대기 시간
      setTimeout(() => setCanSwipe(true), 300);
    }

    // 스와이프 상태 리셋
    resetSwipeState();
  };

  // 스와이프 상태 리셋 함수
  const resetSwipeState = () => {
    console.log('Resetting swipe state');
    setTouchStart({ x: 0, y: 0, time: 0 });
    setTouchEnd({ x: 0, y: 0 });
    setSwipeDirection(null);
    setIsHorizontalSwipe(false);
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeOffset(0);
    // canSwipe는 여기서 리셋하지 않음 - 각 핸들러에서 타이머로 관리
  };

  // 휠 이벤트 핸들러 (좌우 스크롤로 탭 전환)
  const handleWheel = (e) => {
    if (!isSwipingAllowed || currentView.type === 'detail') return;

    // 이미 처리 중이면 무시 (가장 먼저 체크)
    if (!canSwipe) {
      console.log('Wheel: Already processing, ignoring');
      return;
    }

    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
    const minWheelDistance = 30; // 최소 휠 이동 거리

    console.log('Wheel Event:', { deltaX, deltaY, canSwipe });

    // 세로 스크롤이 가로 스크롤보다 크면 무시 (기본 스크롤 허용)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      console.log('Vertical wheel detected, allowing default scroll');
      return;
    }

    // 휠 이동 거리가 최소 거리보다 작으면 무시
    if (Math.abs(deltaX) < minWheelDistance) {
      console.log('Wheel distance too small:', Math.abs(deltaX));
      return;
    }

    // 휠 처리 시작 - 즉시 canSwipe를 false로 설정하여 중복 실행 방지
    setCanSwipe(false);

    // 가로 스크롤이 확실한 경우에만 기본 동작 방지
    e.preventDefault();

    // 연속 휠 이벤트 방지를 위한 디바운싱
    if (wheelTimeout) {
      clearTimeout(wheelTimeout);
    }

    const currentTabIndex = getTabIndex(activeTab);
    console.log('Wheel - Current tab index:', currentTabIndex, 'Active tab:', activeTab);

    // 스와이프 방향 표시
    const direction = deltaX > 0 ? 'left' : 'right';
    setSwipeDirection(direction);

    // 휠 방향에 따른 탭 전환
    if (deltaX > 0 && currentTabIndex < tabs.length - 1) {
      // 오른쪽 스크롤 - 다음 탭
      console.log('Wheel scrolling to next tab:', tabs[currentTabIndex + 1].id);
      handleTabChange(tabs[currentTabIndex + 1].id);
    } else if (deltaX < 0 && currentTabIndex > 0) {
      // 왼쪽 스크롤 - 이전 탭
      console.log('Wheel scrolling to previous tab:', tabs[currentTabIndex - 1].id);
      handleTabChange(tabs[currentTabIndex - 1].id);
    } else {
      console.log('No tab change - at boundary or invalid wheel scroll');
    }

    // 스와이프 방향 표시를 일정 시간 후 제거
    const newTimeout = setTimeout(() => {
      setSwipeDirection(null);
    }, 300);
    setWheelTimeout(newTimeout);

    // canSwipe 복원
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

      {/* Debug Info - 개발 모드에서만 표시 (기본적으로 숨김) */}
      {process.env.NODE_ENV === 'development' && false && (
        <div className="debug-info">
          <div>Active Tab: {activeTab}</div>
          <div>Touch Start: {touchStart.x}, {touchStart.y}</div>
          <div>Touch End: {touchEnd.x}, {touchEnd.y}</div>
          <div>Swipe Direction: {swipeDirection || 'none'}</div>
          <div>Is Horizontal: {isHorizontalSwipe ? 'Yes' : 'No'}</div>
          <div>Swiping Allowed: {isSwipingAllowed ? 'Yes' : 'No'}</div>
          <div>Current View: {currentView.type}</div>
          <div>Is Swiping: {isSwiping ? 'Yes' : 'No'}</div>
          <div>Swipe Progress: {Math.round(swipeProgress * 100)}%</div>
          <div>Swipe Offset: {swipeOffset.toFixed(1)}%</div>
          <div>Can Swipe: {canSwipe ? 'Yes' : 'No'}</div>
          <div>💡 Use horizontal scroll or touch swipe</div>
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
      <div className="app-container">
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
            {/* Dashboard Tab Panel */}
            <div className="tab-panel">
              <main className="main-content">
                <Dashboard 
                  itemsData={itemsData}
                  onItemClick={handleItemClick}
                />
              </main>
            </div>

            {/* Browse Tab Panel */}
            <div className="tab-panel">
              <main className="main-content">
                <Browse 
                  itemsData={itemsData}
                  onItemClick={handleItemClick}
                />
              </main>
            </div>

            {/* Analysis Tab Panel */}
            <div className="tab-panel">
              <main className="main-content">
                <Analysis />
              </main>
            </div>

            {/* Setting Tab Panel */}
            <div className="tab-panel">
              <main className="main-content">
                <Setting />
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
                className={`tab-icon ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                title={tab.label}
              >
                <img src={tab.icon} alt={tab.label} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="header-right">
          <span className="user-name">{user?.nickname ? `${user.nickname}님` : `${user?.email}님`}</span>
        </div>
      </footer>
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
