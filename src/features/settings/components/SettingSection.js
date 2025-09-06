import React from 'react';

/**
 * 설정 섹션 컴포넌트
 */
export const SettingSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
    <div className="flex items-center mb-4">
      <span className="text-xl mr-3">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

/**
 * 토글 스위치 컴포넌트
 */
export const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1">
      <div className="font-medium text-gray-900">{label}</div>
      {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer ml-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

/**
 * 숫자 입력 컴포넌트
 */
export const NumberInput = ({ label, description, value, onChange, min, max }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1">
      <div className="font-medium text-gray-900">{label}</div>
      {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
    </div>
    <input
      type="number"
      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ml-4"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || min)}
      min={min}
      max={max}
    />
  </div>
);

export default SettingSection;