import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ItemDetail.css';

const ItemDetail = ({ item, onBack, onApprove, onFeedback }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  if (!item) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'worldview': return '🌍';
      case 'character': return '👤';
      case 'scenario': return '📝';
      case 'video': return '🎬';
      default: return '📄';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'worldview': return '세계관';
      case 'character': return '캐릭터';
      case 'scenario': return '시나리오';
      case 'video': return '영상';
      default: return '아이템';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '승인 대기';
      case 'review': return '검토 중';
      case 'generating': return 'AI 생성 중';
      default: return '대기';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff6b6b';
      case 'review': return '#ffa726';
      case 'generating': return '#17a2b8';
      default: return '#8370FE';
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(item);
    }
  };

  const handleFeedbackSubmit = () => {
    if (onFeedback && feedbackText.trim()) {
      onFeedback(item, feedbackText);
      setFeedbackText('');
      setShowFeedbackForm(false);
    }
  };

  // 타입별 컨텐츠 렌더링
  const renderContent = () => {
    if (!item.content) return <div>컨텐츠를 불러오는 중...</div>;

    switch (item.type) {
      case 'worldview':
      case 'scenario':
        return (
          <div className="content-section">
            <h3>AI 생성 내용</h3>
            <div className="content-markdown">
              <ReactMarkdown>{item.content.text}</ReactMarkdown>
            </div>
          </div>
        );

      case 'character':
        return (
          <div className="content-section">
            <h3>AI 생성 내용</h3>
            {item.content.image && (
              <div className="character-image">
                <img 
                  src={item.content.image} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x500/333/fff?text=Character+Image';
                  }}
                />
              </div>
            )}
            <div className="content-markdown">
              <ReactMarkdown>{item.content.text}</ReactMarkdown>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="content-section">
            <h3>AI 생성 내용</h3>
            {item.content.videoUrl && (
              <div className="video-player">
                <video 
                  controls 
                  width="100%" 
                  style={{ maxHeight: '400px' }}
                  poster="https://via.placeholder.com/800x450/333/fff?text=Video+Thumbnail"
                >
                  <source src={item.content.videoUrl} type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
            )}
            <div className="content-markdown">
              <ReactMarkdown>{item.content.text}</ReactMarkdown>
            </div>
          </div>
        );

      default:
        return <div>알 수 없는 컨텐츠 타입입니다.</div>;
    }
  };

  // 피드백 리스트 렌더링 (최신순)
  const renderFeedbacks = () => {
    const feedbacks = item.feedbacks || [];
    if (feedbacks.length === 0) return null;

    const sortedFeedbacks = [...feedbacks].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
      <div className="feedbacks-section">
        <h3>피드백 히스토리 ({feedbacks.length})</h3>
        <div className="feedbacks-list">
          {sortedFeedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <span className="feedback-user">{feedback.user}</span>
                <span className="feedback-date">{feedback.createdAt}</span>
              </div>
              <div className="feedback-content">
                <ReactMarkdown>{feedback.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="item-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← 돌아가기
        </button>
        <div className="detail-title-section">
          <div className="detail-type">
            <span className="type-icon">{getTypeIcon(item.type)}</span>
            <span className="type-name">{getTypeName(item.type)}</span>
          </div>
          <h1 className="detail-title">{item.title}</h1>
          <div className="detail-meta">
            <span 
              className="detail-status"
              style={{ backgroundColor: getStatusColor(item.status) }}
            >
              {getStatusText(item.status)}
            </span>
            {item.feedbackCount > 0 && (
              <span className="detail-feedback-count">
                💬 피드백 {item.feedbackCount}회
              </span>
            )}
            <span className="detail-date">생성일: {item.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {renderContent()}

        {renderFeedbacks()}

        <div className="detail-actions">
          {!showFeedbackForm ? (
            <>
              <button 
                className="action-button approve"
                onClick={handleApprove}
              >
                ✅ 승인
              </button>
              <button 
                className="action-button feedback"
                onClick={() => setShowFeedbackForm(true)}
              >
                💬 피드백 주기
              </button>
            </>
          ) : (
            <div className="feedback-form">
              <h4>피드백 작성</h4>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="수정이 필요한 부분이나 개선사항을 마크다운으로 작성해주세요..."
                rows={6}
              />
              <div className="feedback-actions">
                <button 
                  className="action-button submit"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
                >
                  피드백 제출
                </button>
                <button 
                  className="action-button cancel"
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setFeedbackText('');
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;