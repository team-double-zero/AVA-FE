import React, { useEffect } from 'react';
import './Modal.css';

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

  const modalClasses = [
    'modal',
    `modal-${size}`,
    className
  ].filter(Boolean).join(' ');

  const backdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={backdropClick}
    >
      {/* 배경 오버레이 */}
      <div className="modal-backdrop" />

      {/* 모달 콘텐츠 */}
      <div
        className={modalClasses}
        {...props}
      >
        {/* 헤더 */}
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              onClick={onClose}
              className="modal-close-button"
            >
              <svg className="modal-close-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* 바디 */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;