/**
 * 공용 유틸리티 함수들
 */

// 디바운스 함수
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 쓰로틀 함수
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 숫자 포맷팅 함수
export const numberFormat = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('ko-KR').format(num);
};

// 날짜 포맷팅 함수
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'MM-DD':
      return `${month}-${day}`;
    case 'relative':
      return formatRelativeTime(d);
    default:
      return d.toLocaleDateString('ko-KR');
  }
};

// 상대 시간 포맷팅 (예: "2분 전", "3시간 전")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

// 문자열 자르기 (말줄임표 추가)
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 객체 깊은 복사
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 배열을 청크로 나누기
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// 배열에서 중복 제거
export const unique = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// 객체에서 falsy 값 제거
export const compact = (obj) => {
  const result = {};
  for (const key in obj) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return result;
};

// 쿼리 파라미터 문자열 생성
export const buildQueryString = (params) => {
  const cleanParams = compact(params);
  const searchParams = new URLSearchParams();
  
  for (const key in cleanParams) {
    const value = cleanParams[key];
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v));
    } else {
      searchParams.append(key, value);
    }
  }
  
  return searchParams.toString();
};

// URL에서 쿼리 파라미터 파싱
export const parseQueryString = (search = window.location.search) => {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

// 로컬 스토리지 헬퍼
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('LocalStorage remove error:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('LocalStorage clear error:', error);
      return false;
    }
  }
};

// 클래스명 조합 유틸리티 (clsx 대용)
export const clsx = (...classes) => {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 랜덤 ID 생성
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
};

// 아이템 상태별 색상 반환
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#ff6b6b';
    case 'review': return '#ffa726';
    case 'revision': return '#ef5350';
    case 'draft': return '#42a5f5';
    default: return '#8370FE';
  }
};

// 아이템 상태별 텍스트 반환
export const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '승인 대기';
    case 'review': return '검토 중';
    case 'revision': return '수정 요청';
    case 'draft': return '초안';
    case 'generating': return 'AI 생성 중';
    default: return '대기';
  }
};

// 작업 상태별 텍스트 반환
export const getWorkStatusText = (workStatus) => {
  switch (workStatus) {
    case 'generating': return '🤖 생성 중';
    case 'revision_requested': return '✏️ 수정 중';
    default: return '🔄 작업 중';
  }
};

// 작업 상태별 색상 반환
export const getWorkStatusColor = (workStatus) => {
  switch (workStatus) {
    case 'generating': return '#17a2b8';
    case 'revision_requested': return '#fd7e14';
    default: return '#6c757d';
  }
};

export default {
  debounce,
  throttle,
  numberFormat,
  formatDate,
  formatRelativeTime,
  truncateText,
  deepClone,
  chunk,
  unique,
  compact,
  buildQueryString,
  parseQueryString,
  storage,
  clsx,
  formatFileSize,
  generateId,
};