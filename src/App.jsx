import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// 새로운 구조의 컴포넌트들
import { AppProvider, ErrorBoundary, AppRoutes, useApp } from './app/index';

import { SeriesDetailPage } from './features/dashboard';
import { tokenUtils } from './shared/lib';

// 기존 컴포넌트들 (임시로 사용)
import { LoginPage as Login } from './features/auth';
import { SignupPage as Signup } from './features/auth';
import { ItemDetail } from './features/item-detail';
import { FloatingButton } from './shared/ui';

// 아이콘 imports
import iconDashboard from './assets/icons/icon_dashboard.svg';
import iconBrowser from './assets/icons/icon_browser.svg';
import iconAnalysis from './assets/icons/icon_analysis.svg';
import iconSetting from './assets/icons/icon_setting.svg';
import iconPlus from './assets/icons/icon_plus.svg';

import MainLayout from './app/MainLayout';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, actions } = useApp();
  const { user, ui } = state;
  const { activeTab, currentView } = ui;

  // 로컬 상태
  const [showAuthModal, setShowAuthModal] = useState('login');
  const [dashboardCreateHandler, setDashboardCreateHandler] = useState(null);

  // 사용자 인증 상태 확인 (컨텍스트 사용)
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData && !user) {
      try {
        const parsedUserData = JSON.parse(userData);
        actions.setUser(parsedUserData);
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
        localStorage.removeItem('userData');
      }
    }
  }, [user, actions]);

  // URL 경로에 따라 activeTab 설정 (컨텍스트 사용)
  useEffect(() => {
    const path = location.pathname;
    const currentTab = path.substring(1) || 'dashboard';
    if (['dashboard', 'browse', 'analysis', 'setting'].includes(currentTab) && activeTab !== currentTab) {
      actions.setActiveTab(currentTab);
    }
  }, [location.pathname, activeTab, actions]);

  // 로그인 성공 핸들러 (컨텍스트 사용)
  const handleLoginSuccess = (accessToken, userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    actions.setUser(userData);
  };

  // 인증 모드 전환
  const handleAuthSwitch = (authType) => {
    setShowAuthModal(authType);
  };

  // 로그아웃 핸들러 (컨텍스트 사용)
  const handleLogout = () => {
    tokenUtils.clearAllTokens();
    actions.setUser(null);
  };

  // 아이템 클릭 처리 (컨텍스트 사용)
  const handleItemClick = (item) => {
    const viewType = item.type === 'series' ? 'seriesDetail' : 'detail';
    actions.setCurrentView({ type: viewType, data: item });
  };

  // 아이템 승인 처리
  const handleApprove = (item) => {
    console.log('승인:', item);
  };

  // 피드백 처리
  const handleFeedback = (item, feedback) => {
    console.log('피드백:', item, feedback);
  };

  // FloatingButton 클릭 처리
  const handleFloatingButtonClick = () => {
    if (dashboardCreateHandler) {
      dashboardCreateHandler();
    }
  };

  // Dashboard 컴포넌트에서 생성 핸들러를 등록
  const handleSetCreateHandler = useCallback((handler) => {
    setDashboardCreateHandler(() => handler);
  }, []);

  // 로그인하지 않은 경우 인증 모달 표시
  if (!user) {
    return (
      <div className="auth-container">
        {showAuthModal === 'login' ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => handleAuthSwitch('signup')}
          />
        ) : (
          <Signup
            onSwitchToLogin={() => handleAuthSwitch('login')}
          />
        )}
      </div>
    );
  }

  return (
    <MainLayout
      handleFloatingButtonClick={handleFloatingButtonClick}
      // AppRoutes가 컨텍스트를 사용하도록 리팩토링되면 아래 props도 제거 가능
      onItemClick={handleItemClick}
      onApprove={handleApprove}
      onFeedback={handleFeedback}
      onLogout={handleLogout}
      onCreateSeries={handleSetCreateHandler}
    />
  );
}


function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;