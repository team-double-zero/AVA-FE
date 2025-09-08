/**
 * API 응답 스키마 및 타입 정의
 */

// 기본 응답 구조
export const baseResponseSchema = {
  success: 'boolean',
  message: 'string',
  data: 'any',
  meta: {
    page: 'number',
    limit: 'number',
    total: 'number',
    totalPages: 'number',
  },
};

// 시리즈 스키마
export const seriesSchema = {
  id: 'number',
  type: 'string', // 'series'
  title: 'string',
  description: 'string',
  status: 'string', // 'pending', 'approved', 'generating'
  feedbackCount: 'number',
  createdAt: 'string',
  updatedAt: 'string',
  aiGenerated: 'boolean',
  content: 'string',
  feedbackHistory: 'array',
  workStatus: 'string', // 'generating', 'revision_requested'
};

// 캐릭터 스키마
export const characterSchema = {
  id: 'number',
  type: 'string', // 'character'
  title: 'string',
  description: 'string',
  status: 'string',
  feedbackCount: 'number',
  createdAt: 'string',
  updatedAt: 'string',
  aiGenerated: 'boolean',
  seriesId: 'number',
  episodeId: 'number',
  imageUrl: 'string',
  content: 'string',
  feedbackHistory: 'array',
  workStatus: 'string',
};

// 에피소드 스키마
export const episodeSchema = {
  id: 'number',
  type: 'string', // 'episode'
  title: 'string',
  description: 'string',
  status: 'string',
  feedbackCount: 'number',
  createdAt: 'string',
  updatedAt: 'string',
  aiGenerated: 'boolean',
  seriesId: 'number',
  characterId: 'number',
  content: 'string',
  feedbackHistory: 'array',
  workStatus: 'string',
};

// 비디오 스키마
export const videoSchema = {
  id: 'number',
  type: 'string', // 'video'
  title: 'string',
  description: 'string',
  status: 'string',
  feedbackCount: 'number',
  createdAt: 'string',
  updatedAt: 'string',
  aiGenerated: 'boolean',
  seriesId: 'number',
  episodeId: 'number',
  videoUrl: 'string',
  duration: 'string',
  feedbackHistory: 'array',
  workStatus: 'string',
};

// 사용자 스키마
export const userSchema = {
  id: 'number',
  email: 'string',
  username: 'string',
  nickname: 'string',
  createdAt: 'string',
  updatedAt: 'string',
};

// 대시보드 메트릭스 스키마
export const dashboardMetricsSchema = {
  totalSeries: 'number',
  totalCharacters: 'number',
  totalEpisodes: 'number',
  totalVideos: 'number',
  pendingItems: 'number',
  workingItems: 'number',
  approvedItems: 'number',
  todayGenerated: 'number',
  weeklyGenerated: 'number',
};

// 페이지네이션 파라미터
export const paginationParams = {
  page: 1,
  limit: 20,
  cursor: null, // keyset pagination을 위한 커서
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// 필터 파라미터
export const filterParams = {
  status: null, // 'pending', 'approved', 'generating'
  type: null, // 'series', 'character', 'episode', 'video'
  seriesId: null,
  search: null,
  dateFrom: null,
  dateTo: null,
};

// 응답 검증 함수들
export const validateResponse = (data, schema) => {
  // 간단한 스키마 검증 로직
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // 실제 프로젝트에서는 Joi, Yup, Zod 등을 사용하는 것을 권장
  return true;
};

export const validatePaginatedResponse = (response) => {
  return (
    response &&
    typeof response.success === 'boolean' &&
    Array.isArray(response.data) &&
    response.meta &&
    typeof response.meta.total === 'number'
  );
};

export default {
  baseResponseSchema,
  seriesSchema,
  characterSchema,
  episodeSchema,
  videoSchema,
  userSchema,
  dashboardMetricsSchema,
  paginationParams,
  filterParams,
  validateResponse,
  validatePaginatedResponse,
};