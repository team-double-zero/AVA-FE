import React from 'react';
import './Dashboard.css';

const Dashboard = ({ itemsData, onItemClick }) => {
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



  const renderWorkingColumn = (title, items, icon) => (
    <div className="working-column">
      <div className="column-header">
        <span className="column-icon">{icon}</span>
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

  const renderKanbanColumn = (title, items, icon) => (
    <div className="kanban-column">
      <div className="column-header">
        <span className="column-icon">{icon}</span>
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

  const renderApprovedSection = (title, items, icon) => (
    <div className="approved-section">
      <div className="section-header">
        <span className="section-icon">{icon}</span>
        <h3 className="section-title">{title}</h3>
        <span className="approved-count">{items.length}개 승인됨</span>
      </div>
      <div className="approved-grid">
        {items.map((item) => (
          <div key={item.id} className="approved-card">
            <h4 className="approved-title">{item.title}</h4>
            <p className="approved-description">{item.description}</p>
            <div className="approved-status">
              <span className="approved-badge">✓ 승인됨</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">승인 관리 대시보드</h2>
        <p className="dashboard-subtitle">AI 생성 워크플로우를 관리하고 진행 상황을 확인하세요</p>
      </div>

      {/* Kanban Board - 승인 대기 중인 아이템들 */}
      <div className="kanban-board">
        <div className="board-header">
          <h3 className="board-title">승인 대기 중인 아이템들</h3>
        </div>
        <div className="kanban-columns">
          {renderKanbanColumn('세계관', pendingItems.worldview, '🌍')}
          {renderKanbanColumn('캐릭터', pendingItems.character, '👤')}
          {renderKanbanColumn('시나리오', pendingItems.scenario, '📝')}
        </div>
      </div>

      {/* 작업 중인 아이템들 */}
      <div className="working-board">
        <div className="board-header">
          <h3 className="board-title">작업 중인 아이템들</h3>
          <p className="board-subtitle">AI가 수정 중이거나 새로 생성 중인 아이템들</p>
        </div>
        <div className="working-columns">
          {renderWorkingColumn('세계관', workingItems.worldview, '🔄 🌍')}
          {renderWorkingColumn('캐릭터', workingItems.character, '🔄 👤')}
          {renderWorkingColumn('시나리오', workingItems.scenario, '🔄 📝')}
        </div>
      </div>

      {/* 승인된 아이템들 */}
      <div className="approved-items">
        <div className="approved-header">
          <h3 className="approved-main-title">승인된 아이템들</h3>
        </div>
        <div className="approved-sections">
          {renderApprovedSection('승인된 세계관', approvedItems.worldview, '✅ 🌍')}
          {renderApprovedSection('승인된 캐릭터', approvedItems.character, '✅ 👤')}
          {renderApprovedSection('승인된 시나리오', approvedItems.scenario, '✅ 📝')}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;