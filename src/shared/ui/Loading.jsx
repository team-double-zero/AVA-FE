import React from 'react';
import './Loading.css';

/**
 * 공용 로딩 컴포넌트
 */
const Loading = ({
  size = 'medium',
  variant = 'spinner',
  text = '',
  className = '',
  ...props
}) => {
  const classes = [
    'loading',
    `loading-${variant}`,
    `loading-${size}`,
    className
  ].filter(Boolean).join(' ');

  if (variant === 'spinner') {
    return (
      <div className={classes} {...props}>
        <svg
          className="loading-spinner"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="loading-spinner-circle"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="loading-spinner-path"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={classes} {...props}>
        <div className="loading-dots">
          <div className="loading-dot" style={{ animationDelay: '0ms' }} />
          <div className="loading-dot" style={{ animationDelay: '150ms' }} />
          <div className="loading-dot" style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  // skeleton variant
  return (
    <div className="loading-skeleton" {...props}>
      <div className="loading-skeleton-content">
        <div className="loading-skeleton-line loading-skeleton-line-1"></div>
        <div className="loading-skeleton-line loading-skeleton-line-2"></div>
        <div className="loading-skeleton-line loading-skeleton-line-3"></div>
      </div>
    </div>
  );
};

export default Loading;