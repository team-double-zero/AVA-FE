import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, endpoints } from '../../../shared/api';
import { seriesService } from '../../../shared/api/seriesService';
import { config } from '../../../config';

// 더미 데이터 생성 함수 (기존 로직 유지)
const getDummyData = () => {
  // ... (기존 getDummyData 함수의 내용은 그대로 복사)
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
            content: '# 네오 시티 시리즈\n\n2087년, 기술과 자본이 지배하는 거대 도시를 배경으로 한 시리즈입니다...', // Corrected newline escape
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
            content: '# 아르카나 시리즈\n\n마법이 존재하는 중세 판타지 세계를 배경으로 한 시리즈...', // Corrected newline escape
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
            content: '# 에피소드 1: 첫 번째 만남\n\n알렉스가 미라를 처음 만나는 순간...', // Corrected newline escape
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
            content: '# 은하계 전쟁 시리즈\n\n서기 3021년, 은하계를 뒤흔드는 대전쟁을 배경으로 한 시리즈...', // Corrected newline escape
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
            content: '# 아르카디아 시리즈\n\n마법과 검이 공존하는 판타지 세계를 배경으로 한 시리즈...', // Corrected newline escape
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
            content: '# 에피소드 1: 아르카디아 프롤로그\n\n주인공이 아르카디아 왕국에 처음 도착하는 이야기...', // Corrected newline escape
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

// 데이터 변환 함수 - API 응답 구조에 맞게 수정
const processDraftData = (draftItems) => {
    console.log('🔍 Processing draft data:', draftItems);
    
    const seriesItems = [];
    
    if (!Array.isArray(draftItems)) {
      console.warn('Draft items is not an array:', draftItems);
      return { seriesItems };
    }
    
    draftItems.forEach(draft => {
      console.log('🔍 Processing draft item:', draft);
      
      const { id, draft_status, draft_data, created_at, updated_at } = draft;
      
      // draft_data가 있고 그 안에 series 데이터가 있는 경우
      if (draft_data && draft_data.series) {
        const seriesData = draft_data.series;
        const seriesItem = {
          id,
          type: 'series',
          title: seriesData.name || '제목 없음',
          description: seriesData.one_liner || '요약 없음',
          status: draft_status || 'pending',
          feedbackCount: 0,
          createdAt: created_at || updated_at,
          aiGenerated: true,
          draftData: draft_data,
          content: JSON.stringify(seriesData, null, 2)
        };
        seriesItems.push(seriesItem);
      }
      // draft_data가 직접 series 구조인 경우 (API 응답 구조에 따라)
      else if (draft_data && (draft_data.name || draft_data.title)) {
        const seriesItem = {
          id,
          type: 'series',
          title: draft_data.name || draft_data.title || '제목 없음',
          description: draft_data.one_liner || draft_data.description || '요약 없음',
          status: draft_status || 'pending',
          feedbackCount: 0,
          createdAt: created_at || updated_at,
          aiGenerated: true,
          draftData: draft_data,
          content: JSON.stringify(draft_data, null, 2)
        };
        seriesItems.push(seriesItem);
      }
      // draft_data가 비어있거나 처리할 수 없는 구조인 경우 - 기본 정보로 아이템 생성
      else {
        console.warn('Draft data structure not recognized, creating basic item:', draft);
        const seriesItem = {
          id,
          type: 'series',
          title: `Draft #${id}`,
          description: draft_status === 'pending' ? '처리 대기 중인 초안' : 
                      draft_status === 'processing' ? '처리 중인 초안' : 
                      draft_status === 'failed' ? '처리 실패한 초안' : 
                      '상태 불명의 초안',
          status: draft_status || 'pending',
          feedbackCount: 0,
          createdAt: created_at || updated_at,
          aiGenerated: true,
          draftData: draft_data || {},
          content: JSON.stringify(draft, null, 2),
          isIncomplete: true // 불완전한 데이터임을 표시
        };
        seriesItems.push(seriesItem);
      }
    });
    
    console.log('✅ Processed series items:', seriesItems);
    return { seriesItems };
};

// 데이터 페칭 함수
const fetchItemsData = async () => {
  try {
    console.log('🔄 Fetching dashboard items data...');
    console.log('🔧 isDevMode:', config.isDevMode);
    
    if (config.isDevMode) {
      console.log('📋 Using dummy data (dev mode)');
      return getDummyData();
    }

    console.log('🌐 Fetching draft data from API...');
    const response = await seriesService.getDrafts('pending');
    console.log('📦 API Response:', response);
    
    const draftItems = response.data || response || [];
    console.log('📋 Draft items:', draftItems);
    
    const { seriesItems } = processDraftData(draftItems);

    const result = {
      pending: { series: seriesItems, episode: [], video: [] },
      working: { series: [], episode: [], video: [] },
      approved: { series: [], episode: [], video: [] },
    };
    
    console.log('✅ Final dashboard data:', result);
    return result;
  } catch (err) {
    console.error('❌ Failed to fetch items data:', err);
    console.error('📊 Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    // 에러 발생 시에도 빈 데이터 구조 반환 (더미 데이터 대신)
    const fallbackData = {
      pending: { series: [], episode: [], video: [] },
      working: { series: [], episode: [], video: [] },
      approved: { series: [], episode: [], video: [] },
    };
    
    console.log('🔄 Using fallback data structure');
    return fallbackData;
  }
};

// 아이템 데이터를 관리하는 훅
export const useItemsData = () => {
  const queryClient = useQueryClient();

  const { data: itemsData, isLoading, error, refetch } = useQuery({
    queryKey: ['itemsData'],
    queryFn: fetchItemsData,
    // 초기 데이터나 staleTime, cacheTime 등 옵션 추가 가능
    initialData: {
      pending: { series: [], episode: [], video: [] },
      working: { series: [], episode: [], video: [] },
      approved: { series: [], episode: [], video: [] },
    },
  });

  const approveItemMutation = useMutation({
    mutationFn: async (item) => {
      if (config.isDevMode) {
        console.log('DEV_MODE: Simulating approve item.');
        return item; // 시뮬레이션에서는 아이템을 그대로 반환
      }
      // 시리즈만 지원
      if (item.type !== 'series') {
        console.warn(`${item.type} 승인은 아직 지원되지 않습니다.`);
        return Promise.reject(new Error('Unsupported item type for approval.'));
      }
      const endpoint = `${endpoints.series.list}/${item.id}/approve`;
      return apiClient.post(endpoint);
    },
    onSuccess: () => {
      // 성공 시 'itemsData' 쿼리를 무효화하여 데이터를 다시 불러옴
      queryClient.invalidateQueries({ queryKey: ['itemsData'] });
    },
    onError: (err) => {
      console.error('Failed to approve item:', err);
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ item, feedbackText }) => {
      if (config.isDevMode) {
        console.log('DEV_MODE: Simulating submit feedback.');
        return { ...item, feedbackText }; // 시뮬레이션
      }
      // 시리즈만 지원
      if (item.type !== 'series') {
        console.warn(`${item.type} 피드백은 아직 지원되지 않습니다.`);
        return Promise.reject(new Error('Unsupported item type for feedback.'));
      }
      const endpoint = `${endpoints.series.list}/${item.id}/feedback`;
      return apiClient.post(endpoint, { feedback: feedbackText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemsData'] });
    },
    onError: (err) => {
      console.error('Failed to submit feedback:', err);
    },
  });

  const createSeriesMutation = useMutation({
    mutationFn: (userMessage) => seriesService.createDraft(userMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemsData'] });
    },
    onError: (err) => {
      console.error('Failed to create series:', err);
    },
  });

  return {
    itemsData,
    isLoading,
    error,
    refetch,
    approveItem: approveItemMutation.mutate,
    submitFeedback: submitFeedbackMutation.mutate,
    createSeries: createSeriesMutation.mutate,
  };
};

export default useItemsData;
