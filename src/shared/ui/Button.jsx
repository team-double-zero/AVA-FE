import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {

  const baseStyles = 'inline-flex items-center justify-center font-medium border-none cursor-pointer transition-all duration-300 relative no-underline outline-none focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500';

  const variantStyles = {
    primary: 'bg-[rgba(131,112,254,0.9)] text-white border border-[rgba(255,255,255,0.2)] shadow-[0_4px_15px_rgba(131,112,254,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[15px] hover:enabled:bg-[rgba(131,112,254,1)] hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_20px_rgba(131,112,254,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]',
    secondary: 'bg-[rgba(229,231,235,0.7)] text-gray-900 border border-[rgba(255,255,255,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-[15px] hover:enabled:bg-[rgba(229,231,235,0.9)] hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]',
    success: 'bg-green-600 text-white hover:enabled:bg-green-700',
    danger: 'bg-red-600 text-white hover:enabled:bg-red-700',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:enabled:bg-gray-50 hover:enabled:text-gray-900',
    ghost: 'bg-transparent text-gray-700 hover:enabled:bg-gray-100',
  };

  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm rounded',
    medium: 'px-4 py-2 text-sm rounded-md',
    large: 'px-6 py-3 text-base rounded-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && disabledStyles,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
      )}
      {icon && !loading && <span className="mr-2 inline-flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
