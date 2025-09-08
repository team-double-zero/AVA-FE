import React from 'react';
import { clsx } from '../lib';

/**
 * 공용 카드 컴포넌트
 */
const Card = ({
  children,
  className = '',
  padding = true,
  shadow = true,
  hover = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  
  const classes = clsx(
    baseClasses,
    {
      'p-6': padding,
      'shadow-sm': shadow,
      'hover:shadow-md transition-shadow cursor-pointer': hover || onClick,
    },
    className
  );

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card 하위 컴포넌트들
Card.Header = ({ children, className = '', ...props }) => (
  <div className={clsx('border-b border-gray-200 pb-4 mb-4', className)} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={clsx('border-t border-gray-200 pt-4 mt-4', className)} {...props}>
    {children}
  </div>
);

export default Card;