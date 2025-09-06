import React from 'react';
import { 
  SeriesPanel, 
  CharacterPanel, 
  EpisodePanel, 
  Breadcrumb, 
  DetailView 
} from '../components';
import { useExplorer, useSeriesCharacters, useSeriesEpisodes } from '../hooks';

/**
 * 브라우즈 페이지 컴포넌트
 */
const BrowsePage = ({ 
  itemsData, 
  onItemClick, 
  onApprove, 
  onFeedback 
}) => {
  const {
    selectedSeries,
    selectedEpisode,
    selectedItem,
    selectedItemType,
    breadcrumb,
    handleSeriesSelect,
    handleEpisodeSelect,
    handleCharacterSelect,
    clearSelection,
    getSeriesEpisodes,
    getSeriesCharacters,
  } = useExplorer(itemsData);

  // 승인된 시리즈 목록
  const approvedSeries = itemsData?.approved?.series || [];
  
  // 선택된 시리즈의 캐릭터들과 에피소드들
  const seriesCharacters = selectedSeries ? getSeriesCharacters(selectedSeries.id) : [];
  const seriesEpisodes = selectedSeries ? getSeriesEpisodes(selectedSeries.id) : [];

  const handleItemSelect = (item, type) => {
    if (type === 'character') {
      handleCharacterSelect(item);
    }
    
    // 기존 onItemClick 호출 (다른 탭에서 사용하는 경우)
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="browse-page">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">BROWSE</h1>
        <p className="text-gray-600">
          승인된 콘텐츠를 탐색하고 관리할 수 있습니다.
        </p>
      </div>

      <div className="browse-layout grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 탐색기 영역 */}
        <div className="explorer-section lg:col-span-1 space-y-4">
          {/* 브레드크럼 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Breadcrumb path={breadcrumb} />
          </div>

          {/* 탐색기 패널들 */}
          <div className="space-y-4">
            {/* 시리즈 패널 */}
            <SeriesPanel
              series={approvedSeries}
              selectedSeries={selectedSeries}
              onSeriesSelect={handleSeriesSelect}
              isLoading={false}
            />

            {/* 캐릭터 패널 */}
            <CharacterPanel
              characters={seriesCharacters}
              onCharacterSelect={(character) => handleItemSelect(character, 'character')}
              isLoading={false}
              selectedSeries={selectedSeries}
            />

            {/* 에피소드 패널 */}
            <EpisodePanel
              episodes={seriesEpisodes}
              selectedEpisode={selectedEpisode}
              onEpisodeSelect={handleEpisodeSelect}
              isLoading={false}
              selectedSeries={selectedSeries}
            />
          </div>
        </div>

        {/* 오른쪽 상세 보기 영역 */}
        <div className="detail-section lg:col-span-2">
          <DetailView
            item={selectedItem}
            onApprove={onApprove}
            onFeedback={onFeedback}
            onBack={clearSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;