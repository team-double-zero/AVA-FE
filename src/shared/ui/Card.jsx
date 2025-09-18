import React from 'react';

const Card = ({
  children,
  className = '',
  padding = true,
  shadow = true,
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-white border border-gray-200 rounded-lg relative';

  const paddingStyles = padding ? 'p-6' : '';
  const shadowStyles = shadow ? 'shadow-md' : '';
  const hoverStyles = hover || onClick ? 'transition-shadow duration-200 ease-in-out cursor-pointer hover:shadow-lg' : '';

  const classes = [
    baseStyles,
    paddingStyles,
    shadowStyles,
    hoverStyles,
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

Card.Header = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
