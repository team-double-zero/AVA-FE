import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../../shared/ui';
import './SeriesDetailPage.css';

/**
 * 시리즈 상세 페이지 컴포넌트
 */
const SeriesDetailPage = ({ itemsData }) => {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  // 모든 카테고리에서 시리즈 찾기
  const findSeries = () => {
    if (!itemsData) return null;
    
    const categories = ['pending', 'working', 'approved'];
    const types = ['series', 'character']; // 시리즈와 캐릭터 모두 시리즈로 통합
    
    for (const category of categories) {
      for (const type of types) {
        const items = itemsData[category]?.[type] || [];
        const found = items.find(item => item.id === parseInt(seriesId));
        if (found) return found;
      }
    }
    return null;
  };

  const series = findSeries();

  // 해당 시리즈의 캐릭터들 찾기 (기존 character 타입 아이템들)
  const getSeriesCharacters = () => {
    if (!itemsData || !series) return [];
    
    const categories = ['pending', 'working', 'approved'];
    let characters = [];
    
    categories.forEach(category => {
      const characterItems = itemsData[category]?.character || [];
      // 시리즈와 연관된 캐릭터들 필터링 (seriesId로 연결되어 있다고 가정)
      const relatedCharacters = characterItems.filter(char => 
        char.seriesId === series.id || char.series_id === series.id
      );
      characters = [...characters, ...relatedCharacters];
    });
    
    return characters;
  };

  const characters = getSeriesCharacters();

  if (!series) {
    return (
      <div className="series-detail-container">
        <div className="series-detail-wrapper">
          <div className="series-detail-header">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              ← 대시보드로 돌아가기
            </button>
            <div className="error-state">
              <h2>시리즈를 찾을 수 없습니다</h2>
              <p>요청하신 시리즈가 존재하지 않거나 삭제되었습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="series-detail-container">
      <div className="series-detail-wrapper">
        <div className="series-detail-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← 대시보드로 돌아가기
          </button>
          <div className="series-title-section">
            <div className="series-type">
              <span className="type-icon">📺</span>
              <span className="type-name">시리즈</span>
            </div>
            <h1 className="series-title">{series.title}</h1>
            <p className="series-description">{series.description || '시리즈 설명이 없습니다.'}</p>
            <div className="series-meta">
              <div className="meta-item">
                <span className="meta-label">상태</span>
                <span className={`meta-value status-badge ${
                  series.status === 'pending' ? 'status-pending' :
                  series.status === 'approved' ? 'status-approved' : 'status-working'
                }`}>
                  {series.status === 'pending' ? '승인 대기' :
                   series.status === 'approved' ? '승인 완료' : '작업 중'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">생성일</span>
                <span className="meta-value">
                  {series.createdAt ? new Date(series.createdAt).toLocaleDateString('ko-KR') : '정보 없음'}
                </span>
              </div>
              {series.feedbackCount > 0 && (
                <div className="meta-item">
                  <span className="meta-label">피드백</span>
                  <span className="meta-value">💬 {series.feedbackCount}개</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="series-detail-content">
          {/* 왼쪽: 시리즈 정보 */}
          <div className="content-section series-info-section">
            <h2>📝 시리즈 상세 정보</h2>
            <div className="series-info-grid">
              {series.genre && (
                <div className="info-item">
                  <h3>장르</h3>
                  <div className="genre-tags">
                    {series.genre.split(',').map((genre, index) => (
                      <span key={index} className="genre-tag">{genre.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {series.targetAudience && (
                <div className="info-item">
                  <h3>타겟 관객</h3>
                  <p>{series.targetAudience}</p>
                </div>
              )}

              {series.setting && (
                <div className="info-item">
                  <h3>배경 설정</h3>
                  <p>{series.setting}</p>
                </div>
              )}

              {series.theme && (
                <div className="info-item">
                  <h3>주제</h3>
                  <p>{series.theme}</p>
                </div>
              )}

              {series.content && (
                <div className="info-item full-width">
                  <h3>시리즈 개요</h3>
                  <div className="markdown-content">
                    <p>{series.content}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 가운데 구분선 */}
          <div className="content-divider">
            <div className="divider-line"></div>
          </div>

          {/* 오른쪽: 캐릭터 정보 */}
          <div className="content-section characters-section">
            <h2>👥 시리즈 캐릭터들 ({characters.length})</h2>
            
            {characters.length > 0 ? (
              <div className="character-list">
                {characters.map((character) => (
                  <div key={character.id} className="character-item">
                    <div className="character-content">
                      <div className="character-avatar">
                        {character.title ? character.title.charAt(0) : '?'}
                      </div>
                      <div className="character-details">
                        <div className="character-header">
                          <h4>{character.title}</h4>
                          <span className={`status-badge ${
                            character.status === 'pending' ? 'status-pending' :
                            character.status === 'approved' ? 'status-approved' : 'status-working'
                          }`}>
                            {character.status === 'pending' ? '대기' :
                             character.status === 'approved' ? '완료' : '작업중'}
                          </span>
                        </div>
                        
                        <p>{character.description || '캐릭터 설명이 없습니다.'}</p>
                        
                        {character.role && (
                          <div className="character-traits">
                            <span className="trait-tag">역할: {character.role}</span>
                          </div>
                        )}
                        
                        {character.age && (
                          <div className="character-traits">
                            <span className="trait-tag">나이: {character.age}</span>
                          </div>
                        )}
                        
                        {character.personality && (
                          <div className="character-traits">
                            <span className="trait-tag">성격: {character.personality}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="icon">👥</div>
                <p>아직 등록된 캐릭터가 없습니다.</p>
                <p className="sub-text">시리즈에 캐릭터를 추가해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailPage;
