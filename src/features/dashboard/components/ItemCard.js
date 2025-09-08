import React from 'react';
import { Card, Badge } from '../../../shared/ui';
import { formatDate, truncateText } from '../../../shared/lib';

/**
 * 아이템 카드 컴포넌트 (칸반 보드용)
 */
const ItemCard = ({ 
  item, 
  onClick,
  showFeedbackCount = true,
  showStatus = true,
  className = ''
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'review': return 'info';
      case 'revision': return 'danger';
      case 'draft': return 'primary';
      case 'generating': return 'info';
      case 'approved': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '승인 대기';
      case 'review': return '검토 중';
      case 'revision': return '수정 요청';
      case 'draft': return '초안';
      case 'generating': return 'AI 생성 중';
      case 'approved': return '승인 완료';
      default: return '대기';
    }
  };

  const getWorkStatusText = (workStatus) => {
    switch (workStatus) {
      case 'generating': return '🤖 생성 중';
      case 'revision_requested': return '✏️ 수정 중';
      default: return '🔄 작업 중';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'series': return '📚';
      case 'character': return '👤';
      case 'episode': return '📝';
      case 'video': return '🎬';
      default: return '📄';
    }
  };

  return (
    <Card 
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={() => onClick && onClick(item)}
    >
      {/* 카드 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTypeIcon(item.type)}</span>
          <h4 className="font-medium text-gray-900 text-sm leading-tight">
            {truncateText(item.title, 50)}
          </h4>
        </div>
        {showFeedbackCount && item.feedbackCount > 0 && (
          <Badge variant="info" size="small">
            💬 {item.feedbackCount}
          </Badge>
        )}
      </div>

      {/* 카드 설명 */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {truncateText(item.description, 80)}
      </p>

      {/* 카드 푸터 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {formatDate(item.createdAt, 'MM-DD')}
        </div>
        
        <div className="flex items-center space-x-2">
          {item.aiGenerated && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              AI
            </span>
          )}
          
          {showStatus && (
            <Badge 
              variant={getStatusColor(item.status)} 
              size="small"
            >
              {item.workStatus ? getWorkStatusText(item.workStatus) : getStatusText(item.status)}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * 작업 중 아이템 카드 (작업 상태 강조)
 */
export const WorkingItemCard = ({ item, onClick, className = '' }) => {
  return (
    <ItemCard 
      item={item}
      onClick={onClick}
      showFeedbackCount={true}
      showStatus={true}
      className={`border-l-4 border-blue-500 ${className}`}
    />
  );
};

/**
 * 승인 대기 아이템 카드
 */
export const PendingItemCard = ({ item, onClick, className = '' }) => {
  return (
    <ItemCard 
      item={item}
      onClick={onClick}
      showFeedbackCount={true}
      showStatus={true}
      className={`border-l-4 border-yellow-500 ${className}`}
    />
  );
};

export default ItemCard;