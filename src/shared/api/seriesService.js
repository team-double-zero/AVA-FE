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
    // 올바른 drafts 엔드포인트 사용
    if (draftStatus && draftStatus !== 'pending') {
      return apiClient.get(`${endpoints.series.drafts.replace('?draft_status=pending', '')}?draft_status=${draftStatus}`);
    }
    return apiClient.get(endpoints.series.drafts);
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