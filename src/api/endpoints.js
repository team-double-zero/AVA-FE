/**
 * API 엔드포인트 정의
 */
export const endpoints = {
  // 인증 관련
  auth: {
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    signup: '/api/v1/auth/signup',
  },

  // 사용자 관련
  user: {
    profile: '/api/v1/user/profile',
    update: '/api/v1/user/profile',
  },

  // 시리즈 관련
  series: {
    list: '/api/v1/series',
    create: '/api/v1/series',
    detail: (id) => `/api/v1/series/${id}`,
    update: (id) => `/api/v1/series/${id}`,
    delete: (id) => `/api/v1/series/${id}`,
    approve: (id) => `/api/v1/series/${id}/approve`,
    feedback: (id) => `/api/v1/series/${id}/feedback`,
  },

  // 캐릭터 관련
  characters: {
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
  episodes: {
    list: '/api/v1/episodes',
    create: '/api/v1/episodes',
    detail: (id) => `/api/v1/episodes/${id}`,
    update: (id) => `/api/v1/episodes/${id}`,
    delete: (id) => `/api/v1/episodes/${id}`,
    approve: (id) => `/api/v1/episodes/${id}/approve`,
    feedback: (id) => `/api/v1/episodes/${id}/feedback`,
    bySeries: (seriesId) => `/api/v1/series/${seriesId}/episodes`,
  },

  // 비디오 관련
  videos: {
    list: '/api/v1/videos',
    create: '/api/v1/videos',
    detail: (id) => `/api/v1/videos/${id}`,
    update: (id) => `/api/v1/videos/${id}`,
    delete: (id) => `/api/v1/videos/${id}`,
    approve: (id) => `/api/v1/videos/${id}/approve`,
    feedback: (id) => `/api/v1/videos/${id}/feedback`,
  },

  // 대시보드 관련
  dashboard: {
    metrics: '/api/v1/dashboard/metrics',
    pending: '/api/v1/dashboard/pending',
    working: '/api/v1/dashboard/working',
    approved: '/api/v1/dashboard/approved',
  },
};

export default endpoints;