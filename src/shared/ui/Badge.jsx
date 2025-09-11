import React from 'react';
import './Badge.css';

/**
 * 공용 뱃지 컴포넌트
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;