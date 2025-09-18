import { useState, useEffect } from 'react';
import { apiClient, endpoints } from '../../../shared/api';
import { config } from '../../../config';

/**
 * 대시보드 메트릭스 데이터를 관리하는 훅
 */
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalSeries: 0,
    totalEpisodes: 0,
    totalVideos: 0,
    pendingItems: 0,
    workingItems: 0,
    approvedItems: 0,
    todayGenerated: 0,
    weeklyGenerated: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 개발 모드에서는 더미 데이터 사용
      if (config.isDevMode) {
        // 실제 itemsData에서 계산된 메트릭스를 반환하도록 수정 예정
        setMetrics({
          totalSeries: 12, // 기존 시리즈 8 + 캐릭터 4 = 12
          totalEpisodes: 7,
          totalVideos: 8,
          pendingItems: 6,
          workingItems: 3,
          approvedItems: 21,
          todayGenerated: 2,
          weeklyGenerated: 8,
        });
        return;
      }

      // 프로덕션에서는 시리즈와 캐릭터 데이터를 조합하여 메트릭스 계산
      const [seriesResponse, charactersResponse] = await Promise.all([
        apiClient.get(endpoints.series.list),
        apiClient.get(endpoints.characters.list)
      ]);

      const seriesData = seriesResponse.data || [];
      const charactersData = charactersResponse.data || [];

      setMetrics({
        totalSeries: seriesData.length + charactersData.length, // 시리즈 + 캐릭터
        totalEpisodes: 0, // 현재 API에 없는 데이터
        totalVideos: 0,   // 현재 API에 없는 데이터
        pendingItems: 0,  // 현재 API에 없는 데이터
        workingItems: 0,  // 현재 API에 없는 데이터
        approvedItems: seriesData.length + charactersData.length,
        todayGenerated: 0, // 현재 API에 없는 데이터
        weeklyGenerated: 0, // 현재 API에 없는 데이터
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
};

/**
 * itemsData에서 메트릭스를 계산하는 훅 (클라이언트 사이드 계산)
 */
export const useCalculatedMetrics = (itemsData) => {
  const [metrics, setMetrics] = useState({
    totalSeries: 0,
    totalEpisodes: 0,
    totalVideos: 0,
    pendingItems: 0,
    workingItems: 0,
    approvedItems: 0,
    todayGenerated: 0,
    weeklyGenerated: 0,
  });

  useEffect(() => {
    if (!itemsData) return;

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const calculateMetrics = () => {
      const categories = ['pending', 'working', 'approved'];
      const types = ['series', 'character', 'episode', 'video'];
      
      let totalSeries = 0;
      let totalEpisodes = 0;
      let totalVideos = 0;
      let pendingItems = 0;
      let workingItems = 0;
      let approvedItems = 0;
      let todayGenerated = 0;
      let weeklyGenerated = 0;

      categories.forEach(category => {
        types.forEach(type => {
          const items = itemsData[category]?.[type] || [];
          
          // 시리즈와 캐릭터를 시리즈로 통합
          if (type === 'series' || type === 'character') totalSeries += items.length;
          if (type === 'episode') totalEpisodes += items.length;
          if (type === 'video') totalVideos += items.length;

          // 상태별 총계
          if (category === 'pending') pendingItems += items.length;
          if (category === 'working') workingItems += items.length;
          if (category === 'approved') approvedItems += items.length;

          // 생성 날짜별 계산
          items.forEach(item => {
            if (item.createdAt === today) {
              todayGenerated++;
            }
            if (item.createdAt >= weekAgo) {
              weeklyGenerated++;
            }
          });
        });
      });

      return {
        totalSeries,
        totalEpisodes,
        totalVideos,
        pendingItems,
        workingItems,
        approvedItems,
        todayGenerated,
        weeklyGenerated,
      };
    };

    setMetrics(calculateMetrics());
  }, [itemsData]);

  return metrics;
};

export default useDashboardMetrics;