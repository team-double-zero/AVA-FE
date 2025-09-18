import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { itemsData, isLoading: isItemsLoading, error } = useItemsData();
  const { createSeries } = useItemsData(); // createSeries만 별도로 가져올 수 있습니다.

  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, showToast } = useToasts();

  // 시리즈 생성 핸들러
  const handleCreateSeries = async (userMessage) => {
    setIsSubmitting(true);
    try {
      await createSeries(userMessage, {
        onSuccess: () => {
          showToast('시리즈 초안 생성이 시작되었습니다.', 'success');
          setIsModalOpen(false);
        },
        onError: (err) => {
          showToast(err.message || '시리즈 생성 중 오류가 발생했습니다.', 'error');
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFloatingButtonClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (onCreateSeries) {
      onCreateSeries(handleFloatingButtonClick);
    }
  }, [onCreateSeries, handleFloatingButtonClick]);

  if (isItemsLoading) {
    return (
      <div className="w-full min-h-full h-auto pb-4">
        <div className="mb-5 text-center">
          <h2 className="font-montserrat text-4xl font-bold text-white text-shadow-md">DASHBOARD</h2>
        </div>
        <div className="text-white text-center p-10">
          <div className="animate-pulse">
            <div className="text-xl mb-4">📊 대시보드 데이터를 불러오는 중...</div>
            <div className="text-sm text-white/70">잠시만 기다려주세요</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full min-h-full h-auto pb-4">
        <div className="mb-5 text-center">
          <h2 className="font-montserrat text-4xl font-bold text-white text-shadow-md">DASHBOARD</h2>
        </div>
        <div className="text-center p-10">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-300 text-xl mb-4">⚠️ 데이터 로딩 실패</div>
            <div className="text-red-200 text-sm mb-4">
              {error.message || '알 수 없는 오류가 발생했습니다'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingItems = itemsData.pending;
  const workingItems = itemsData.working;

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

  return (
    <div className="w-full min-h-full h-auto pb-0">
      <div className="mb-3 text-center">
        <h2 className="font-montserrat text-4xl font-bold text-white text-shadow-md">DASHBOARD</h2>
      </div>

      {/* Kanban Board - 승인 대기 중인 아이템들 */}
      <div className="mb-6">
        <div className="mb-3 text-center">
          <h3 className="text-2xl font-semibold text-white text-shadow">승인 대기 중인 아이템들</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
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
      <div className="mb-4">
        <div className="mb-3 text-center">
          <h3 className="text-2xl font-semibold text-white text-shadow">작업 중인 아이템들</h3>
          <p className="text-base text-white/80 text-shadow-sm">AI가 수정 중이거나 새로 생성 중인 아이템들</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
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

      <CreateSeriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSeries}
        loading={isSubmitting}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default DashboardPage;
