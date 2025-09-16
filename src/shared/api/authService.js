import { apiClient } from './client';
import { endpoints } from './endpoints';

/**
 * 인증 관련 API 서비스
 */
export const authService = {
  /**
   * 현재 사용자 정보 조회
   * GET /api/v1/auth/me
   * @returns {Promise<Object>} 사용자 정보
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get(endpoints.auth.me);
      return response;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 로그인
   * POST /api/v1/auth/login
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   * @returns {Promise<Object>} 로그인 응답
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(endpoints.auth.login, credentials);
      return response;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  /**
   * 회원가입
   * POST /api/v1/auth/register
   * @param {Object} userData - 회원가입 정보
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.nickname - 닉네임
   * @returns {Promise<Object>} 회원가입 응답
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(endpoints.auth.register, userData);
      return response;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  },

  /**
   * 이메일 인증 재전송
   * POST /api/v1/auth/resend-verification
   * @param {string} email - 이메일
   * @returns {Promise<Object>} 재전송 응답
   */
  resendVerification: async (email) => {
    try {
      const response = await apiClient.post(endpoints.auth.resendVerification, { email });
      return response;
    } catch (error) {
      console.error('이메일 인증 재전송 실패:', error);
      throw error;
    }
  },

  /**
   * 토큰 갱신
   * POST /api/v1/auth/refresh
   * @returns {Promise<Object>} 갱신된 토큰
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post(endpoints.auth.refresh);
      return response;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    }
  },
};

export default authService;
