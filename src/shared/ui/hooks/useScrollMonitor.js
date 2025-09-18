import { useState, useEffect, useRef, useCallback } from 'react';
import { getScrollInfo, debugScrollInfo } from '../../lib/scrollUtils';

/**
 * 스크롤 위치와 동작을 모니터링하는 훅
 * @param {Object} options - 옵션
 * @param {boolean} options.debug - 디버그 모드
 * @param {number} options.throttle - 스크롤 이벤트 쓰로틀링 시간 (ms)
 * @returns {Object} 스크롤 관련 상태와 함수들
 */
export const useScrollMonitor = (options = {}) => {
  const { debug = false, throttle = 100 } = options;
  const scrollRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState(null);
  const throttleRef = useRef(null);

  // 스크롤 정보 업데이트
  const updateScrollInfo = useCallback(() => {
    if (scrollRef.current) {
      const info = getScrollInfo(scrollRef.current);
      setScrollInfo(info);
      
      if (debug) {
        debugScrollInfo(scrollRef.current, 'Scroll Monitor');
      }
    }
  }, [debug]);

  // 쓰로틀링된 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }
    
    throttleRef.current = setTimeout(updateScrollInfo, throttle);
  }, [updateScrollInfo, throttle]);

  // 스크롤 요소가 변경될 때 이벤트 리스너 재설정
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // 초기 스크롤 정보 설정
    updateScrollInfo();

    // 스크롤 이벤트 리스너 추가
    element.addEventListener('scroll', handleScroll, { passive: true });

    // ResizeObserver로 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      updateScrollInfo();
    });
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handleScroll, updateScrollInfo]);

  // 스크롤 함수들
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToPosition = useCallback((position, behavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: position,
        behavior
      });
    }
  }, []);

  return {
    scrollRef,
    scrollInfo,
    scrollToBottom,
    scrollToTop,
    scrollToPosition,
    updateScrollInfo
  };
};

