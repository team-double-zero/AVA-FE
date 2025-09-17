import { apiClient } from './client';
import endpoints from './endpoints';

/**
 * 시리즈 관련 API 서비스 (리팩토링됨)
 */
export const seriesService = {
  /**
   * 시리즈 초안 생성
   * @param {string} userMessage - 사용자 메시지
   * @returns {Promise<Object>} API 응답
   */
  createDraft(userMessage) {
    return apiClient.post(endpoints.series.createDraft, {
      user_message: userMessage,
    });
  },

  /**
   * 초안 시리즈 목록 조회
   * @param {string} draftStatus - 초안 상태 (pending, processing, completed, failed)
   * @returns {Promise<Object>} API 응답
   */
  getDrafts(draftStatus = 'pending') {
    const params = draftStatus ? { draft_status: draftStatus } : {};
    // getDrafts 엔드포인트가 없으므로 임시로 list 사용
    return apiClient.get(endpoints.series.list, params);
  },

  /**
   * 승인된 시리즈 목록 조회
   * @returns {Promise<Object>} API 응답
   */
  getApprovedSeries() {
    return apiClient.get(endpoints.series.list);
  },
};

export default seriesService;