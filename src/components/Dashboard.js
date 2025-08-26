import React, { useEffect } from 'react';
import './Dashboard.css';
import { apiRequest } from '../utils/tokenUtils';

// 아이콘 imports
import iconWorldview from '../assets/icons/icon_worldview.svg';
import iconCharacter from '../assets/icons/icon_character.svg';
import iconEpisode from '../assets/icons/icon_episode.svg';
import iconScenario from '../assets/icons/icon_scenario.svg';
import iconVideo from '../assets/icons/icon_video.svg';

const Dashboard = ({ itemsData, onItemClick }) => {
  // React Hooks는 항상 컴포넌트 최상단에서 호출되어야 함
  // API 요청 예시 (컴포넌트 마운트 시 실행)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 개발 모드에서는 API 요청을 스킵
        if (process.env.REACT_APP_DEV_MODE === 'true') {
          console.log('개발 모드: API 요청 스킵');
          return;
        }

        // apiRequest는 자동으로 Access Token을 헤더에 추가하고
        // 401 에러 시 토큰을 갱신한 후 재시도합니다
        const response = await apiRequest(`${process.env.REACT_APP_API_DOMAIN}/api/v1/user/profile`);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('User profile data:', userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // 인증 실패 시 로그인 페이지로 리디렉션 등의 처리를 여기서 할 수 있습니다
      }
    };

    fetchUserData();
  }, []);

  // 조건부 렌더링은 Hooks 다음에 위치
  if (!itemsData) return <div>로딩 중...</div>;

  const pendingItems = itemsData.pending;
  const workingItems = itemsData.working;
  const approvedItems = itemsData.approved;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff6b6b';
      case 'review': return '#ffa726';
      case 'revision': return '#ef5350';
      case 'draft': return '#42a5f5';
      default: return '#8370FE';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '승인 대기';
      case 'review': return '검토 중';
      case 'revision': return '수정 요청';
      case 'draft': return '초안';
      case 'generating': return 'AI 생성 중';
      default: return '대기';
    }
  };

  const getWorkStatusText = (workStatus) => {
    switch (workStatus) {
      case 'generating': return '🤖 생성 중';
      case 'revision_requested': return '✏️ 수정 중';
      default: return '🔄 작업 중';
    }
  };

  const getWorkStatusColor = (workStatus) => {
    switch (workStatus) {
      case 'generating': return '#17a2b8';
      case 'revision_requested': return '#fd7e14';
      default: return '#6c757d';
    }
  };



  const getItemIcon = (type) => {
    switch (type) {
      case 'worldview': return iconWorldview;
      case 'character': return iconCharacter;
      case 'episode': return iconEpisode;
      case 'scenario': return iconScenario;
      case 'video': return iconVideo;
      default: return iconWorldview;
    }
  };

  const renderWorkingColumn = (title, items, type) => (
    <div className="working-column">
      <div className="column-header">
        <img src={getItemIcon(type)} alt={title} className="column-icon" />
        <h3 className="column-title">{title}</h3>
        <span className="item-count">{items.length}</span>
      </div>
      <div className="column-content">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="working-card"
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="card-header">
              <h4 className="card-title">{item.title}</h4>
              <div className="card-badges">
                {item.feedbackCount > 0 && (
                  <span className="feedback-badge">
                    💬 {item.feedbackCount}
                  </span>
                )}
              </div>
            </div>
            <p className="card-description">{item.description}</p>
            <div className="card-footer">
              <span 
                className="work-status-badge"
                style={{ backgroundColor: getWorkStatusColor(item.workStatus) }}
              >
                {getWorkStatusText(item.workStatus)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKanbanColumn = (title, items, type) => (
    <div className="kanban-column">
      <div className="column-header">
        <img src={getItemIcon(type)} alt={title} className="column-icon" />
        <h3 className="column-title">{title}</h3>
        <span className="item-count">{items.length}</span>
      </div>
      <div className="column-content">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="kanban-card"
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="card-header">
              <h4 className="card-title">{item.title}</h4>
              <div className="card-badges">
                {item.feedbackCount > 0 && (
                  <span className="feedback-badge">
                    💬 {item.feedbackCount}
                  </span>
                )}
              </div>
            </div>
            <p className="card-description">{item.description}</p>
            <div className="card-footer">
              <div className="card-footer-spacer"></div>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {getStatusText(item.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">DASHBOARD</h2>
      </div>

      {/* Kanban Board - 승인 대기 중인 아이템들 */}
      <div className="kanban-board">
        <div className="board-header">
          <h3 className="board-title">승인 대기 중인 아이템들</h3>
        </div>
        <div className="kanban-columns">
          {renderKanbanColumn('세계관', pendingItems.worldview, 'worldview')}
          {renderKanbanColumn('캐릭터', pendingItems.character, 'character')}
          {renderKanbanColumn('에피소드', pendingItems.episode, 'episode')}
          {renderKanbanColumn('시나리오', pendingItems.scenario, 'scenario')}
          {renderKanbanColumn('영상', pendingItems.video, 'video')}
        </div>
      </div>

      {/* 작업 중인 아이템들 */}
      <div className="working-board">
        <div className="board-header">
          <h3 className="board-title">작업 중인 아이템들</h3>
          <p className="board-subtitle">AI가 수정 중이거나 새로 생성 중인 아이템들</p>
        </div>
        <div className="working-columns">
          {renderWorkingColumn('세계관', workingItems.worldview, 'worldview')}
          {renderWorkingColumn('캐릭터', workingItems.character, 'character')}
          {renderWorkingColumn('에피소드', workingItems.episode, 'episode')}
          {renderWorkingColumn('시나리오', workingItems.scenario, 'scenario')}
          {renderWorkingColumn('영상', workingItems.video, 'video')}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;