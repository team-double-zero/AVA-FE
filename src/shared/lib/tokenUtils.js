import * as cookieUtils from './cookieUtils';
import { endpoints } from '../api/endpoints';

// Access Token을 메모리에 저장 (보안상 안전)
let accessToken = null;
let tokenExpiryTime = null; // 토큰 만료 시간 저장

// 토큰 갱신 중복 방지
let isRefreshing = false;
let refreshPromise = null;

// 토큰 초기화 중 플래그 (레이스 조건 방지)
let isInitializing = false;

// 초기화 상태 확인 함수
export const getIsInitializing = () => isInitializing;
export const setIsInitializing = (status) => {
  isInitializing = status;
  console.log('🔄 토큰 초기화 상태:', status ? '시작' : '완료');
};

// JWT 토큰 디코딩 함수
const decodeJWT = (token) => {
  try {
    // 토큰이 없거나 유효하지 않은 경우 처리
    if (!token || typeof token !== 'string') {
      console.error('토큰이 없거나 유효하지 않음:', token);
      return null;
    }

    // Bearer 접두사 제거 (안전하게 처리)
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    
    // 개발 모드 더미 토큰 처리
    if (cleanToken.startsWith('dev_') || cleanToken.startsWith('offline_') || cleanToken.startsWith('valid_stored_token_')) {
      // 개발 모드 토큰은 1시간 후 만료로 설정
      const expiry = Date.now() + (60 * 60 * 1000); // 1시간
      return {
        exp: Math.floor(expiry / 1000),
        iat: Math.floor(Date.now() / 1000),
        sub: 'dev_user'
      };
    }
    
    // JWT 형식 검증 (3개 부분으로 구성되어야 함)
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('JWT 형식이 올바르지 않음:', parts.length, 'parts');
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error, 'token:', token);
    return null;
  }
};

// 토큰 만료 시간 확인
const getTokenExpiryTime = (token) => {
  const decoded = decodeJWT(token);
  if (decoded && decoded.exp) {
    // JWT의 exp는 Unix timestamp (초 단위)이므로 밀리초로 변환
    const expiryTime = decoded.exp * 1000;
    console.log('🕐 토큰 만료 시간 계산:', {
      exp: decoded.exp,
      expiryTimeMs: expiryTime,
      expiryDate: new Date(expiryTime).toLocaleString(),
      currentTime: new Date().toLocaleString(),
      isExpired: Date.now() >= expiryTime,
      timeLeft: Math.round((expiryTime - Date.now()) / 1000) + '초'
    });
    return expiryTime;
  }
  console.log('⚠️ 토큰에서 만료 시간을 추출할 수 없음:', { decoded, token: token ? token.substring(0, 20) + '...' : 'null' });
  return null;
};

// localStorage에서 토큰 만료 시간 가져오기
const getStoredTokenExpiryTime = () => {
  const stored = localStorage.getItem('tokenExpiryTime');
  return stored ? parseInt(stored, 10) : null;
};

// 토큰이 곧 만료되는지 확인 (1분 전)
export const isTokenExpiringSoon = () => {
  const expiryTime = tokenExpiryTime || getStoredTokenExpiryTime();
  if (!expiryTime || typeof expiryTime !== 'number') {
    console.log('⚠️ 만료 시간이 없거나 유효하지 않음:', expiryTime);
    return true; // 안전하게 만료 예정으로 처리
  }
  
  const currentTime = Date.now();
  const oneMinute = 60 * 1000; // 1분
  const timeLeft = expiryTime - currentTime;
  const isExpiringSoon = timeLeft <= oneMinute;
  
  console.log('🕐 토큰 만료 임박 검사:', {
    expiryTime: new Date(expiryTime).toLocaleString(),
    currentTime: new Date(currentTime).toLocaleString(),
    timeLeft: Math.round(timeLeft / 1000) + '초',
    isExpiringSoon
  });
  
  return isExpiringSoon;
};

// 토큰이 만료되었는지 확인
export const isTokenExpired = () => {
  const expiryTime = tokenExpiryTime || getStoredTokenExpiryTime();
  if (!expiryTime || typeof expiryTime !== 'number') {
    console.log('⚠️ 만료 시간이 없거나 유효하지 않음:', expiryTime);
    return true; // 안전하게 만료된 것으로 처리
  }
  
  const currentTime = Date.now();
  const isExpired = currentTime >= expiryTime;
  
  console.log('🕐 토큰 만료 검사:', {
    expiryTime: new Date(expiryTime).toLocaleString(),
    currentTime: new Date(currentTime).toLocaleString(),
    timeLeft: Math.round((expiryTime - currentTime) / 1000) + '초',
    isExpired
  });
  
  return isExpired;
};

