import React from 'react';
import './Input.css';

/**
 * 공용 입력 컴포넌트
 */
const Input = ({
  label,
  error,
  helper,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    disabled ? 'input-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />

      {error && (
        <p className="input-error-text">{error}</p>
      )}

      {helper && !error && (
        <p className="input-helper-text">{helper}</p>
      )}
    </div>
  );
};

export default Input;