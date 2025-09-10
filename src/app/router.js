import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 기존 컴포넌트들 (Tailwind CSS 문제로 임시 복구)
import Dashboard from '../components_backup/Dashboard';
import Analysis from '../components_backup/Analysis';
import Setting from '../components_backup/Setting';

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
  onLogout 
}) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/dashboard" 
        element={
          <Dashboard 
            itemsData={itemsData}
            onItemClick={onItemClick}
            user={user}
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
        element={<Analysis />} 
      />
      <Route 
        path="/setting" 
        element={<Setting onLogout={onLogout} />} 
      />
      {/* 404 페이지 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;