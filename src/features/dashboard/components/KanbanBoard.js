import React from 'react';
import { Card } from '../../../shared/ui';
import { PendingItemCard, WorkingItemCard } from './ItemCard';

/**
 * 칸반 보드 컴포넌트
 */
const KanbanBoard = ({ 
  title, 
  subtitle,
  items, 
  onItemClick,
  isLoading = false,
  emptyMessage = '등록된 항목이 없습니다',
  cardType = 'pending' // 'pending' | 'working'
}) => {
  const types = [
    { key: 'series', title: '시리즈', icon: '📚' },
    { key: 'episode', title: '에피소드', icon: '📝' },
    { key: 'video', title: '영상', icon: '🎬' },
  ];

  const renderColumn = (type) => {
    const typeItems = items[type.key] || [];
    
    return (
      <div key={type.key} className="flex-1 min-w-0">
        {/* 컬럼 헤더 */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{type.icon}</span>
            <h3 className="font-medium text-gray-900">{type.title}</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
              {typeItems.length}
            </span>
          </div>
        </div>

        {/* 컬럼 콘텐츠 */}
        <div className="space-y-3">
          {isLoading ? (
            // 로딩 스켈레톤
            Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ))
          ) : typeItems.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-gray-400">
                <span className="text-2xl mb-2 block">{type.icon}</span>
                <p className="text-sm">{emptyMessage}</p>
              </div>
            </Card>
          ) : (
            typeItems.map((item) => {
              const CardComponent = cardType === 'working' ? WorkingItemCard : PendingItemCard;
              // 아이템에 타입 정보 추가
              const itemWithType = { ...item, type: type.key };
              return (
                <CardComponent
                  key={item.id}
                  item={itemWithType}
                  onClick={onItemClick}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 보드 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* 보드 콘텐츠 */}
      <div className="p-6">
        <div className="flex space-x-6 overflow-x-auto">
          {types.map(type => renderColumn(type))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;