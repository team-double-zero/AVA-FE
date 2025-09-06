import React from 'react';
import { Card, Badge, Button } from '../../../shared/ui';
import { formatDate } from '../../../shared/lib';

/**
 * 상세 보기 컴포넌트
 */
const DetailView = ({ 
  item, 
  onApprove, 
  onFeedback,
  onBack,
  className = ''
}) => {
  if (!item) {
    return (
      <div className={`detail-placeholder flex items-center justify-center min-h-96 ${className}`}>
        <div className="text-center">
          <span className="text-6xl mb-4 block">📄</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">항목을 선택해주세요</h3>
          <p className="text-gray-500">
            왼쪽에서 시리즈, 캐릭터, 또는 에피소드를 선택하면<br />
            상세 정보가 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'series': return '📚';
      case 'character': return '👤';
      case 'episode': return '📝';
      case 'video': return '🎬';
      default: return '📄';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'series': return '시리즈';
      case 'character': return '캐릭터';
      case 'episode': return '에피소드';
      case 'video': return '영상';
      default: return '항목';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">승인 대기</Badge>;
      case 'approved': return <Badge variant="success">승인 완료</Badge>;
      case 'generating': return <Badge variant="info">생성 중</Badge>;
      case 'review': return <Badge variant="info">검토 중</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className={`detail-view ${className}`}>
      <Card className="h-full">
        {/* 헤더 */}
        <div className="detail-header p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTypeIcon(item.type)}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
                <p className="text-sm text-gray-500 mt-1">{getTypeName(item.type)}</p>
              </div>
            </div>
            {onBack && (
              <Button variant="ghost" size="small" onClick={onBack}>
                ← 뒤로
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {getStatusBadge(item.status)}
            <span>생성일: {formatDate(item.createdAt)}</span>
            {item.feedbackCount > 0 && (
              <span className="flex items-center">
                💬 피드백 {item.feedbackCount}개
              </span>
            )}
            {item.aiGenerated && (
              <Badge variant="info" size="small">AI 생성</Badge>
            )}
          </div>
        </div>

        {/* 설명 */}
        {item.description && (
          <div className="detail-description p-6 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">설명</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
        )}

        {/* 콘텐츠 */}
        {item.content && (
          <div className="detail-content p-6 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">내용</h3>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {item.content}
              </pre>
            </div>
          </div>
        )}

        {/* 추가 정보 */}
        <div className="detail-meta p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">추가 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-gray-900">{item.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">타입:</span>
              <span className="ml-2 text-gray-900">{getTypeName(item.type)}</span>
            </div>
            {item.seriesId && (
              <div>
                <span className="font-medium text-gray-600">시리즈 ID:</span>
                <span className="ml-2 text-gray-900">{item.seriesId}</span>
              </div>
            )}
            {item.episodeId && (
              <div>
                <span className="font-medium text-gray-600">에피소드 ID:</span>
                <span className="ml-2 text-gray-900">{item.episodeId}</span>
              </div>
            )}
            {item.duration && (
              <div>
                <span className="font-medium text-gray-600">재생시간:</span>
                <span className="ml-2 text-gray-900">{item.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        {(onApprove || onFeedback) && item.status === 'pending' && (
          <div className="detail-actions p-6">
            <div className="flex space-x-3">
              {onApprove && (
                <Button 
                  variant="success" 
                  onClick={() => onApprove(item)}
                >
                  ✅ 승인
                </Button>
              )}
              {onFeedback && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const feedback = prompt('피드백을 입력해주세요:');
                    if (feedback) {
                      onFeedback(item, feedback);
                    }
                  }}
                >
                  💬 피드백
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetailView;