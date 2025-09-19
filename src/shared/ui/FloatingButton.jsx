import React from 'react';

const FloatingButton = ({
  onClick,
  icon,
  position = 'bottom-right',
  className = '',
  disabled = false,
  ...props
}) => {
  const positionStyles = {
    'bottom-right': 'bottom-24 right-6 sm:bottom-9 sm:right-4',
    'bottom-left': 'bottom-24 left-6 sm:bottom-9 sm:left-4',
    'top-right': 'top-6 right-6 sm:top-4 sm:right-4',
    'top-left': 'top-6 left-6 sm:top-4 sm:left-4',
  };

  const baseStyles = 'fixed w-14 h-14 rounded-full border border-white/20 bg-purple-500/10 backdrop-blur-xl text-purple-500 cursor-pointer flex items-center justify-center shadow-[0_8px_32px_rgba(131,112,254,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 z-[10000] outline-none transform-gpu will-change-transform animate-floatingButtonAppear';
  const hoverStyles = 'hover:translate-y-[-2px] hover:scale-105 hover:bg-purple-500/25 hover:shadow-[0_12px_40px_rgba(131,112,254,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:border-white/30';
  const activeStyles = 'active:translate-y-0 active:scale-95 active:bg-purple-500/20 active:shadow-[0_4px_20px_rgba(131,112,254,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]';
  const focusStyles = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/50';
  const disabledStyles = 'bg-gray-400/10 text-gray-400/70 cursor-not-allowed shadow-lg backdrop-blur-md border-white/10 hover:transform-none hover:shadow-lg';

  const classes = [
    baseStyles,
    positionStyles[position] || positionStyles['bottom-right'],
    !disabled && hoverStyles,
    !disabled && activeStyles,
    focusStyles,
    disabled && disabledStyles,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <div className="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:fill-current [&>svg]:drop-shadow-lg [&>img]:w-6 [&>img]:h-6 [&>img]:drop-shadow-lg">
        {icon}
      </div>
    </button>
  );
};

export default FloatingButton;