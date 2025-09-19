import { apiClient } from './client';
import { endpoints } from './endpoints';

/**
 * 인증 관련 API 서비스 (리팩토링됨)
 */
export const authService = {
  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser() {
    return apiClient.get(endpoints.auth.me);
  },

  /**
   * 로그인
   */
  login(credentials) {
    return apiClient.post(endpoints.auth.login, credentials);
  },

  /**
   * 회원가입
   */
  register(userData) {
    return apiClient.post(endpoints.auth.register, userData);
  },

  /**
   * 이메일 인증 재전송
   */
  resendVerification(email) {
    return apiClient.post(endpoints.auth.resendVerification, { email });
  },

  /**
   * 토큰 갱신
   */
  refreshToken() {
    return apiClient.post(endpoints.auth.refresh);
  },
};

export default authService;