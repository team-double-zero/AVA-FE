// 쿠키 관리 유틸리티 함수들

export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // 개발 환경(localhost)과 프로덕션 환경을 구분하여 쿠키 설정
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isHttps = window.location.protocol === 'https:';
  
  let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  
  if (isLocalhost) {
    // 로컬 개발 환경: SameSite=Lax, Secure 없음
    cookieString += `; SameSite=Lax`;
    console.log('🍪 로컬 환경 쿠키 설정:', cookieString);
  } else {
    // 프로덕션 환경: SameSite=Strict, HTTPS에서만 Secure
    cookieString += `; SameSite=Strict`;
    if (isHttps) {
      cookieString += `; Secure`;
    }
    console.log('🍪 프로덕션 환경 쿠키 설정:', cookieString);
  }
  
  document.cookie = cookieString;
  
  // 설정 후 즉시 확인
  console.log('🔍 쿠키 설정 후 확인:', getCookie(name));
};

export const getCookie = (name) => {
  console.log('🔍 쿠키 조회 시도:', name);
  console.log('📋 전체 쿠키:', document.cookie);
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      console.log('✅ 쿠키 발견:', name, '=', value);
      return value;
    }
  }
  console.log('❌ 쿠키 없음:', name);
  return null;
};

export const deleteCookie = (name) => {
  console.log('🗑️ 쿠키 삭제:', name);
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// 디버깅용 함수들 - 브라우저 콘솔에서 사용 가능
export const debugCookies = () => {
  console.log('🔍 === 쿠키 디버깅 정보 ===');
  console.log('전체 쿠키:', document.cookie);
  console.log('RefreshToken:', getCookie('refreshToken'));
  console.log('현재 도메인:', window.location.hostname);
  console.log('현재 프로토콜:', window.location.protocol);
  console.log('로컬호스트 여부:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
};

// 전역에서 접근 가능하도록 설정 (개발용)
if (typeof window !== 'undefined') {
  window.debugCookies = debugCookies;
  window.getCookie = getCookie;
  window.setCookie = setCookie;
  window.deleteCookie = deleteCookie;
}