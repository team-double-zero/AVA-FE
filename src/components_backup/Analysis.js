import React from 'react';
import './Analysis.css';

const Analysis = () => {
  return (
    <div className="analysis">
      <div className="analysis-header">
        <h2 className="analysis-title">분석 대시보드</h2>
        <p className="analysis-subtitle">승인 프로세스와 콘텐츠 현황을 분석합니다</p>
      </div>

      <div className="analysis-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">📈</div>
          <h3>분석 기능 준비 중</h3>
          <p>곧 다양한 분석 도구와 리포트를 제공할 예정입니다.</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>승인 속도 분석</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏰</span>
              <span>처리 시간 통계</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📋</span>
              <span>콘텐츠 품질 지표</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>워크플로우 최적화</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;