/**
 * shared/lib 모듈의 메인 export 파일
 */

export * as cookieUtils from './cookieUtils';
export { default as tokenUtils } from './tokenUtils';
export { default as utils } from './utils';
export * as scrollUtils from './scrollUtils';

// 주요 함수들을 바로 export
export { debounce, throttle, numberFormat, formatDate, clsx, storage, truncateText } from './utils';
export { getScrollInfo, canScrollToBottom, scrollToBottom, scrollToTop, debugScrollInfo } from './scrollUtils';