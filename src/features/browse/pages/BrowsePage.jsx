import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { useApprovedData } from '../hooks';
import iconSeries from '../../../assets/icons/icon_scenario.svg';
import iconCharacter from '../../../assets/icons/icon_character.svg';
import './BrowsePage.css';

/**
 * Browse 페이지 컴포넌트
 */
const BrowsePage = () => {
  const {
    approvedSeries,
    isLoading,
    error,
    getSeriesCharacters
  } = useApprovedData();

  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // 시리즈 선택
  const handleSeriesSelect = (series) => {
    setSelectedSeries(series);
    setSelectedCharacter(null);
  };

  // 캐릭터 선택
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  // 뒤로 가기
  const handleBack = () => {
    if (selectedCharacter) {
      setSelectedCharacter(null);
    } else if (selectedSeries) {
      setSelectedSeries(null);
    }
  };

  // 현재 경로 표시를 위한 breadcrumb
  const getBreadcrumb = () => {
    const breadcrumb = ['시리즈'];
    if (selectedSeries) {
      breadcrumb.push(selectedSeries.name);
    }
    if (selectedCharacter) {
      breadcrumb.push(selectedCharacter.display_name);
    }
    return breadcrumb;
  };

  // 상세 페이지 렌더링
  const renderDetailView = () => {
    if (selectedCharacter) {
      const character = selectedCharacter;
      return (
        <div className="browse-detail-container">
          <div className="browse-detail-wrapper">
            <div className="browse-detail-header">
              <button className="back-button" onClick={handleBack}>
                ← 캐릭터 목록으로 돌아가기
              </button>
              <div className="detail-title-section">
                <h1 className="detail-title">{character.display_name || '이름 없음'}</h1>
                <p className="detail-subtitle">{character.role || '역할 없음'}</p>
                <div className="detail-meta">
                  <span className="meta-item">
                    나이: {character.age || '정보 없음'}
                  </span>
                  {character.birthday && (
                    <span className="meta-item">
                      생일: {new Date(character.birthday).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="browse-detail-content">
              <div className="detail-section">
                <h2>캐릭터 상세 정보</h2>
                <div className="json-view-container" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid rgba(233, 236, 239, 0.8)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.05)',
                  marginTop: '16px'
                }}>
                  <ReactJson
                    src={character}
                    theme="rjv-default"
                    collapsed={false}
                    collapseStringsAfterLength={100}
                    enableClipboard={true}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    quotesOnKeys={false}
                    style={{
                      fontSize: '14px',
                      backgroundColor: 'transparent',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedSeries) {
      const series = selectedSeries;
      return (
        <div className="browse-detail-container">
          <div className="browse-detail-wrapper">
            <div className="browse-detail-header">
              <button className="back-button" onClick={handleBack}>
                ← 시리즈 목록으로 돌아가기
              </button>
              <div className="detail-title-section">
                <h1 className="detail-title">{series.name || '제목 없음'}</h1>
                <p className="detail-subtitle">{series.one_liner || '요약 없음'}</p>
                <div className="detail-meta">
                  <span className="meta-item">
                    생성일: {series.created_at ? new Date(series.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
                  </span>
                </div>
              </div>
            </div>

            <div className="browse-detail-content">
              <div className="detail-section">
                <h2>시리즈 상세 정보</h2>
                <div className="json-view-container" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid rgba(233, 236, 239, 0.8)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.05)',
                  marginTop: '16px'
                }}>
                  <ReactJson
                    src={series}
                    theme="rjv-default"
                    collapsed={false}
                    collapseStringsAfterLength={100}
                    enableClipboard={true}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    quotesOnKeys={false}
                    style={{
                      fontSize: '14px',
                      backgroundColor: 'transparent',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="browse-placeholder">
        <div className="placeholder-content">
          <img src={iconSeries} alt="선택" className="placeholder-icon" />
          <h3>항목을 선택해주세요</h3>
          <p>왼쪽에서 시리즈 또는 캐릭터를 선택하면<br />상세 정보가 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="browse-container">
        <div className="error-state">
          <h2>데이터를 불러오는데 실패했습니다</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-container">
      <div className="browse-layout">
        {/* 왼쪽 탐색기 영역 */}
        <div className="browse-explorer-section">
          <div className="browse-explorer-header">
            <div className="breadcrumb">
              {getBreadcrumb().map((item, index) => (
                <span key={index} className="breadcrumb-item">
                  {index > 0 && ' > '}
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="browse-explorer-panels">
            {/* 시리즈 패널 */}
            <div className="browse-explorer-panel">
              <div className="panel-header">
                <h3>시리즈</h3>
              </div>
              <div className="panel-content">
                {isLoading ? (
                  <div className="loading-state">
                    <p>데이터를 불러오는 중...</p>
                  </div>
                ) : approvedSeries.length > 0 ? (
                  approvedSeries.map(series => (
                    <div
                      key={series.id}
                      className={`explorer-item folder ${selectedSeries?.id === series.id ? 'selected' : ''}`}
                      onClick={() => handleSeriesSelect(series)}
                    >
                      <img src={iconSeries} alt="시리즈" className="item-icon" />
                      <div className="item-info">
                        <span className="item-name">{series.name}</span>
                        <span className="item-description">{series.one_liner}</span>
                      </div>
                      <span className="item-arrow">▶</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <img src={iconSeries} alt="시리즈" className="empty-icon" />
                    <div className="empty-text">등록된 시리즈가 없습니다</div>
                  </div>
                )}
              </div>
            </div>

            {/* 캐릭터 패널 */}
            <div className="browse-explorer-panel">
              <div className="panel-header">
                <h3>캐릭터</h3>
              </div>
              <div className="panel-content">
                {selectedSeries ? (
                  <>
                    {(() => {
                      const seriesCharacters = getSeriesCharacters(selectedSeries.id);
                      return seriesCharacters.length > 0 ? (
                        seriesCharacters.map(character => (
                          <div
                            key={character.id}
                            className="explorer-item file"
                            onClick={() => handleCharacterSelect(character)}
                          >
                            <img src={iconCharacter} alt="캐릭터" className="item-icon" />
                            <div className="item-info">
                              <span className="item-name">{character.display_name}</span>
                              <span className="item-description">{character.role}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <img src={iconCharacter} alt="캐릭터" className="empty-icon" />
                          <div className="empty-text">등록된 캐릭터가 없습니다</div>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="empty-state">
                    <img src={iconCharacter} alt="캐릭터" className="empty-icon" />
                    <div className="empty-text">시리즈를 선택해주세요</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 상세 페이지 영역 */}
        <div className="browse-detail-section">
          {renderDetailView()}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;