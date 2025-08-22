import { setCookie, getCookie, deleteCookie } from './cookieUtils';

// Access Token을 메모리에 저장 (보안상 안전)
let accessToken = null;

// Access Token 관리
export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// Refresh Token 관리 (쿠키에 저장)
export const setRefreshToken = (token) => {
  setCookie('refreshToken', token, 7); // 7일간 유효
};

export const getRefreshToken = () => {
  return getCookie('refreshToken');
};

export const clearRefreshToken = () => {
  deleteCookie('refreshToken');
};

// 모든 토큰 정리
export const clearAllTokens = () => {
  clearAccessToken();
  clearRefreshToken();
  localStorage.removeItem('userData');
};

// API 요청 시 Access Token을 헤더에 추가하는 함수
export const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

// Refresh Token으로 새로운 Access Token 요청
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const { access_token, refresh_token } = data.data;
      
      // 새로운 토큰들 저장
      setAccessToken(access_token);
      if (refresh_token) {
        setRefreshToken(refresh_token);
      }
      
      return access_token;
    } else {
      throw new Error(data.message || 'Failed to refresh token');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Refresh 실패 시 모든 토큰 정리
    clearAllTokens();
    throw error;
  }
};

// API 요청 래퍼 함수 (자동 토큰 갱신 포함)
export const apiRequest = async (url, options = {}) => {
  // 개발 모드에서는 토큰 없이 요청
  if (process.env.REACT_APP_DEV_MODE === 'true') {
    console.log('개발 모드: 토큰 없이 API 요청');
    return await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  let token = getAccessToken();

  // Access Token이 없으면 Refresh Token으로 갱신 시도
  if (!token) {
    try {
      token = await refreshAccessToken();
    } catch (error) {
      throw new Error('Authentication required');
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // 401 에러 시 토큰 갱신 후 재시도
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      
      // 새 토큰으로 재시도
      return await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  return response;
};
