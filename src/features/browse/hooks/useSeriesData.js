import { useState, useEffect, useCallback } from 'react';
import { apiClient, endpoints } from '../../../api';

/**
 * 시리즈 데이터를 관리하는 훅
 */
export const useSeriesData = (filters = {}) => {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);

  const fetchSeries = useCallback(async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      if (!isLoadMore) {
        setError(null);
        setCursor(null);
      }

      // 개발 모드에서는 더미 데이터 사용
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        const dummySeries = [
          { 
            id: 5, 
            type: 'series', 
            title: '아르카디아 시리즈', 
            description: '판타지 중세 시리즈',
            status: 'approved',
            feedbackCount: 0,
            createdAt: '2024-01-10',
            aiGenerated: true,
            content: '# 아르카디아 시리즈\n\n마법과 검이 공존하는 판타지 세계를 배경으로 한 시리즈...',
            feedbackHistory: []
          },
          { 
            id: 6, 
            type: 'series', 
            title: '네오 시티 시리즈', 
            description: '사이버펑크 미래 시리즈',
            status: 'approved',
            feedbackCount: 0,
            createdAt: '2024-01-09',
            aiGenerated: true,
            content: '# 네오 시티 시리즈\n\n2087년, 거대 기업들이 세계를 지배하는 디스토피아 미래...',
            feedbackHistory: []
          },
        ];

        if (isLoadMore) {
          setSeries(prev => [...prev, ...dummySeries]);
        } else {
          setSeries(dummySeries);
        }
        setHasMore(false);
        return;
      }

      const params = {
        ...filters,
        cursor: isLoadMore ? cursor : undefined,
        limit: 20,
      };

      const response = await apiClient.get(endpoints.series.list, params);
      const newSeries = response.data || [];

      if (isLoadMore) {
        setSeries(prev => [...prev, ...newSeries]);
      } else {
        setSeries(newSeries);
      }

      setHasMore(response.meta?.hasMore || false);
      setCursor(response.meta?.nextCursor || null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch series:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, cursor]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchSeries(true);
    }
  }, [fetchSeries, isLoading, hasMore]);

  const refresh = useCallback(() => {
    setCursor(null);
    setHasMore(true);
    fetchSeries(false);
  }, [fetchSeries]);

  useEffect(() => {
    fetchSeries(false);
  }, [fetchSeries]);

  return {
    series,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

/**
 * 특정 시리즈의 캐릭터들을 가져오는 훅
 */
export const useSeriesCharacters = (seriesId) => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacters = useCallback(async () => {
    if (!seriesId) {
      setCharacters([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 개발 모드에서는 더미 데이터 사용
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        const dummyCharacters = [
          { 
            id: 5, 
            type: 'character', 
            title: '머로우 상인', 
            description: '아이템 판매 캐릭터',
            status: 'approved',
            feedbackCount: 0,
            createdAt: '2024-01-08',
            aiGenerated: true,
            seriesId: seriesId,
            episodeId: 4,
            imageUrl: '/images/shop-keeper.jpg',
            content: '## 캐릭터 프로필\n\n**이름**: 머로우 상인\n**나이**: 45세\n**직업**: 잡화점 주인...',
            feedbackHistory: []
          },
        ];
        setCharacters(dummyCharacters);
        return;
      }

      const response = await apiClient.get(endpoints.characters.bySeries(seriesId));
      setCharacters(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch series characters:', err);
    } finally {
      setIsLoading(false);
    }
  }, [seriesId]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return {
    characters,
    isLoading,
    error,
    refetch: fetchCharacters,
  };
};

/**
 * 특정 시리즈의 에피소드들을 가져오는 훅
 */
export const useSeriesEpisodes = (seriesId) => {
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEpisodes = useCallback(async () => {
    if (!seriesId) {
      setEpisodes([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 개발 모드에서는 더미 데이터 사용
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        const dummyEpisodes = [
          { 
            id: 4, 
            type: 'episode', 
            title: '아르카디아 프롤로그', 
            description: '모험의 시작',
            status: 'approved',
            feedbackCount: 0,
            createdAt: '2024-01-06',
            aiGenerated: true,
            seriesId: seriesId,
            content: '# 에피소드 1: 아르카디아 프롤로그\n\n주인공이 아르카디아 왕국에 처음 도착하는 이야기...',
            feedbackHistory: []
          },
        ];
        setEpisodes(dummyEpisodes);
        return;
      }

      const response = await apiClient.get(endpoints.episodes.bySeries(seriesId));
      setEpisodes(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch series episodes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [seriesId]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return {
    episodes,
    isLoading,
    error,
    refetch: fetchEpisodes,
  };
};

export default useSeriesData;