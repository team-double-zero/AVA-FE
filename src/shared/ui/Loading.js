import React from 'react';
import { clsx } from '../lib';

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
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <div className={clsx('flex flex-col items-center justify-center', className)} {...props}>
        <svg
          className={clsx('animate-spin text-blue-600', sizeClasses[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={clsx('flex flex-col items-center justify-center', className)} {...props}>
        <div className="flex space-x-1">
          <div className={clsx('bg-blue-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
          <div className={clsx('bg-blue-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
          <div className={clsx('bg-blue-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    );
  }

  // skeleton variant
  return (
    <div className={clsx('animate-pulse', className)} {...props}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default Loading;