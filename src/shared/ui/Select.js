import React from 'react';
import { clsx } from '../lib';

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
  
  const selectClasses = clsx(
    'block w-full border rounded-md shadow-sm px-3 py-2 text-sm bg-white',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    error
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export default Select;