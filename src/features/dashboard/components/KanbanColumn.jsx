import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, getStatusText, getWorkStatusColor, getWorkStatusText } from '../../../shared/lib/utils';

const ItemCard = ({ item, type, onClick }) => {
  const baseCardStyles = 'relative isolate bg-white/40 backdrop-blur-sm border border-white/50 shadow-md transition-all duration-300 cursor-pointer min-h-[120px] rounded-lg p-3';
  const hoverStyles = 'hover:-translate-y-0.5 hover:shadow-xl';

  const typeStyles = {
    kanban: `hover:border-purple-300/70 hover:bg-white/50 ${hoverStyles}`,
    working: `border-amber-300/60 bg-amber-50/30 hover:border-amber-400/80 hover:bg-amber-50/40 ${hoverStyles}`,
  };

  return (
    <div 
      className={`${baseCardStyles} ${typeStyles[type]}`}
      onClick={() => onClick(item)}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <h4 className="text-base font-semibold text-gray-800 flex-1 line-clamp-1 z-10">{item.title}</h4>
        {item.feedbackCount > 0 && (
          <span className="bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md">💬 {item.feedbackCount}</span>
        )}
      </div>
      <p className="text-gray-600 text-sm line-clamp-1 mb-3 z-10 relative">{item.description}</p>
      <div className="flex justify-end items-center gap-3">
        {type === 'working' ? (
          <span
            className="text-white px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ backgroundColor: getWorkStatusColor(item.workStatus) }}
          >
            {getWorkStatusText(item.workStatus)}
          </span>
        ) : (
          <span
            className="text-white px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {getStatusText(item.status)}
          </span>
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

  const columnStyles = {
    kanban: 'bg-white/20 border-white/40 hover:border-purple-300/60 hover:bg-white/30',
    working: 'bg-amber-200/20 border-amber-300/60 hover:border-amber-400/80 hover:bg-amber-200/30'
  }

  return (
    <div className={`relative isolate backdrop-blur-xl rounded-xl p-4 border transition-all duration-300 shadow-lg hover:shadow-purple-200/50 ${columnStyles[columnType]}`}>
      <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b-2 border-gray-300/50 relative">
        <img src={icon} alt={title} className="w-5 h-5 object-contain" />
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <span className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">{items?.length || 0}</span>
      </div>
      <div className="flex flex-col gap-3">
        {(items || []).map((item) => (
          <ItemCard key={item.id} item={item} type={columnType} onClick={handleItemClick} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;