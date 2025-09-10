import React from 'react';
import './Select.css';

/**
 * 공용 셀렉트 컴포넌트
 */
const Select = ({
  label,
  error,
  helper,
  placeholder = '선택해주세요',
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const id = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectClasses = [
    'select',
    error ? 'select-error' : '',
    disabled ? 'select-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={option.value || index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="select-error-text">{error}</p>
      )}

      {helper && !error && (
        <p className="select-helper-text">{helper}</p>
      )}
    </div>
  );
};

export default Select;