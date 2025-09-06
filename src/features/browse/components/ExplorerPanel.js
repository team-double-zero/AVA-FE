import React from 'react';
import { Card, Loading } from '../../../shared/ui';

/**
 * 탐색기 패널 컴포넌트
 */
const ExplorerPanel = ({ 
  title, 
  items = [], 
  selectedItem, 
  onItemSelect,
  isLoading = false,
  emptyMessage = '항목이 없습니다',
  emptyIcon = '📁',
  itemType = 'folder' // 'folder' | 'file'
}) => {
  const getItemIcon = (type) => {
    switch (type) {
      case 'series': return '📚';
      case 'episode': return '📝';
      case 'character': return '👤';
      case 'video': return '🎬';
      default: return itemType === 'folder' ? '📁' : '📄';
    }
  };

  return (
    <div className="explorer-panel bg-white border border-gray-200 rounded-lg">
      {/* 패널 헤더 */}
      <div className="panel-header px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>

      {/* 패널 콘텐츠 */}
      <div className="panel-content max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <Loading variant="skeleton" />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state p-6 text-center">
            <span className="text-3xl mb-2 block">{emptyIcon}</span>
            <div className="text-sm text-gray-500">{emptyMessage}</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className={`explorer-item flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedItem?.id === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => onItemSelect(item)}
              >
                <span className="text-lg mr-3">{getItemIcon(item.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="item-name font-medium text-gray-900 truncate">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
                {itemType === 'folder' && (
                  <span className="item-arrow text-gray-400 ml-2">▶</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 시리즈 탐색기 패널
 */
export const SeriesPanel = ({ series, selectedSeries, onSeriesSelect, isLoading }) => {
  return (
    <ExplorerPanel
      title="시리즈"
      items={series}
      selectedItem={selectedSeries}
      onItemSelect={onSeriesSelect}
      isLoading={isLoading}
      emptyMessage="등록된 시리즈가 없습니다"
      emptyIcon="📚"
      itemType="folder"
    />
  );
};

/**
 * 캐릭터 탐색기 패널
 */
export const CharacterPanel = ({ 
  characters, 
  onCharacterSelect, 
  isLoading, 
  selectedSeries 
}) => {
  return (
    <ExplorerPanel
      title="캐릭터"
      items={characters}
      selectedItem={null}
      onItemSelect={onCharacterSelect}
      isLoading={isLoading}
      emptyMessage={selectedSeries ? "등록된 캐릭터가 없습니다" : "시리즈를 선택해주세요"}
      emptyIcon="👤"
      itemType="file"
    />
  );
};

/**
 * 에피소드 탐색기 패널
 */
export const EpisodePanel = ({ 
  episodes, 
  selectedEpisode, 
  onEpisodeSelect, 
  isLoading, 
  selectedSeries 
}) => {
  return (
    <ExplorerPanel
      title="에피소드"
      items={episodes}
      selectedItem={selectedEpisode}
      onItemSelect={onEpisodeSelect}
      isLoading={isLoading}
      emptyMessage={selectedSeries ? "등록된 에피소드가 없습니다" : "시리즈를 선택해주세요"}
      emptyIcon="📝"
      itemType="folder"
    />
  );
};

export default ExplorerPanel;