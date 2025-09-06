import React from 'react';
import { clsx } from '../lib';

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
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    pending: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    generating: 'bg-blue-100 text-blue-800',
    review: 'bg-purple-100 text-purple-800',
  };
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-sm',
    large: 'px-3 py-1 text-base',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;