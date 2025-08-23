import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ItemDetail.css';

const WorldviewDetail = ({ item, onBack, onApprove, onFeedback }) => {
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
            <span className="detail-type">🌍 세계관</span>
            <span className="detail-date">생성일: {item.createdAt}</span>
            {item.feedbackCount > 0 && (
              <span className="detail-feedback">💬 피드백 {item.feedbackCount}개</span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="content-section">
          <h2>세계관 설정</h2>
          <div className="markdown-content">
            <ReactMarkdown>{item.content || '# 세계관 내용\n\n세계관 설정이 여기에 표시됩니다.'}</ReactMarkdown>
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
              placeholder="개선사항이나 수정 요청을 입력해주세요..."
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

export default WorldviewDetail;