// 저장된 토큰이 여전히 유효한지 확인 (새로고침 시 사용)
export const hasValidStoredToken = () => {
  const userData = localStorage.getItem('userData');
  const refreshToken = getRefreshToken();
  const storedExpiryTime = getStoredTokenExpiryTime();
  const accessTokenHash = localStorage.getItem('accessTokenHash');
  
  console.log('🔍 저장된 토큰 유효성 검사:', {
    hasUserData: !!userData,
    hasRefreshToken: !!refreshToken,
    hasStoredExpiryTime: !!storedExpiryTime,
    hasAccessTokenHash: !!accessTokenHash,
    expiryTime: storedExpiryTime ? new Date(storedExpiryTime).toLocaleString() : 'N/A',
    currentTime: new Date().toLocaleString(),
    isExpired: storedExpiryTime ? Date.now() >= storedExpiryTime : 'N/A'
  });
  
  // 필수 데이터가 모두 있고 토큰이 아직 만료되지 않았는지 확인
  const isValid = !!(userData && refreshToken && storedExpiryTime && accessTokenHash && Date.now() < storedExpiryTime);
  console.log('📊 저장된 토큰 유효성 결과:', isValid);
  
  return isValid;
};

// Access Token 관리
export const setAccessToken = (token) => {
  accessToken = token;
  tokenExpiryTime = token ? getTokenExpiryTime(token) : null;
  
  if (token && tokenExpiryTime) {
    // 토큰 만료 시간을 localStorage에 저장 (새로고침 시에도 확인 가능)
    localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
    
    // Access Token도 임시로 localStorage에 저장 (새로고침 시 복원용)
    // 보안상 암호화된 형태로 저장하거나 해시값만 저장
    const tokenHash = btoa(token.substring(0, 10) + '_' + tokenExpiryTime); // 간단한 해시
    localStorage.setItem('accessTokenHash', tokenHash);
    
    const expiryDate = new Date(tokenExpiryTime);
    console.log('🔑 Access Token 저장됨, 만료 시간:', expiryDate.toLocaleString());
  } else {
    localStorage.removeItem('tokenExpiryTime');
    localStorage.removeItem('accessTokenHash');
  }
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
  tokenExpiryTime = null;
  localStorage.removeItem('tokenExpiryTime');
  localStorage.removeItem('accessTokenHash');
};

// Refresh Token 관리 (쿠키에 저장)
export const setRefreshToken = (token) => {
  console.log('🔑 Refresh Token 저장 시도:', token ? 'token_' + token.substring(0, 10) + '...' : 'null');
  cookieUtils.setCookie('refreshToken', token, 7); // 7일간 유효
  
  // 저장 후 즉시 확인
  const saved = getRefreshToken();
  console.log('🔍 저장 후 확인:', saved ? 'token_' + saved.substring(0, 10) + '...' : 'null');
};

export const getRefreshToken = () => {
  return cookieUtils.getCookie('refreshToken');
};

