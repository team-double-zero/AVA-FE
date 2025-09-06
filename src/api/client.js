import { tokenUtils } from '../shared/lib';

/**
 * API 클라이언트 - TanStack Query와 함께 사용할 fetch 래퍼
 */
class ApiClient {
  constructor(baseURL = process.env.REACT_APP_DOMAIN || '') {
    this.baseURL = baseURL;
  }

  /**
   * 기본 fetch 래퍼 (토큰 자동 관리 포함)
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await tokenUtils.apiRequest(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // 응답이 ok가 아닌 경우 에러 처리
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * GET 요청
   */
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const url = searchParams.toString() 
      ? `${endpoint}?${searchParams.toString()}` 
      : endpoint;
    
    const response = await this.request(url, { method: 'GET' });
    return response.json();
  }

  /**
   * POST 요청
   */
  async post(endpoint, data = {}) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * PUT 요청
   */
  async put(endpoint, data = {}) {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * DELETE 요청
   */
  async delete(endpoint) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    return response.json();
  }

  /**
   * PATCH 요청
   */
  async patch(endpoint, data = {}) {
    const response = await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();
export default apiClient;