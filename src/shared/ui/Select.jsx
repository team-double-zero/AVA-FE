import React from 'react';

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
  const id = props.id || `select-${React.useId()}`;

  const baseSelectStyles = 'block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const errorSelectStyles = 'border-red-500 text-red-800 focus:ring-red-500 focus:border-red-500';
  const disabledSelectStyles = 'bg-gray-50 text-gray-500 cursor-not-allowed bg-none';

  const selectClasses = [
    baseSelectStyles,
    error ? errorSelectStyles : '',
    disabled ? disabledSelectStyles : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-1">
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
