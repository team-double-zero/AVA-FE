import { apiRequest } from '../lib/tokenUtils';
import endpoints from './endpoints';

/**
 * 시리즈 관련 API 서비스
 */
export const seriesService = {
  /**
   * 시리즈 초안 생성
   * @param {string} userMessage - 사용자 메시지
   * @returns {Promise<Object>} API 응답
   */
  async createDraft(userMessage) {
    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_DOMAIN}${endpoints.series.createDraft}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_message: userMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: 서버 오류가 발생했습니다.`);
      }

      return await response.json();
    } catch (error) {
      console.error('시리즈 초안 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 초안 시리즈 목록 조회
   * @param {string} draftStatus - 초안 상태 (pending, processing, completed, failed)
   * @returns {Promise<Object>} API 응답
   */
  async getDrafts(draftStatus = 'pending') {
    try {
      const url = draftStatus 
        ? `${import.meta.env.VITE_DOMAIN}/api/v1/series-drafts?draft_status=${draftStatus}`
        : `${import.meta.env.VITE_DOMAIN}/api/v1/series-drafts`;
      
      const response = await apiRequest(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: 서버 오류가 발생했습니다.`);
      }

      return await response.json();
    } catch (error) {
      console.error('시리즈 초안 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 승인된 시리즈 목록 조회
   * @returns {Promise<Object>} API 응답
   */
  async getApprovedSeries() {
    try {
      const response = await apiRequest(
        `${import.meta.env.VITE_DOMAIN}${endpoints.series.list}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: 서버 오류가 발생했습니다.`);
      }

      return await response.json();
    } catch (error) {
      console.error('승인된 시리즈 목록 조회 실패:', error);
      throw error;
    }
  },
};

export default seriesService;
