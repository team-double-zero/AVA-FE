import { useState, useEffect, useCallback } from 'react';
import { apiClient, endpoints } from '../../../shared/api';

/**
 * 아이템 데이터를 관리하는 훅
 */
export const useItemsData = () => {
  const [itemsData, setItemsData] = useState({
    pending: { series: [], episode: [], video: [] },
    working: { series: [], episode: [], video: [] },
    approved: { series: [], episode: [], video: [] },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 개발 모드 더미 데이터
  const getDummyData = () => {
    const rawData = {
      pending: {
        series: [
          {
            id: 1,
            type: 'series',
            title: '미래형 도시 시리즈',
            description: '미래형 디스토피아 시리즈',
            status: 'pending',
            feedbackCount: 0,
            createdAt: '2024-01-15',
            aiGenerated: true,
            content: '# 네오 시티 시리즈\n\n2087년, 기술과 자본이 지배하는 거대 도시를 배경으로 한 시리즈입니다...',
            feedbackHistory: []
          },
          {
            id: 2,
            type: 'series',
            title: '판타지 왕국 시리즈',
            description: '중세 판타지 시리즈',
            status: 'review',
            feedbackCount: 2,
            createdAt: '2024-01-14',
            aiGenerated: true,
            content: '# 아르카나 시리즈\n\n마법이 존재하는 중세 판타지 세계를 배경으로 한 시리즈...',
            feedbackHistory: []
          },
        ],
        episode: [
          {
            id: 1,
            type: 'episode',
            title: '첫 번째 만남',
            description: '주인공과 조력자의 첫 만남',
            status: 'pending',
            feedbackCount: 0,
            createdAt: '2024-01-20',
            aiGenerated: true,
            seriesId: 1,
            content: '# 에피소드 1: 첫 번째 만남\n\n알렉스가 미라를 처음 만나는 순간...',
            feedbackHistory: []
          },
        ],
        video: [
          {
            id: 1,
            type: 'video',
            title: '오프닝 영상',
            description: '게임 인트로 영상',
            status: 'pending',
            feedbackCount: 0,
            createdAt: '2024-01-22',
            aiGenerated: true,
            videoUrl: '/videos/opening-intro.mp4',
            duration: '00:02:30',
            feedbackHistory: []
          },
        ]
      },
      working: {
        series: [
          {
            id: 4,
            type: 'series',
            title: '우주 전쟁 시리즈',
            description: 'SF 우주 배경 시리즈',
            status: 'generating',
            feedbackCount: 3,
            createdAt: '2024-01-13',
            aiGenerated: true,
            workStatus: 'revision_requested',
            content: '# 은하계 전쟁 시리즈\n\n서기 3021년, 은하계를 뒤흔드는 대전쟁을 배경으로 한 시리즈...',
            feedbackHistory: []
          }
        ],
        episode: [],
        video: []
      },
      approved: {
        series: [
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
        ],
        episode: [
          {
            id: 4,
            type: 'episode',
            title: '아르카디아 프롤로그',
            description: '모험의 시작',
            status: 'approved',
            feedbackCount: 0,
            createdAt: '2024-01-06',
            aiGenerated: true,
            seriesId: 5,
            content: '# 에피소드 1: 아르카디아 프롤로그\n\n주인공이 아르카디아 왕국에 처음 도착하는 이야기...',
            feedbackHistory: []
          },
        ],
        video: [
          {
            id: 5,
            type: 'video',
            title: '아르카디아 튜토리얼 영상',
            description: '게임 가이드 영상',
            status: 'approved',
            feedbackCount: 0,
            createdAt: '2024-01-02',
            aiGenerated: true,
            seriesId: 5,
            episodeId: 5,
            videoUrl: '/videos/tutorial-guide.mp4',
            duration: '00:02:30',
            feedbackHistory: []
          },
        ]
      }
    };

    // 캐릭터를 시리즈로 통합
    const processedData = {
      pending: { series: [], episode: [], video: [] },
      working: { series: [], episode: [], video: [] },
      approved: { series: [], episode: [], video: [] },
    };

    Object.keys(rawData).forEach(category => {
      const categoryData = rawData[category];

      processedData[category] = {
        series: categoryData.series || [],
        episode: categoryData.episode || [],
        video: categoryData.video || []
      };
    });

    return processedData;
  };

  // draft 데이터를 시리즈로 변환하는 함수
  const processDraftData = (draftItems) => {
    const seriesItems = [];

    draftItems.forEach(draft => {
      const { id, status, draft_data, created_at } = draft;

      if (draft_data && draft_data.series) {
        // 시리즈 아이템 생성
        const seriesItem = {
          id,
          type: 'series',
          title: draft_data.series.name || '제목 없음',
          description: draft_data.series.one_liner || '요약 없음',
          status,
          feedbackCount: 0,
          createdAt: created_at,
          aiGenerated: true,
          draftData: draft_data,
          content: JSON.stringify(draft_data.series, null, 2)
        };
        seriesItems.push(seriesItem);
      }
    });

    return { seriesItems };
  };

  const fetchItemsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 개발 모드에서는 더미 데이터 사용
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        setItemsData(getDummyData());
        return;
      }

      // 프로덕션에서는 시리즈 초안 API 호출
      const response = await apiClient.get(endpoints.series.drafts);
      const draftItems = response.data || [];

      // draft 데이터를 시리즈로 변환
      const { seriesItems } = processDraftData(draftItems);

      // 상태별로 분류 (현재는 모두 pending으로 처리)
      const processedData = {
        pending: {
          series: seriesItems,
          episode: [],
          video: []
        },
        working: { series: [], episode: [], video: [] },
        approved: { series: [], episode: [], video: [] },
      };

      setItemsData(processedData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch items data:', err);

      // 에러 발생 시 더미 데이터로 폴백
      setItemsData(getDummyData());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 아이템 승인
  const approveItem = useCallback(async (item) => {
    try {
      // 개발 모드에서는 클라이언트 사이드에서만 처리
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        setItemsData(prevData => {
          const newData = { ...prevData };
          
          // 승인 대기에서 제거
          if (prevData.pending[item.type]) {
            newData.pending[item.type] = prevData.pending[item.type].filter(i => i.id !== item.id);
          }
          
          // 승인된 아이템에 추가
          if (!newData.approved[item.type]) {
            newData.approved[item.type] = [];
          }
          newData.approved[item.type].push({
            ...item,
            status: 'approved',
            approvedAt: new Date().toISOString().split('T')[0]
          });

          return newData;
        });
        return;
      }

      // 프로덕션에서는 API 호출 (현재 시리즈만 지원)
      let endpoint;
      if (item.type === 'series') {
        endpoint = `${endpoints.series.list}/${item.id}/approve`;
      } else {
        // 에피소드와 비디오는 아직 API 미지원
        console.warn(`${item.type} 승인은 아직 지원되지 않습니다.`);
        return;
      }

      await apiClient.post(endpoint);
      await fetchItemsData(); // 데이터 새로고침
    } catch (err) {
      setError(err.message);
      console.error('Failed to approve item:', err);
    }
  }, [fetchItemsData]);

  // 피드백 제출
  const submitFeedback = useCallback(async (item, feedbackText) => {
    try {
      // 개발 모드에서는 클라이언트 사이드에서만 처리
      if (process.env.REACT_APP_DEV_MODE === 'true') {
        setItemsData(prevData => {
          const newData = { ...prevData };
          
          // 승인 대기에서 제거
          if (prevData.pending[item.type]) {
            newData.pending[item.type] = prevData.pending[item.type].filter(i => i.id !== item.id);
          }
          
          // 작업 중 아이템에 추가
          if (!newData.working[item.type]) {
            newData.working[item.type] = [];
          }
          newData.working[item.type].push({
            ...item,
            status: 'generating',
            feedbackCount: item.feedbackCount + 1,
            workStatus: 'revision_requested',
            lastFeedback: feedbackText,
            feedbackAt: new Date().toISOString().split('T')[0]
          });

          return newData;
        });
        return;
      }

      // 프로덕션에서는 API 호출 (현재 시리즈만 지원)
      let endpoint;
      if (item.type === 'series') {
        endpoint = `${endpoints.series.list}/${item.id}/feedback`;
      } else {
        // 에피소드와 비디오는 아직 API 미지원
        console.warn(`${item.type} 피드백은 아직 지원되지 않습니다.`);
        return;
      }

      await apiClient.post(endpoint, { feedback: feedbackText });
      await fetchItemsData(); // 데이터 새로고침
    } catch (err) {
      setError(err.message);
      console.error('Failed to submit feedback:', err);
    }
  }, [fetchItemsData]);

  useEffect(() => {
    fetchItemsData();
  }, [fetchItemsData]);

  return {
    itemsData,
    isLoading,
    error,
    refetch: fetchItemsData,
    approveItem,
    submitFeedback,
  };
};

export default useItemsData;