import React, { useState } from 'react';
import './Browse.css';

// 아이콘 imports
import iconCharacter from '../assets/icons/icon_character.svg';
import iconScenario from '../assets/icons/icon_scenario.svg';
import iconEpisode from '../assets/icons/icon_episode.svg';

// 상세 컴포넌트 imports
import CharacterDetail from './CharacterDetail';
import SeriesDetail from './SeriesDetail';
import EpisodeDetail from './EpisodeDetail';

const Browse = ({ itemsData, onItemClick, onApprove, onFeedback }) => {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  
  const approvedItems = itemsData?.approved || {};
  
  // 현재 경로 표시를 위한 breadcrumb
  const getBreadcrumb = () => {
    const breadcrumb = ['시리즈'];
    if (selectedSeries) {
      breadcrumb.push(selectedSeries.title);
    }
    if (selectedEpisode) {
      breadcrumb.push(selectedEpisode.title);
    }
    return breadcrumb;
  };
  
  // 시리즈 선택
  const handleSeriesSelect = (series) => {
    setSelectedSeries(series);
    setSelectedEpisode(null);
    setSelectedItem(series);
    setSelectedItemType('series');
  };
  
  // 에피소드 선택
  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
    setSelectedItem(episode);
    setSelectedItemType('episode');
  };

  // 캐릭터 선택
  const handleCharacterSelect = (character) => {
    setSelectedItem(character);
    setSelectedItemType('character');
    // 기존 onItemClick도 호출 (다른 탭에서 사용하는 경우)
    if (onItemClick) {
      onItemClick(character);
    }
  };
  
  // 해당 시리즈의 에피소드들 가져오기
  const getSeriesEpisodes = (seriesId) => {
    return approvedItems.episode?.filter(episode => 
      episode.seriesId === seriesId
    ) || [];
  };
  
  // 해당 시리즈의 캐릭터들 가져오기
  const getSeriesCharacters = (seriesId) => {
    return approvedItems.character?.filter(character => 
      character.seriesId === seriesId
    ) || [];
  };

  // 파일 아이콘 결정
  const getFileIcon = (type) => {
    switch(type) {
      case 'series': return iconScenario;
      case 'episode': return iconEpisode;
      case 'character': return iconCharacter;
      default: return iconCharacter;
    }
  };

  // 폴더 아이콘 결정
  const getFolderIcon = (type) => {
    switch(type) {
      case 'series': return iconScenario;
      case 'episode': return iconEpisode;
      default: return iconScenario;
    }
  };

  // 상세 페이지 렌더링
  const renderDetailView = () => {
    if (!selectedItem) {
      return (
        <div className="detail-placeholder">
          <div className="placeholder-content">
            <img src={iconScenario} alt="선택" className="placeholder-icon" />
            <h3>항목을 선택해주세요</h3>
            <p>왼쪽에서 시리즈, 캐릭터, 또는 에피소드를 선택하면<br />상세 정보가 여기에 표시됩니다.</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      item: selectedItem,
      onBack: () => {
        setSelectedItem(null);
        setSelectedItemType(null);
      },
      onApprove: onApprove,
      onFeedback: onFeedback
    };

    switch (selectedItemType) {
      case 'series':
        return <SeriesDetail {...commonProps} />;
      case 'episode':
        return <EpisodeDetail {...commonProps} />;
      case 'character':
        return <CharacterDetail {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="browse-container">
      <div className="browse-layout">
        {/* 왼쪽 탐색기 영역 */}
        <div className="explorer-section">
          <div className="explorer-header">
            <div className="breadcrumb">
              {getBreadcrumb().map((item, index) => (
                <span key={index} className="breadcrumb-item">
                  {index > 0 && ' > '}
                  {item}
                </span>
              ))}
            </div>
          </div>
      
      <div className="explorer-panels">
        {/* 시리즈 패널 */}
        <div className="explorer-panel">
          <div className="panel-header">
            <h3>시리즈</h3>
          </div>
          <div className="panel-content">
            {approvedItems.series?.map(series => (
              <div
                key={series.id}
                className={`explorer-item folder ${selectedSeries?.id === series.id ? 'selected' : ''}`}
                onClick={() => handleSeriesSelect(series)}
              >
                <img src={getFolderIcon('series')} alt="시리즈" className="item-icon" />
                <span className="item-name">{series.title}</span>
                <span className="item-arrow">▶</span>
              </div>
            ))}
            {(!approvedItems.series || approvedItems.series.length === 0) && (
              <div className="empty-state">
                <img src={iconScenario} alt="시리즈" className="empty-icon" />
                <div className="empty-text">등록된 시리즈가 없습니다</div>
              </div>
            )}
          </div>
        </div>
        
        {/* 캐릭터 패널 */}
        <div className="explorer-panel">
          <div className="panel-header">
            <h3>캐릭터</h3>
          </div>
          <div className="panel-content">
            {selectedSeries ? (
              <>
                {getSeriesCharacters(selectedSeries.id).map(character => (
                  <div
                    key={character.id}
                    className="explorer-item file"
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <img src={getFileIcon('character')} alt="캐릭터" className="item-icon" />
                    <span className="item-name">{character.title}</span>
                  </div>
                ))}
                {getSeriesCharacters(selectedSeries.id).length === 0 && (
                  <div className="empty-state">
                    <img src={iconCharacter} alt="캐릭터" className="empty-icon" />
                    <div className="empty-text">등록된 캐릭터가 없습니다</div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <img src={iconCharacter} alt="캐릭터" className="empty-icon" />
                <div className="empty-text">시리즈를 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
        
        {/* 에피소드 패널 */}
        <div className="explorer-panel">
          <div className="panel-header">
            <h3>에피소드</h3>
          </div>
          <div className="panel-content">
            {selectedSeries ? (
              <>
                {getSeriesEpisodes(selectedSeries.id).map(episode => (
                  <div
                    key={episode.id}
                    className={`explorer-item folder ${selectedEpisode?.id === episode.id ? 'selected' : ''}`}
                    onClick={() => handleEpisodeSelect(episode)}
                  >
                    <img src={getFolderIcon('episode')} alt="에피소드" className="item-icon" />
                    <span className="item-name">{episode.title}</span>
                    <span className="item-arrow">▶</span>
                  </div>
                ))}
                {getSeriesEpisodes(selectedSeries.id).length === 0 && (
                  <div className="empty-state">
                    <img src={iconEpisode} alt="에피소드" className="empty-icon" />
                    <div className="empty-text">등록된 에피소드가 없습니다</div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <img src={iconEpisode} alt="에피소드" className="empty-icon" />
                <div className="empty-text">시리즈를 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>

        {/* 오른쪽 상세 페이지 영역 */}
        <div className="detail-section">
          {renderDetailView()}
        </div>
      </div>
    </div>
  );
};

export default Browse;