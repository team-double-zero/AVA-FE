import React from 'react';
import './FloatingButton.css';

/**
 * Floating Action Button 컴포넌트
 */
const FloatingButton = ({
  onClick,
  icon,
  position = 'bottom-right',
  className = '',
  disabled = false,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'floating-button-bottom-right',
    'bottom-left': 'floating-button-bottom-left',
    'top-right': 'floating-button-top-right',
    'top-left': 'floating-button-top-left',
  };

  const classes = [
    'floating-button',
    positionClasses[position] || positionClasses['bottom-right'],
    disabled ? 'floating-button-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};

export default FloatingButton;
