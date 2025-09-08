import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 기존 컴포넌트들 (Tailwind CSS 문제로 임시 복구)
import Dashboard from '../components_backup/Dashboard';
import Browse from '../components_backup/Browse';
import Analysis from '../components_backup/Analysis';
import Setting from '../components_backup/Setting';

// 새로운 시리즈 디테일 페이지
import SeriesDetailPage from '../features/dashboard/pages/SeriesDetailPage';

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
        element={
          <Browse 
            itemsData={itemsData}
            onItemClick={onItemClick}
            onApprove={onApprove}
            onFeedback={onFeedback}
          />
        } 
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