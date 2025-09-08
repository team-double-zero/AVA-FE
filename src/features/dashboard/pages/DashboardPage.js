import React from 'react';
import { KPICardGrid, KanbanBoard } from '../components';
import { useCalculatedMetrics } from '../hooks';

/**
 * 대시보드 페이지 컴포넌트
 */
const DashboardPage = ({ 
  itemsData, 
  onItemClick, 
  user,
  isLoading = false 
}) => {
  const metrics = useCalculatedMetrics(itemsData);

  return (
    <div className="dashboard-page">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">DASHBOARD</h1>
        <p className="text-gray-600">
          안녕하세요, {user?.username || user?.nickname || user?.email || '사용자'}님! 
          오늘도 멋진 콘텐츠를 만들어보세요.
        </p>
      </div>

      {/* KPI 카드 그리드 */}
      <div className="mb-8">
        <KPICardGrid metrics={metrics} isLoading={isLoading} />
      </div>

      {/* 승인 대기 중인 아이템들 */}
      <div className="mb-8">
        <KanbanBoard
          title="승인 대기 중인 아이템들"
          subtitle="검토가 필요한 AI 생성 콘텐츠입니다"
          items={itemsData?.pending || {}}
          onItemClick={onItemClick}
          isLoading={isLoading}
          cardType="pending"
          emptyMessage="승인 대기 중인 항목이 없습니다"
        />
      </div>

      {/* 작업 중인 아이템들 */}
      <div className="mb-8">
        <KanbanBoard
          title="작업 중인 아이템들"
          subtitle="AI가 수정 중이거나 새로 생성 중인 아이템들입니다"
          items={itemsData?.working || {}}
          onItemClick={onItemClick}
          isLoading={isLoading}
          cardType="working"
          emptyMessage="작업 중인 항목이 없습니다"
        />
      </div>

      {/* 추가 정보 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">💡 사용 팁</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 좌우 스와이프로 탭을 전환할 수 있습니다</li>
            <li>• 아이템을 클릭하면 상세 내용을 확인할 수 있습니다</li>
            <li>• 피드백을 통해 AI가 더 나은 콘텐츠를 생성합니다</li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">📊 오늘의 활동</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>생성된 콘텐츠:</span>
              <span className="font-medium">{metrics.todayGenerated}개</span>
            </div>
            <div className="flex justify-between">
              <span>이번 주 생성:</span>
              <span className="font-medium">{metrics.weeklyGenerated}개</span>
            </div>
            <div className="flex justify-between">
              <span>전체 아이템:</span>
              <span className="font-medium">
                {metrics.totalSeries + metrics.totalEpisodes + metrics.totalVideos}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;