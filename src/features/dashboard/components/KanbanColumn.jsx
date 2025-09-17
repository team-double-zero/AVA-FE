import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, getStatusText, getWorkStatusColor, getWorkStatusText } from '../../../shared/lib/utils';

const ItemCard = ({ item, type, onClick }) => {
  const cardClass = type === 'working' ? 'working-card' : 'kanban-card';

  return (
    <div key={item.id} className={cardClass} onClick={() => onClick(item)}>
      <div className="card-header">
        <h4 className="card-title">{item.title}</h4>
        <div className="card-badges">
          {item.feedbackCount > 0 && (
            <span className="feedback-badge">💬 {item.feedbackCount}</span>
          )}
        </div>
      </div>
      <p className="card-description">{item.description}</p>
      <div className="card-footer">
        {type === 'working' ? (
          <span
            className="work-status-badge"
            style={{ backgroundColor: getWorkStatusColor(item.workStatus) }}
          >
            {getWorkStatusText(item.workStatus)}
          </span>
        ) : (
          <>
            <div className="card-footer-spacer"></div>
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(item.status) }}
            >
              {getStatusText(item.status)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, items, itemType, columnType, icon, onItemClick }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (itemType === 'series') {
      navigate(`/dashboard/series/${item.id}`);
    } else {
      onItemClick && onItemClick(item);
    }
  };

  const columnClass = columnType === 'working' ? 'working-column' : 'kanban-column';

  return (
    <div className={columnClass}>
      <div className="column-header">
        <img src={icon} alt={title} className="column-icon" />
        <h3 className="column-title">{title}</h3>
        <span className="item-count">{items?.length || 0}</span>
      </div>
      <div className="column-content">
        {(items || []).map((item) => (
          <ItemCard key={item.id} item={item} type={columnType} onClick={handleItemClick} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
