import React, { useState } from 'react';
import { useScrollMonitor } from '../../../shared/ui/hooks';

const SettingsPage = ({ onLogout }) => {
  const { scrollRef, scrollInfo } = useScrollMonitor({ debug: true });
  
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
    <div className="bg-white rounded-2xl p-5 mb-4 border-2 border-gray-200 transition-all duration-300 hover:border-purple-300 hover:shadow-lg sm:p-4">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex justify-between items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-gray-100 sm:flex-col sm:items-start sm:gap-2">
      <div className="flex-1">
        <div className="text-base font-medium text-gray-800 mb-1">{label}</div>
        {description && <div className="text-sm text-gray-600 leading-relaxed">{description}</div>}
      </div>
      <label className="relative inline-block w-13 h-7 flex-shrink-0 sm:self-end">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="opacity-0 w-0 h-0 peer"
        />
        <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500 before:absolute before:content-[''] before:h-5 before:w-5 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 peer-checked:before:translate-x-6 peer-hover:shadow-md"></span>
      </label>
    </div>
  );

  const NumberInput = ({ label, description, value, onChange, min, max }) => (
    <div className="flex justify-between items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-gray-100 sm:flex-col sm:items-start sm:gap-2">
      <div className="flex-1">
        <div className="text-base font-medium text-gray-800 mb-1">{label}</div>
        {description && <div className="text-sm text-gray-600 leading-relaxed">{description}</div>}
      </div>
      <input
        type="number"
        className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg text-base text-center bg-white transition-all duration-300 focus:outline-none focus:border-purple-500 focus:shadow-md sm:self-end"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
      />
    </div>
  );

  return (
    <div ref={scrollRef} className="w-full min-h-full h-auto pb-0">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 sm:text-2xl">설정</h2>
        <p className="text-lg text-gray-600 sm:text-base">대시보드와 승인 프로세스를 개인화하세요</p>
      </div>

      <div className="max-w-3xl mx-auto">
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

        <div className="flex gap-4 justify-center mt-6 pt-4 border-t-2 border-gray-100 sm:flex-col">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2">
            💾 설정 저장
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl shadow-md border-2 border-gray-200 transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300 flex items-center justify-center gap-2">
            🔄 기본값으로 재설정
          </button>
          {onLogout && (
            <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:bg-red-600 flex items-center justify-center gap-2" onClick={onLogout}>
              🚪 로그아웃
            </button>
          )}
        </div>
      </div>
      
      {/* 스크롤 디버그 정보 */}
      {scrollInfo && (
        <div className="fixed top-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs z-50 border border-white/20">
          <div className="text-green-400 font-bold mb-2">📊 스크롤 상태</div>
          <div>위치: {Math.round(scrollInfo.scrollTop)}px</div>
          <div>화면: {scrollInfo.clientHeight}px</div>
          <div>전체: {scrollInfo.scrollHeight}px</div>
          <div>여백: {Math.round(scrollInfo.scrollHeight - scrollInfo.clientHeight)}px</div>
          <div>진행률: {Math.round(scrollInfo.scrollPercentage)}%</div>
          <div>하단까지: {Math.round(scrollInfo.scrollBottom)}px</div>
          <div className={scrollInfo.isAtBottom ? 'text-green-400 font-bold' : 'text-red-400'}>
            {scrollInfo.isAtBottom ? '✅ 끝까지 도달' : '❌ 더 스크롤 가능'}
          </div>
          <div className="text-gray-300 mt-1 text-xs">
            여백비율: {Math.round((scrollInfo.scrollHeight - scrollInfo.clientHeight) / scrollInfo.scrollHeight * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;