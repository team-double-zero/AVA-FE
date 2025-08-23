import React, { useState } from 'react';
import './ItemDetail.css';

const VideoDetail = ({ item, onBack, onApprove, onFeedback }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      onFeedback(item, feedbackText);
      setFeedbackText('');
      setShowFeedback(false);
    }
  };

  const toggleFeedbackExpansion = (index) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="detail-container">
      <div className="detail-wrapper">
        <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← 뒤로 가기
        </button>
        <div className="detail-title-section">
          <h1 className="detail-title">{item.title}</h1>
          <p className="detail-description">{item.description}</p>
          <div className="detail-meta">
            <span className="detail-type">🎬 영상</span>
            <span className="detail-date">생성일: {item.createdAt}</span>
            {item.duration && (
              <span className="detail-duration">⏱️ {item.duration}</span>
            )}
            {item.feedbackCount > 0 && (
              <span className="detail-feedback">💬 피드백 {item.feedbackCount}개</span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-content">
        {/* 비디오 플레이어 */}
        <div className="video-section">
          <h2>영상</h2>
          <div className="video-container">
            {item.videoUrl ? (
              <video 
                controls 
                className="video-player"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              >
                <source src={item.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
            <div className="video-placeholder" style={{ display: item.videoUrl ? 'none' : 'flex' }}>
              <span>🎬</span>
              <p>영상이 생성 중입니다</p>
              {item.duration && <small>예상 길이: {item.duration}</small>}
            </div>
          </div>
        </div>

        {/* 영상 정보 */}
        <div className="video-info-section">
          <h2>영상 정보</h2>
          <div className="video-info">
            <div className="info-item">
              <strong>제목:</strong> {item.title}
            </div>
            <div className="info-item">
              <strong>설명:</strong> {item.description}
            </div>
            {item.duration && (
              <div className="info-item">
                <strong>재생 시간:</strong> {item.duration}
              </div>
            )}
            <div className="info-item">
              <strong>생성일:</strong> {item.createdAt}
            </div>
            <div className="info-item">
              <strong>AI 생성:</strong> {item.aiGenerated ? '예' : '아니오'}
            </div>
          </div>
        </div>

        {/* 피드백 히스토리 */}
        {item.feedbackHistory && item.feedbackHistory.length > 0 && (
          <div className="feedback-history-section">
            <h2>이전 피드백 내역</h2>
            {item.feedbackHistory.map((feedback, index) => (
              <div key={index} className="feedback-item">
                <div 
                  className="feedback-header"
                  onClick={() => toggleFeedbackExpansion(index)}
                >
                  <span className="feedback-date">{feedback.date}</span>
                  <span className="feedback-toggle">
                    {expandedFeedback[index] ? '▼' : '▶'}
                  </span>
                </div>
                {expandedFeedback[index] && (
                  <div className="feedback-content">
                    <div className="feedback-question">
                      <strong>피드백:</strong> {feedback.question}
                    </div>
                    <div className="feedback-answer">
                      <strong>답변:</strong> {feedback.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="detail-actions">
        <button 
          className="action-button approve-button"
          onClick={() => onApprove(item)}
        >
          ✓ 승인
        </button>
        <button 
          className="action-button feedback-button"
          onClick={() => setShowFeedback(!showFeedback)}
        >
          💬 피드백
        </button>
      </div>

      {showFeedback && (
        <div className="feedback-modal">
          <div className="feedback-form">
            <h3>피드백 작성</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="영상 개선사항이나 수정 요청을 입력해주세요..."
              rows={4}
            />
            <div className="feedback-actions">
              <button onClick={() => setShowFeedback(false)}>취소</button>
              <button onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>
                피드백 전송
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default VideoDetail;
