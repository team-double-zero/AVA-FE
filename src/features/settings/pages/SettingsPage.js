import React, { useState } from 'react';
import { Button } from '../../../shared/ui';
import { SettingSection, ToggleSwitch, NumberInput } from '../components';

/**
 * 설정 페이지 컴포넌트
 */
const SettingsPage = ({ onLogout }) => {
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

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 여기서 API를 통해 설정 저장
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
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
  };

  return (
    <div className="settings-page">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SETTINGS</h1>
        <p className="text-gray-600">
          대시보드와 승인 프로세스를 개인화하세요.
        </p>
      </div>

      <div className="max-w-4xl">
        {/* 알림 설정 */}
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

        {/* 승인 프로세스 */}
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

        {/* 화면 표시 */}
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

        {/* 액션 버튼들 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="primary" 
              onClick={handleSave}
              loading={isSaving}
            >
              💾 설정 저장
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              🔄 기본값으로 재설정
            </Button>
            {onLogout && (
              <Button 
                variant="danger" 
                onClick={onLogout}
                className="ml-auto"
              >
                🚪 로그아웃
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;