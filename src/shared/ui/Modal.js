import React, { useEffect } from 'react';
import { clsx } from '../lib';

/**
 * 공용 모달 컴포넌트
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  ...props
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const backdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto"
      onClick={backdropClick}
    >
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* 모달 콘텐츠 */}
      <div
        className={clsx(
          'relative w-full bg-white rounded-lg shadow-xl',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* 바디 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;