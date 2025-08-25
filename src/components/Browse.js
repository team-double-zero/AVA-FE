import React, { useState } from 'react';
import './Browse.css';

const Browse = ({ itemsData, onItemClick }) => {
  const [selectedWorldview, setSelectedWorldview] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  
  const approvedItems = itemsData?.approved || {};
  
  // 월드뷰 선택 핸들러
  const handleWorldviewSelect = (worldview) => {
    setSelectedWorldview(worldview);
    setSelectedEpisode(null);
  };
  
  // 에피소드 선택 핸들러
  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
  };

  // 에피소드에 연결된 캐릭터 찾기
  const getEpisodeCharacters = (episodeId) => {
    return approvedItems.character.filter(character => 
      character.worldviewId === selectedWorldview.id
    );
  };

  // 에피소드에 연결된 시나리오 찾기
  const getEpisodeScenarios = (episodeId) => {
    return approvedItems.scenario.filter(scenario => 
      scenario.worldviewId === selectedWorldview.id
    );
  };

  // 에피소드에 연결된 영상 찾기
  const getEpisodeVideos = (episodeId) => {
    return approvedItems.video.filter(video => 
      video.worldviewId === selectedWorldview?.id
    );
  };

  // 승인된 세계관 목록 렌더링
  const renderWorldviewList = () => (
    <div className="browse-worldview-list">
      <h3 className="browse-section-title">세계관</h3>
      <div className="browse-grid">
        {approvedItems.worldview?.map(worldview => (
          <div
            key={worldview.id}
            className={`browse-card ${selectedWorldview?.id === worldview.id ? 'selected' : ''}`}
            onClick={() => handleWorldviewSelect(worldview)}
          >
            <h4 className="browse-card-title">{worldview.title}</h4>
            <p className="browse-card-description">{worldview.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // 선택된 세계관의 에피소드 목록 렌더링
  const renderEpisodeList = () => {
    if (!selectedWorldview) return null;
    
    const worldviewEpisodes = approvedItems.episode.filter(
      episode => episode.worldviewId === selectedWorldview.id
    );
    
    if (worldviewEpisodes.length === 0) {
      return (
        <div className="browse-empty-state">
          <p>이 세계관에 연결된 에피소드가 없습니다.</p>
        </div>
      );
    }
    
    return (
      <div className="browse-episode-list">
        <h3 className="browse-section-title">
          <span className="browse-section-back" onClick={() => setSelectedWorldview(null)}>
            ← 
          </span>
          {selectedWorldview.title} - 에피소드
        </h3>
        <div className="browse-grid">
          {worldviewEpisodes.map(episode => (
            <div
              key={episode.id}
              className={`browse-card ${selectedEpisode?.id === episode.id ? 'selected' : ''}`}
              onClick={() => handleEpisodeSelect(episode)}
            >
              <h4 className="browse-card-title">{episode.title}</h4>
              <p className="browse-card-description">{episode.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 선택된 에피소드의 상세 정보 렌더링
  const renderEpisodeDetail = () => {
    if (!selectedEpisode) return null;
    
    const characters = getEpisodeCharacters(selectedEpisode.id);
    const scenarios = getEpisodeScenarios(selectedEpisode.id);
    const videos = getEpisodeVideos(selectedEpisode.id);
    
    return (
      <div className="browse-episode-detail">
        <div className="browse-detail-header">
          <span className="browse-section-back" onClick={() => setSelectedEpisode(null)}>
            ←
          </span>
          <h3 className="browse-detail-title">{selectedEpisode.title}</h3>
        </div>
        
        <div className="browse-detail-content">
          <div className="browse-detail-description">
            <h4>에피소드 설명</h4>
            <p>{selectedEpisode.description}</p>
          </div>
          
          {characters.length > 0 && (
            <div className="browse-detail-section">
              <h4>관련 캐릭터</h4>
              <div className="browse-mini-grid">
                {characters.map(character => (
                  <div 
                    key={character.id} 
                    className="browse-mini-card"
                    onClick={() => onItemClick && onItemClick(character)}
                  >
                    <h5>{character.title}</h5>
                    <p>{character.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {scenarios.length > 0 && (
            <div className="browse-detail-section">
              <h4>관련 시나리오</h4>
              <div className="browse-mini-grid">
                {scenarios.map(scenario => (
                  <div 
                    key={scenario.id} 
                    className="browse-mini-card"
                    onClick={() => onItemClick && onItemClick(scenario)}
                  >
                    <h5>{scenario.title}</h5>
                    <p>{scenario.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {videos.length > 0 && (
            <div className="browse-detail-section">
              <h4>관련 영상</h4>
              <div className="browse-mini-grid">
                {videos.map(video => (
                  <div 
                    key={video.id} 
                    className="browse-mini-card"
                    onClick={() => onItemClick && onItemClick(video)}
                  >
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h2 className="browse-title">콘텐츠 브라우저</h2>
        <p className="browse-subtitle">승인된 콘텐츠를 탐색하고 조회할 수 있습니다</p>
      </div>
      
      <div className="browse-content">
        {selectedEpisode 
          ? renderEpisodeDetail()
          : selectedWorldview 
            ? renderEpisodeList() 
            : renderWorldviewList()
        }
      </div>
    </div>
  );
};

export default Browse;
