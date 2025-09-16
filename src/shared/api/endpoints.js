/**
 * API 엔드포인트 정의
 */
export const endpoints = {
  // 인증 관련
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    resendVerification: '/api/v1/auth/resend-verification',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    /**
     * 사용자 정보 조회 API
     * GET /api/v1/auth/me
     * Bearer token (access token) 필요
     */
    me: '/api/v1/auth/me',
  },

  // 사용자 관련 (향후 확장용)
  user: {
    // 현재 사용자 정보 조회는 auth.me 사용
  },

  // 시리즈 관련
  series: {
    /**
     * 승인된 시리즈 목록 조회
     * GET /api/v1/series
     * bearer token (access token) 필요
     */
    list: '/api/v1/series',
    /**
     * 초안 시리즈 목록 조회
     * GET /api/v1/series-drafts?draft_status=pending
     * bearer token (access token) 필요
     * 쿼리 파라미터: draft_status (선택)
     */
    drafts: '/api/v1/series-drafts?draft_status=pending',
    /**
     * 시리즈 초안 생성
     * POST /api/v1/series-drafts?story_type=series
     * bearer token (access token) 필요
     * 요청 바디: { user_message: string }
     */
    createDraft: '/api/v1/series-drafts?story_type=series',
  },

  // 캐릭터 관련
  characters: {
    /**
     * 캐릭터 목록 조회
     * GET /api/v1/characters
     * bearer token (access token) 필요
     */
    list: '/api/v1/characters',
  },

  // 에피소드 관련
  // episodes: {
  //   list: '/api/v1/episodes',
  //   create: '/api/v1/episodes',
  //   detail: (id) => `/api/v1/episodes/${id}`,
  //   update: (id) => `/api/v1/episodes/${id}`,
  //   delete: (id) => `/api/v1/episodes/${id}`,
  //   approve: (id) => `/api/v1/episodes/${id}/approve`,
  //   feedback: (id) => `/api/v1/episodes/${id}/feedback`,
  //   bySeries: (seriesId) => `/api/v1/series/${seriesId}/episodes`,
  // },

  // 비디오 관련
  // videos: {
  //   list: '/api/v1/videos',
  //   create: '/api/v1/videos',
  //   detail: (id) => `/api/v1/videos/${id}`,
  //   update: (id) => `/api/v1/videos/${id}`,
  //   delete: (id) => `/api/v1/videos/${id}`,
  //   approve: (id) => `/api/v1/videos/${id}/approve`,
  //   feedback: (id) => `/api/v1/videos/${id}/feedback`,
  // },

  // 대시보드 관련
  // dashboard: {
  //   metrics: '/api/v1/dashboard/metrics',
  //   pending: '/api/v1/dashboard/pending',
  //   working: '/api/v1/dashboard/working',
  //   approved: '/api/v1/dashboard/approved',
  // },
};

export default endpoints;