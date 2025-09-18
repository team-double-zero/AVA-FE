import React from 'react';

const Loading = ({
  size = 'medium',
  variant = 'spinner',
  text = '',
  className = '',
  ...props
}) => {
  const wrapperClasses = ['flex flex-col items-center justify-center', className].join(' ');

  const sizeStyles = {
    spinner: {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
    },
    dots: {
      small: 'w-2 h-2',
      medium: 'w-3 h-3',
      large: 'w-4 h-4',
    },
  };

  if (variant === 'spinner') {
    return (
      <div className={wrapperClasses} {...props}>
        <svg
          className={`animate-spin text-blue-600 ${sizeStyles.spinner[size]}`}
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
        {text && <p className="mt-2 text-sm text-gray-500 text-center">{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={wrapperClasses} {...props}>
        <div className="flex gap-1">
          <div className={`bg-blue-600 rounded-full animate-bounce ${sizeStyles.dots[size]}`} style={{ animationDelay: '0ms' }} />
          <div className={`bg-blue-600 rounded-full animate-bounce ${sizeStyles.dots[size]}`} style={{ animationDelay: '150ms' }} />
          <div className={`bg-blue-600 rounded-full animate-bounce ${sizeStyles.dots[size]}`} style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className="mt-2 text-sm text-gray-500 text-center">{text}</p>}
      </div>
    );
  }

  // skeleton variant
  return (
    <div className={`animate-pulse ${className}`} {...props}>
      <div className="flex flex-col gap-3">
        <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        <div className="bg-gray-200 rounded h-4 w-1/2"></div>
        <div className="bg-gray-200 rounded h-4 w-5/6"></div>
      </div>
    </div>
  );
};

export default Loading;
