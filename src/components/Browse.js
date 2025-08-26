import React, { useState } from 'react';
import './Browse.css';

// 아이콘 imports
import iconWorldview from '../assets/icons/icon_worldview.svg';
import iconCharacter from '../assets/icons/icon_character.svg';
import iconEpisode from '../assets/icons/icon_episode.svg';
import iconScenario from '../assets/icons/icon_scenario.svg';
import iconVideo from '../assets/icons/icon_video.svg';

const Browse = ({ itemsData, onItemClick }) => {
  const [selectedWorldview, setSelectedWorldview] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  
  const approvedItems = itemsData?.approved || {};
  
  // 현재 경로 표시를 위한 breadcrumb
  const getBreadcrumb = () => {
    const breadcrumb = ['세계관'];
    if (selectedWorldview) {
      breadcrumb.push(selectedWorldview.title);
    }
    if (selectedEpisode) {
      breadcrumb.push(selectedEpisode.title);
    }
    return breadcrumb;
  };
  
  // 세계관 선택
  const handleWorldviewSelect = (worldview) => {
    setSelectedWorldview(worldview);
    setSelectedEpisode(null);
  };
  
  // 에피소드 선택
  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
  };
  
  // 해당 세계관의 에피소드들 가져오기
  const getWorldviewEpisodes = (worldviewId) => {
    return approvedItems.episode?.filter(episode => 
      episode.worldviewId === worldviewId
    ) || [];
  };
  
  // 해당 에피소드의 시나리오들 가져오기
  const getEpisodeScenarios = (episodeId) => {
    return approvedItems.scenario?.filter(scenario => 
      scenario.episodeId === episodeId || 
      (scenario.worldviewId === selectedWorldview?.id && !scenario.episodeId)
    ) || [];
  };
  
  // 파일 아이콘 결정
  const getFileIcon = (type) => {
    switch(type) {
      case 'worldview': return iconWorldview;
      case 'episode': return iconEpisode;
      case 'scenario': return iconScenario;
      case 'character': return iconCharacter;
      case 'video': return iconVideo;
      default: return iconScenario;
    }
  };

  // 폴더 아이콘 결정
  const getFolderIcon = (type) => {
    switch(type) {
      case 'worldview': return iconWorldview;
      case 'episode': return iconEpisode;
      default: return iconWorldview;
    }
  };

  return (
    <div className="browse-container">
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
        {/* 세계관 패널 */}
        <div className="explorer-panel">
          <div className="panel-header">
            <h3>세계관</h3>
          </div>
          <div className="panel-content">
            {approvedItems.worldview?.map(worldview => (
              <div
                key={worldview.id}
                className={`explorer-item folder ${selectedWorldview?.id === worldview.id ? 'selected' : ''}`}
                onClick={() => handleWorldviewSelect(worldview)}
              >
                <img src={getFolderIcon('worldview')} alt="세계관" className="item-icon" />
                <span className="item-name">{worldview.title}</span>
                <span className="item-arrow">▶</span>
              </div>
            ))}
            {(!approvedItems.worldview || approvedItems.worldview.length === 0) && (
              <div className="empty-state">
                <img src={iconWorldview} alt="세계관" className="empty-icon" />
                <div className="empty-text">등록된 세계관이 없습니다</div>
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
            {selectedWorldview ? (
              <>
                {getWorldviewEpisodes(selectedWorldview.id).map(episode => (
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
                {getWorldviewEpisodes(selectedWorldview.id).length === 0 && (
                  <div className="empty-state">
                    <img src={iconEpisode} alt="에피소드" className="empty-icon" />
                    <div className="empty-text">등록된 에피소드가 없습니다</div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <img src={iconEpisode} alt="에피소드" className="empty-icon" />
                <div className="empty-text">세계관을 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
        
        {/* 시나리오 패널 */}
        <div className="explorer-panel">
          <div className="panel-header">
            <h3>시나리오</h3>
          </div>
          <div className="panel-content">
            {selectedWorldview && selectedEpisode ? (
              <>
                {getEpisodeScenarios(selectedEpisode.id).map(scenario => (
                  <div
                    key={scenario.id}
                    className="explorer-item file"
                    onClick={() => onItemClick(scenario)}
                  >
                    <img src={getFileIcon('scenario')} alt="시나리오" className="item-icon" />
                    <span className="item-name">{scenario.title}</span>
                  </div>
                ))}
                {getEpisodeScenarios(selectedEpisode.id).length === 0 && (
                  <div className="empty-state">
                    <img src={iconScenario} alt="시나리오" className="empty-icon" />
                    <div className="empty-text">등록된 시나리오가 없습니다</div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <img src={iconScenario} alt="시나리오" className="empty-icon" />
                <div className="empty-text">에피소드를 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;