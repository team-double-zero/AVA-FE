import React from 'react';
import './Card.css';

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
  const classes = [
    'card',
    padding ? 'card-padded' : '',
    shadow ? 'card-shadow' : '',
    hover || onClick ? 'card-hover' : '',
    className
  ].filter(Boolean).join(' ');

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
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

export default Card;