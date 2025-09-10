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
  },

  // 사용자 관련
  user: {
    /**
     *  get a user profile
     * GET /api/v1/auth/me
     * bearer token (access token) 필요
     * response example:
     * {
     *     "data": {
     *         "user": {
     *             "created_at": "2025-09-05T05:37:33.762186",
     *             "email": "handlecu@gmail.com",
     *             "first_name": null,
     *             "id": 2,
     *             "is_active": true,
     *             "is_verified": true,
     *             "last_login_at": "2025-09-10T06:53:49.213556",
     *             "last_name": null,
     *             "phone_number": null,
     *             "profile_image_url": null,
     *             "updated_at": "2025-09-10T06:53:49.218688",
     *             "username": "handlecu"
     *         }
     *     },
     *     "success": true
     * }
     */
    profile: '/api/v1/auth/me',
  },

  // 시리즈 관련
  series: {
    /**
     * 승인된 시리즈 목록 조회
     * GET /api/v1/series
     * bearer token (access token) 필요
     */
    list: '/api/v1/series',
    create: '/api/v1/series',
    detail: (id) => `/api/v1/series/${id}`,
    update: (id) => `/api/v1/series/${id}`,
    delete: (id) => `/api/v1/series/${id}`,
    approve: (id) => `/api/v1/series/${id}/approve`,
    feedback: (id) => `/api/v1/series/${id}/feedback`,
    /**
     * 초안 시리즈 목록 조회
     * GET /api/v1/series-drafts?draft_status=pending
     * bearer token (access token) 필요
     * 쿼리 파라미터: draft_status (선택)
     */
    drafts: '/api/v1/series-drafts?draft_status=pending',
  },

  // 캐릭터 관련
  characters: {
    /**
     * 캐릭터 목록 조회
     * GET /api/v1/characters
     * bearer token (access token) 필요
     */
    list: '/api/v1/characters',
    create: '/api/v1/characters',
    detail: (id) => `/api/v1/characters/${id}`,
    update: (id) => `/api/v1/characters/${id}`,
    delete: (id) => `/api/v1/characters/${id}`,
    approve: (id) => `/api/v1/characters/${id}/approve`,
    feedback: (id) => `/api/v1/characters/${id}/feedback`,
    bySeries: (seriesId) => `/api/v1/series/${seriesId}/characters`,
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