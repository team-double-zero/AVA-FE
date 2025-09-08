import React from 'react';
import { Card, Badge } from '../../../shared/ui';
import { numberFormat } from '../../../shared/lib';

/**
 * KPI 카드 컴포넌트
 */
const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon,
  color = 'blue',
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const changeIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→',
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {numberFormat(value)}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
              <span className="inline-flex items-center">
                {changeIcons[changeType]}
                <span className="ml-1">
                  {Math.abs(change)}% 
                  {changeType === 'positive' ? ' 증가' : changeType === 'negative' ? ' 감소' : ' 변화없음'}
                </span>
              </span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * KPI 카드 그리드 컴포넌트
 */
export const KPICardGrid = ({ metrics, isLoading }) => {
  const kpiCards = [
    {
      title: '총 시리즈',
      value: metrics.totalSeries,
      icon: '📚',
      color: 'blue',
    },
    {
      title: '총 에피소드',
      value: metrics.totalEpisodes,
      icon: '📝',
      color: 'purple',
    },
    {
      title: '총 영상',
      value: metrics.totalVideos,
      icon: '🎬',
      color: 'red',
    },
    {
      title: '승인 대기',
      value: metrics.pendingItems,
      icon: '⏳',
      color: 'yellow',
    },
    {
      title: '작업 중',
      value: metrics.workingItems,
      icon: '🔄',
      color: 'blue',
    },
    {
      title: '승인 완료',
      value: metrics.approvedItems,
      icon: '✅',
      color: 'green',
    },
    {
      title: '오늘 생성',
      value: metrics.todayGenerated,
      icon: '🆕',
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          color={kpi.color}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default KPICard;