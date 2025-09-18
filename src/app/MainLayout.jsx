import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './providers';
import { AppRoutes } from './index';
import { SeriesDetailPage } from '../features/dashboard';
import { ItemDetail } from '../features/item-detail';
import { FloatingButton } from '../shared/ui';

// 아이콘 imports
import iconDashboard from '../assets/icons/icon_dashboard.svg';
import iconBrowser from '../assets/icons/icon_browser.svg';
import iconAnalysis from '../assets/icons/icon_analysis.svg';
import iconSetting from '../assets/icons/icon_setting.svg';
import iconPlus from '../assets/icons/icon_plus.svg';

// 탭 정의를 Layout으로 이동
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: iconDashboard },
  { id: 'browse', label: 'Browse', icon: iconBrowser },
  { id: 'analysis', label: 'Analysis', icon: iconAnalysis },
  { id: 'setting', label: 'Setting', icon: iconSetting }
];

const MainLayout = ({
  handleFloatingButtonClick,
  onItemClick,
  onApprove,
  onFeedback,
  onLogout,
  onCreateSeries,
}) => {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  // state나 ui가 아직 준비되지 않았을 경우 렌더링하지 않음 (오류 방지)
  if (!state || !state.ui) {
    return null; // 또는 로딩 스피너를 표시
  }

  const { user, ui } = state;
  const { activeTab, currentView } = ui;

  const handleTabChange = (tabId) => {
    if (activeTab === tabId) return;
    actions.setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const onBack = () => {
    actions.setCurrentView({ type: 'tab', data: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-[length:400%_400%] animate-gradientWave relative touch-action-none select-none overflow-hidden">
      {/* Main Content */}
      <div className={`w-full max-w-none mx-0 px-2 sm:px-5 pt-8 pb-10 h-[calc(100vh-40px)] overflow-hidden relative ${currentView.type === 'detail' || currentView.type === 'seriesDetail' ? 'overflow-y-auto overflow-x-hidden' : ''}`}>
        {currentView.type === 'detail' ? (
          <ItemDetail
            item={currentView.data}
            onBack={onBack}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        ) : currentView.type === 'seriesDetail' ? (
          <SeriesDetailPage
            seriesData={currentView.data}
            onBack={onBack}
            isLoading={false}
          />
        ) : (
          <div className="flex w-full h-full will-change-auto touch-auto overflow-hidden">
            <div className="w-full h-full flex-shrink-0 overflow-hidden pr-0 touch-auto relative isolate rounded-2xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1/2 before:rounded-t-2xl before:pointer-events-none before:bg-gradient-to-b before:from-white/15 before:to-white/5 after:content-[''] after:absolute after:inset-px after:rounded-[19px] after:pointer-events-none after:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)] after:opacity-80 media-reduced-motion:backdrop-blur-lg media-reduced-motion:saturate-130">
              <main className="relative p-6 mx-2 sm:mx-0 min-h-[calc(100vh-16px)] h-full max-h-[calc(100%-16px)] overflow-y-auto touch-pan-x touch-pan-y select-text">
                <AppRoutes
                  onItemClick={onItemClick}
                  onApprove={onApprove}
                  onFeedback={onFeedback}
                  user={user} // AppRoutes는 아직 컨텍스트를 사용하지 않으므로 user를 전달
                  onLogout={onLogout}
                  onCreateSeries={onCreateSeries}
                />
              </main>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {activeTab === 'dashboard' && currentView.type === 'tab' && (
        <FloatingButton
          onClick={handleFloatingButtonClick}
          icon={<img src={iconPlus} alt="새 시리즈 생성" />}
          position="bottom-right"
        />
      )}

      {/* Bottom Header */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-transparent flex items-center justify-between px-4 sm:px-10 mx-4 mb-4 z-40">
        <div className="flex-1 flex items-center h-6 overflow-hidden">
          <div className="relative h-full w-full flex flex-col">
            <div className="help-text absolute top-0 left-0 w-full h-full flex items-center opacity-0 translate-y-full animate-verticalCarousel" style={{ animationDelay: '0s' }}>💡 탭을 클릭해서 이동</div>
            <div className="help-text absolute top-0 left-0 w-full h-full flex items-center opacity-0 translate-y-full animate-verticalCarousel" style={{ animationDelay: '3s' }}>🎯 항목을 클릭해서 자세히 보기</div>
            <div className="help-text absolute top-0 left-0 w-full h-full flex items-center opacity-0 translate-y-full animate-verticalCarousel" style={{ animationDelay: '6s' }}>⚡ 피드백으로 AI가 개선</div>
            <div className="help-text absolute top-0 left-0 w-full h-full flex items-center opacity-0 translate-y-full animate-verticalCarousel" style={{ animationDelay: '9s' }}>🚀 승인하면 다음 단계 생성</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 flex-1 justify-center">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                title={tab.label}
              >
                <div className={`w-9 h-9 rounded-full bg-white/60 transition-all duration-300 flex items-center justify-center backdrop-blur-md border border-white/30 ${activeTab === tab.id ? 'bg-white/90 scale-110 shadow-lg shadow-white/30' : 'hover:bg-white/70 hover:scale-105'}`}>
                  <img src={tab.icon} alt={tab.label} className={`w-5 h-5 transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                </div>
                <span className={`text-xs text-white/70 font-medium text-center transition-all duration-300 ${activeTab === tab.id ? 'text-white/90 font-semibold' : ''}`}>{tab.label.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-white/80 text-base font-medium">{user?.username ? `${user.username}님` : user?.nickname ? `${user.nickname}님` : `${user?.email}님`}</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
