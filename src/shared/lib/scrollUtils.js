/**
 * 스크롤 관련 유틸리티 함수들
 */

/**
 * 스크롤 가능한 요소의 스크롤 정보를 계산
 * @param {HTMLElement} element - 스크롤 요소
 * @returns {Object} 스크롤 정보 객체
 */
export const getScrollInfo = (element) => {
  if (!element) return null;

  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  const scrollBottom = scrollHeight - clientHeight - scrollTop;
  
  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    scrollBottom,
    isAtTop: scrollTop === 0,
    isAtBottom: scrollBottom <= 1, // 1px 허용오차
    scrollPercentage: (scrollTop / (scrollHeight - clientHeight)) * 100
  };
};

/**
 * 스크롤이 끝까지 가능한지 확인
 * @param {HTMLElement} element - 스크롤 요소
 * @returns {boolean} 스크롤 가능 여부
 */
export const canScrollToBottom = (element) => {
  if (!element) return false;
  
  const scrollInfo = getScrollInfo(element);
  return scrollInfo && scrollInfo.scrollHeight > scrollInfo.clientHeight;
};

/**
 * 스크롤을 맨 아래로 이동
 * @param {HTMLElement} element - 스크롤 요소
 * @param {Object} options - 스크롤 옵션
 */
export const scrollToBottom = (element, options = { behavior: 'smooth' }) => {
  if (!element) return;
  
  element.scrollTo({
    top: element.scrollHeight,
    ...options
  });
};

/**
 * 스크롤을 맨 위로 이동
 * @param {HTMLElement} element - 스크롤 요소
 * @param {Object} options - 스크롤 옵션
 */
export const scrollToTop = (element, options = { behavior: 'smooth' }) => {
  if (!element) return;
  
  element.scrollTo({
    top: 0,
    ...options
  });
};

/**
 * 스크롤 디버깅 정보를 콘솔에 출력
 * @param {HTMLElement} element - 스크롤 요소
 * @param {string} label - 디버그 라벨
 */
export const debugScrollInfo = (element, label = 'Scroll Debug') => {
  if (!element) {
    console.log(`${label}: Element not found`);
    return;
  }
  
  const info = getScrollInfo(element);
  console.log(`${label}:`, {
    ...info,
    canScroll: canScrollToBottom(element),
    elementRect: element.getBoundingClientRect(),
    computedStyle: {
      height: getComputedStyle(element).height,
      maxHeight: getComputedStyle(element).maxHeight,
      overflow: getComputedStyle(element).overflow,
      overflowY: getComputedStyle(element).overflowY
    }
  });
};

