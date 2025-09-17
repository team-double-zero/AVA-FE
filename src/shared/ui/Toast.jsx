import React, { useEffect, useState } from 'react';
import './Toast.css';

/**
 * 토스트 메시지 컴포넌트
 */
const Toast = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
  isVisible = false
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          onClose && onClose();
        }, 300); // CSS transition duration
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastClasses = [
    'toast',
    `toast-${type}`,
    show ? 'toast-show' : ''
  ].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="toast-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="toast-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="toast-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="toast-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={toastClasses}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => {
          setShow(false);
          setTimeout(() => {
            onClose && onClose();
          }, 300);
        }}
      >
        <svg className="toast-close-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

/**
 * 토스트 컨테이너 컴포넌트
 */
export const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={toast.onClose}
          isVisible={toast.isVisible}
        />
      ))}
    </div>
  );
};

export default Toast;
