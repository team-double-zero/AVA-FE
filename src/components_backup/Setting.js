import React, { useState } from 'react';
import './Setting.css';

const Setting = ({ onLogout }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      slack: true
    },
    approval: {
      autoApprove: false,
      requireReview: true,
      maxPendingItems: 10
    },
    display: {
      darkMode: false,
      compactView: false,
      showPriority: true
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const SettingSection = ({ title, icon, children }) => (
    <div className="setting-section">
      <div className="setting-header">
        <span className="setting-icon">{icon}</span>
        <h3 className="setting-title">{title}</h3>
      </div>
      <div className="setting-content">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="toggle-item">
      <div className="toggle-info">
        <div className="toggle-label">{label}</div>
        {description && <div className="toggle-description">{description}</div>}
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  const NumberInput = ({ label, description, value, onChange, min, max }) => (
    <div className="number-item">
      <div className="number-info">
        <div className="number-label">{label}</div>
        {description && <div className="number-description">{description}</div>}
      </div>
      <input
        type="number"
        className="number-input"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
      />
    </div>
  );

  return (
    <div className="setting">
      <div className="setting-page-header">
        <h2 className="setting-page-title">설정</h2>
        <p className="setting-page-subtitle">대시보드와 승인 프로세스를 개인화하세요</p>
      </div>

      <div className="setting-container">
        <SettingSection title="알림 설정" icon="🔔">
          <ToggleSwitch
            label="이메일 알림"
            description="새로운 승인 요청이 있을 때 이메일로 알림받기"
            checked={settings.notifications.email}
            onChange={(value) => handleSettingChange('notifications', 'email', value)}
          />
          <ToggleSwitch
            label="푸시 알림"
            description="브라우저 푸시 알림 받기"
            checked={settings.notifications.push}
            onChange={(value) => handleSettingChange('notifications', 'push', value)}
          />
          <ToggleSwitch
            label="Slack 알림"
            description="Slack 채널로 알림 전송하기"
            checked={settings.notifications.slack}
            onChange={(value) => handleSettingChange('notifications', 'slack', value)}
          />
        </SettingSection>

        <SettingSection title="승인 프로세스" icon="✅">
          <ToggleSwitch
            label="자동 승인"
            description="특정 조건을 만족하는 아이템 자동 승인"
            checked={settings.approval.autoApprove}
            onChange={(value) => handleSettingChange('approval', 'autoApprove', value)}
          />
          <ToggleSwitch
            label="리뷰 필수"
            description="모든 아이템에 대해 리뷰 단계 필수로 하기"
            checked={settings.approval.requireReview}
            onChange={(value) => handleSettingChange('approval', 'requireReview', value)}
          />
          <NumberInput
            label="최대 대기 아이템 수"
            description="한 번에 처리할 수 있는 최대 아이템 개수"
            value={settings.approval.maxPendingItems}
            onChange={(value) => handleSettingChange('approval', 'maxPendingItems', value)}
            min={1}
            max={50}
          />
        </SettingSection>

        <SettingSection title="화면 표시" icon="🎨">
          <ToggleSwitch
            label="다크 모드"
            description="어두운 테마 사용하기"
            checked={settings.display.darkMode}
            onChange={(value) => handleSettingChange('display', 'darkMode', value)}
          />
          <ToggleSwitch
            label="컴팩트 뷰"
            description="카드 크기를 작게 하여 더 많은 정보 표시"
            checked={settings.display.compactView}
            onChange={(value) => handleSettingChange('display', 'compactView', value)}
          />
          <ToggleSwitch
            label="우선순위 표시"
            description="아이템 카드에 우선순위 뱃지 표시"
            checked={settings.display.showPriority}
            onChange={(value) => handleSettingChange('display', 'showPriority', value)}
          />
        </SettingSection>

        <div className="setting-actions">
          <button className="save-button">
            💾 설정 저장
          </button>
          <button className="reset-button">
            🔄 기본값으로 재설정
          </button>
          {onLogout && (
            <button className="logout-button" onClick={onLogout}>
              🚪 로그아웃
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;