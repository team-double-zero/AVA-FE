import React from 'react';

/**
 * 브레드크럼 컴포넌트
 */
const Breadcrumb = ({ path = [], onNavigate }) => {
  return (
    <nav className="breadcrumb flex items-center space-x-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
      {path.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400 mx-2">/</span>
          )}
          <span 
            className={`text-sm ${
              index === path.length - 1 
                ? 'text-gray-900 font-medium' 
                : 'text-gray-600 hover:text-gray-900 cursor-pointer'
            }`}
            onClick={() => onNavigate && onNavigate(index)}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;