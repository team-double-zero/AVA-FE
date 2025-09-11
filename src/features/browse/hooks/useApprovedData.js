import { useState, useEffect, useCallback } from 'react';
import { apiClient, endpoints } from '../../../shared/api';

/**
 * 승인된 아이템 데이터를 관리하는 훅 (Browse 전용)
 */
export const useApprovedData = () => {
  const [approvedSeries, setApprovedSeries] = useState([]);
  const [approvedCharacters, setApprovedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 승인된 시리즈 목록 조회
  const fetchApprovedSeries = useCallback(async () => {
    try {
      const response = await apiClient.get(endpoints.series.list);
      return response.data || [];
    } catch (err) {
      console.error('Failed to fetch approved series:', err);
      return [];
    }
  }, []);

  // 캐릭터 목록 조회 (승인된 시리즈에 속한 캐릭터들만 필터링)
  const fetchApprovedCharacters = useCallback(async () => {
    try {
      const response = await apiClient.get(endpoints.characters.list);
      return response.data || [];
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      return [];
    }
  }, []);

  // 데이터 새로고침
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 개발 모드에서는 더미 데이터 사용
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        const dummySeries = [
          {
            id: 1,
            name: "시선데이트: 하리",
            one_liner: "1인칭 카메라로 함께 걷고 먹고 웃는 도시 데이트 숏폼, 설렘과 배려의 감각을 담다.",
            concept: "1인칭 데이트 바이브 숏폼 시리즈",
            audience: "20-34 성인 시청자",
            created_at: "2025-08-28T08:09:52.155319",
            updated_at: "2025-08-28T08:09:52.155325"
          },
          {
            id: 2,
            name: "쫀득클레이버스",
            one_liner: "손끝에서 살아나는 점토들이 장난스레 변신하는 스톱모션 미니 유니버스",
            concept: "고정 탑다운 작업대에서 촬영; 손은 화면에 등장하지 않음",
            audience: "10~30대 숏폼 시청자",
            created_at: "2025-09-05T11:07:05.371155",
            updated_at: "2025-09-05T11:08:43.142212"
          }
        ];

        const dummyCharacters = [
          {
            id: 1,
            display_name: "준호",
            role: "guest",
            age: "28",
            birthday: "1997-07-02",
            appearance: "미니멀 블랙 앞치마, 헤어는 깔끔한 투블록",
            personality: "친절한 안내자 스타일, 설명은 짧고 핵심만",
            series_id: 1,
            created_at: "2025-08-28T08:09:52.182561",
            updated_at: "2025-08-28T08:09:52.182584"
          },
          {
            id: 2,
            display_name: "모프리",
            role: "host",
            age: 3,
            birthday: "2022-06-15",
            appearance: "주황색 점토 네모 기본형에 큰 흰 눈알 두 개",
            personality: "낙천·호기심·리듬감이 강하고 즉흥적으로 리액션을 던진다",
            series_id: 2,
            created_at: "2025-09-05T11:07:05.387693",
            updated_at: "2025-09-05T11:08:43.142212"
          }
        ];

        setApprovedSeries(dummySeries);
        setApprovedCharacters(dummyCharacters);
        return;
      }

      // 프로덕션에서는 실제 API 호출
      const [seriesData, charactersData] = await Promise.all([
        fetchApprovedSeries(),
        fetchApprovedCharacters()
      ]);

      setApprovedSeries(seriesData);
      setApprovedCharacters(charactersData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch approved data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchApprovedSeries, fetchApprovedCharacters]);

  // 특정 시리즈에 속한 캐릭터들 필터링
  const getSeriesCharacters = useCallback((seriesId) => {
    return approvedCharacters.filter(character =>
      character.series_id === seriesId || character.seriesId === seriesId
    );
  }, [approvedCharacters]);

  // 특정 시리즈 찾기
  const getSeriesById = useCallback((seriesId) => {
    return approvedSeries.find(series => series.id === parseInt(seriesId));
  }, [approvedSeries]);

  // 특정 캐릭터 찾기
  const getCharacterById = useCallback((characterId) => {
    return approvedCharacters.find(character => character.id === parseInt(characterId));
  }, [approvedCharacters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    approvedSeries,
    approvedCharacters,
    isLoading,
    error,
    refetch: fetchData,
    getSeriesCharacters,
    getSeriesById,
    getCharacterById
  };
};

export default useApprovedData;
