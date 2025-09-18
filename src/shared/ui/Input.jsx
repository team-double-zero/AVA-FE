import React from 'react';

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
  const id = props.id || `input-${React.useId()}`;

  const baseInputStyles = 'block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white transition-all duration-200 ease-in-out placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const errorInputStyles = 'border-red-500 text-red-800 focus:ring-red-500 focus:border-red-500 placeholder-red-300';
  const disabledInputStyles = 'bg-gray-50 text-gray-500 cursor-not-allowed';

  const inputClasses = [
    baseInputStyles,
    error ? errorInputStyles : '',
    disabled ? disabledInputStyles : '',
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
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export default Input;
