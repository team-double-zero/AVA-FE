import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 기존 컴포넌트들 (Tailwind CSS 문제로 임시 복구)
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import { AnalysisPage } from '../features/analysis';
import { SettingsPage } from '../features/settings';

// 새로운 컴포넌트들
import SeriesDetailPage from '../features/dashboard/pages/SeriesDetailPage';
import { BrowsePage } from '../features/browse';

/**
 * 라우트 정의
 */
export const AppRoutes = ({ 
  itemsData, 
  onItemClick, 
  onApprove, 
  onFeedback,
  user,
  onLogout,
  onCreateSeries
}) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            itemsData={itemsData}
            onItemClick={onItemClick}
            user={user}
            onCreateSeries={onCreateSeries}
          />
        }
      />
      <Route
        path="/dashboard/series/:seriesId"
        element={
          <SeriesDetailPage
            itemsData={itemsData}
          />
        }
      />
      <Route
        path="/browse"
        element={<BrowsePage />}
      />
      <Route 
        path="/analysis" 
        element={<AnalysisPage />} 
      />
      <Route 
        path="/setting" 
        element={<SettingsPage onLogout={onLogout} />} 
      />
      {/* 404 페이지 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;