export const clearRefreshToken = () => {
  cookieUtils.deleteCookie('refreshToken');
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
  // 이미 갱신 중이면 기존 Promise 반환
  if (isRefreshing) {
    console.log('⏳ 토큰 갱신이 이미 진행 중 - 기존 요청 대기');
    return refreshPromise;
  }

  // 현재 Access Token이 있고 아직 유효하면 갱신하지 않음
  const currentToken = getAccessToken();
  if (currentToken && !isTokenExpired() && !isTokenExpiringSoon()) {
    console.log('✅ 현재 토큰이 여전히 유효함 - 갱신 불필요');
    return currentToken;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.log('❌ Refresh Token이 없음');
    console.log('🔍 전체 쿠키:', document.cookie);
    throw new Error('No refresh token available');
  }

  // 갱신 시작
  isRefreshing = true;
  
  // Promise를 생성하여 중복 요청 시 같은 Promise 반환
  refreshPromise = (async () => {
    console.log('🔄 Refresh Token으로 Access Token 갱신 시도...');
    console.log('🔑 사용할 Refresh Token:', refreshToken ? 'token_' + refreshToken.substring(0, 10) + '...' : 'null');

  // 먼저 Authorization 헤더로 시도
  try {
    console.log('📤 첫 번째 시도: Authorization 헤더로 Refresh Token 전송');

    let response = await fetch(`${import.meta.env.VITE_DOMAIN}${endpoints.auth.refresh}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    });

    console.log('🔑 첫 번째 시도 응답 상태:', response.status);

    // 첫 번째 시도가 실패하면 body로 다시 시도
    if (!response.ok && response.status === 401) {
      console.log('📤 두 번째 시도: Body로 Refresh Token 전송');
      
      response = await fetch(`${import.meta.env.VITE_DOMAIN}${endpoints.auth.refresh}`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      console.log('🔑 두 번째 시도 응답 상태:', response.status);
    }

    console.log('🔑 Refresh 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Refresh 응답 에러:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('📄 Refresh 응답 데이터:', data);

    if (data.success) {
      // 다양한 응답 형식에 대응하여 토큰 추출
      const responseData = data.data || data;
      const newAccessToken = responseData.access_token || responseData.accessToken || responseData.token;
      const newRefreshToken = responseData.refresh_token || responseData.refreshToken;
      
      if (!newAccessToken) {
        console.error('❌ 응답에서 Access Token을 찾을 수 없음:', data);
        throw new Error('Access token not found in response');
      }
      
      // 새로운 토큰들 저장
      setAccessToken(newAccessToken);
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
        console.log('🔄 새로운 Refresh Token도 업데이트됨');
      }
      
      console.log('✅ Access Token 갱신 성공');
      return newAccessToken;
    } else {
      console.error('❌ 서버에서 실패 응답:', data.message);
      throw new Error(data.message || 'Failed to refresh token');
    }
  } catch (error) {
    console.error('❌ Token refresh 완전 실패:', error);
    
    // 네트워크 에러나 서버 에러인 경우와 인증 에러를 구분
    if (error.message.includes('fetch') || error.message.includes('Network')) {
      console.log('🌐 네트워크 에러 - 토큰 데이터 유지');
      // 네트워크 에러인 경우 토큰을 즉시 삭제하지 않음
      throw error;
    } else {
      console.log('🔒 인증 에러 - 모든 토큰 정리');
      // 인증 에러인 경우만 토큰 정리
      clearAllTokens();
      throw error;
    }
  } finally {
    // 갱신 완료 후 상태 초기화
    isRefreshing = false;
    refreshPromise = null;
  }
  })();

  return refreshPromise;
};

// API 요청 래퍼 함수 (자동 토큰 갱신 포함)
export const apiRequest = async (url, options = {}) => {
  // 개발 모드에서는 토큰 없이 요청
  if (import.meta.env.VITE_DEV_MODE === 'true') {
    console.log('개발 모드: 토큰 없이 API 요청');
    return await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  // 토큰 초기화 중이면 대기
  if (isInitializing) {
    console.log('⏳ 토큰 초기화 중 - API 요청 대기');
    // 최대 5초까지 대기
    let waitTime = 0;
    const maxWaitTime = 5000;
    const checkInterval = 100;
    
    while (isInitializing && waitTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waitTime += checkInterval;
    }
    
    if (isInitializing) {
      console.log('⚠️ 토큰 초기화 대기 시간 초과');
    } else {
      console.log('✅ 토큰 초기화 완료 - API 요청 진행');
    }
  }

  let token = getAccessToken();

  // 토큰 상태 확인 및 갱신 필요성 판단
  const tokenExpired = isTokenExpired();
  const tokenExpiringSoon = isTokenExpiringSoon();
  const hasStoredValidToken = hasValidStoredToken();
  
  console.log('🔍 API 요청 전 토큰 상태 확인:', {
    hasMemoryToken: !!token,
    tokenExpired,
    tokenExpiringSoon,
    hasStoredValidToken,
    url: url.replace(import.meta.env.VITE_DOMAIN || '', '')
  });

  // Access Token이 없거나 만료되었거나 곧 만료될 예정이면 갱신
  const needsRefresh = !token || tokenExpired || tokenExpiringSoon || (!token && hasStoredValidToken);
  
  if (needsRefresh) {
    console.log('🔄 토큰 갱신 필요:', {
      reason: !token ? '토큰 없음' : tokenExpired ? '만료됨' : tokenExpiringSoon ? '곧 만료' : '저장된 토큰 복원'
    });
    
    try {
      token = await refreshAccessToken();
      console.log('✅ 토큰 갱신 완료 - API 요청 진행');
    } catch (error) {
      console.error('❌ 토큰 갱신 실패:', error);
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

// 기본 내보내기 (기존 호환성 유지)
export default {
  getIsInitializing,
  setIsInitializing,
  isTokenExpiringSoon,
  isTokenExpired,
  hasValidStoredToken,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
  clearAllTokens,
  getAuthHeaders,
  refreshAccessToken,
  apiRequest,
};