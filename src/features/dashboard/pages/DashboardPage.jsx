import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { CreateSeriesModal, ToastContainer } from '../../../shared/ui';
import { useToasts } from '../../../shared/ui/hooks/useToasts';
import { useItemsData } from '../hooks';
import KanbanColumn from '../components/KanbanColumn';

// 아이콘 imports
import iconCharacter from '../../../assets/icons/icon_character.svg';
import iconScenario from '../../../assets/icons/icon_scenario.svg';
import iconEpisode from '../../../assets/icons/icon_episode.svg';
import iconVideo from '../../../assets/icons/icon_video.svg';

const DashboardPage = ({ onItemClick, user, onCreateSeries }) => {
  const navigate = useNavigate();
  const { itemsData, isLoading: isItemsLoading, error, createSeries } = useItemsData();

  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast } = useToasts();

  // 시리즈 생성 핸들러
  const handleCreateSeries = async (userMessage) => {
    setIsLoading(true);
    try {
      await createSeries(userMessage, {
        onSuccess: () => {
          showToast('시리즈 초안 생성이 시작되었습니다.', 'success');
          setIsModalOpen(false);
        },
        onError: (error) => {
          const errorMessage = error.message || '시리즈 생성 중 오류가 발생했습니다.';
          showToast(errorMessage, 'error');
        },
      });
    } catch (error) {
      // 이 부분은 useMutation의 onError에서 처리되므로 비워두거나 제거할 수 있습니다.
    } finally {
      setIsLoading(false);
    }
  };

  // FloatingButton 클릭 핸들러를 부모로 전달
  const handleFloatingButtonClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // 컴포넌트가 마운트되거나 onCreateSeries prop이 변경될 때 핸들러 등록
  useEffect(() => {
    if (onCreateSeries) {
      onCreateSeries(handleFloatingButtonClick);
    }
  }, [onCreateSeries, handleFloatingButtonClick]);

  // React Hooks는 항상 컴포넌트 최상단에서 호출되어야 함
  // API 요청 예시 (사용자가 로그인된 후에만 실행)
  useEffect(() => {
    // user가 없으면 API 요청하지 않음
    if (!user) {
      console.log('사용자 정보 없음 - API 요청 스킵');
      return;
    }

    const fetchUserData = async () => {
      try {
        // 개발 모드에서는 API 요청을 스킵
        if (import.meta.env.VITE_DEV_MODE === 'true') {
          console.log('개발 모드: API 요청 스킵');
          return;
        }

        console.log('프로덕션 모드: 사용자 인증 완료 후 API 요청 진행');

        // authService.getCurrentUser()는 자동으로 Access Token을 헤더에 추가하고
        // 401 에러 시 토큰을 갱신한 후 재시도합니다
        const userData = await authService.getCurrentUser();
        console.log('User profile data:', userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // 인증 실패 시 로그인 페이지로 리디렉션 등의 처리를 여기서 할 수 있습니다
      }
    };

    fetchUserData();
  }, [user]); // user 의존성 추가

  // 조건부 렌더링은 Hooks 다음에 위치
  if (isItemsLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  const pendingItems = itemsData.pending;
  const workingItems = itemsData.working;
  // const approvedItems = itemsData.approved; // 현재 사용하지 않음

  // 캐릭터와 시리즈를 통합하여 시리즈로 표시
  const getMergedSeriesData = (category) => {
    const seriesItems = itemsData[category]?.series || [];
    const characterItems = itemsData[category]?.character || [];
    return [...seriesItems, ...characterItems];
  };

  

  const getItemIcon = (type) => {
    switch (type) {
      case 'character': return iconCharacter;
      case 'series': return iconScenario;
      case 'episode': return iconEpisode;
      case 'video': return iconVideo;
      default: return iconCharacter;
    }
  };

  // 아이템 클릭 핸들러 - 시리즈는 디테일 페이지로, 나머지는 기존 방식
  

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">DASHBOARD</h2>
      </div>

      {/* Kanban Board - 승인 대기 중인 아이템들 */}
      <div className="kanban-board">
        <div className="board-header">
          <h3 className="board-title">승인 대기 중인 아이템들</h3>
        </div>
        <div className="kanban-columns">
          <KanbanColumn
            title="시리즈"
            items={getMergedSeriesData('pending')}
            itemType="series"
            columnType="kanban"
            icon={getItemIcon('series')}
            onItemClick={onItemClick}
          />
          <KanbanColumn
            title="에피소드"
            items={pendingItems.episode}
            itemType="episode"
            columnType="kanban"
            icon={getItemIcon('episode')}
            onItemClick={onItemClick}
          />
          <KanbanColumn
            title="영상"
            items={pendingItems.video}
            itemType="video"
            columnType="kanban"
            icon={getItemIcon('video')}
            onItemClick={onItemClick}
          />
        </div>
      </div>

      {/* 작업 중인 아이템들 */}
      <div className="working-board">
        <div className="board-header">
          <h3 className="board-title">작업 중인 아이템들</h3>
          <p className="board-subtitle">AI가 수정 중이거나 새로 생성 중인 아이템들</p>
        </div>
        <div className="working-columns">
          <KanbanColumn
            title="시리즈"
            items={getMergedSeriesData('working')}
            itemType="series"
            columnType="working"
            icon={getItemIcon('series')}
            onItemClick={onItemClick}
          />
          <KanbanColumn
            title="에피소드"
            items={workingItems.episode}
            itemType="episode"
            columnType="working"
            icon={getItemIcon('episode')}
            onItemClick={onItemClick}
          />
          <KanbanColumn
            title="영상"
            items={workingItems.video}
            itemType="video"
            columnType="working"
            icon={getItemIcon('video')}
            onItemClick={onItemClick}
          />
        </div>
      </div>

      {/* 시리즈 생성 모달 */}
      <CreateSeriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSeries}
        loading={isLoading}
      />

      {/* 토스트 컨테이너 */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default DashboardPage;