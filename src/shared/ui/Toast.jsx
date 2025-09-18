import React, { useEffect, useState } from 'react';

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
        }, 300); // Transition duration
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onClose]);

  const baseStyles = 'flex items-center gap-3 w-full max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out pointer-events-auto text-sm font-medium';
  const positionStyles = 'transform translate-x-full sm:translate-x-0 sm:translate-y-[-100%]';
  const showStyles = 'transform translate-x-0 sm:translate-y-0';

  const variantStyles = {
    success: 'bg-green-500/95 text-white border-l-4 border-green-700',
    error: 'bg-red-500/95 text-white border-l-4 border-red-700',
    warning: 'bg-yellow-500/95 text-white border-l-4 border-yellow-700',
    info: 'bg-blue-500/95 text-white border-l-4 border-blue-700',
  };

  const classes = [
    baseStyles,
    variantStyles[type],
    show ? showStyles : positionStyles,
  ].filter(Boolean).join(' ');

  const icons = {
    success: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    error: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
    warning: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>,
    info: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };

  if (!isVisible) return null;

  return (
    <div className={classes}>
      {icons[type]}
      <span className="flex-1 leading-snug">{message}</span>
      <button
        className="p-1 -mr-1 rounded-md opacity-70 transition-opacity duration-200 hover:opacity-100 hover:bg-white/10"
        onClick={() => {
          setShow(false);
          setTimeout(() => onClose && onClose(), 300);
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none sm:left-6 sm:right-auto sm:items-stretch">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
        />
      ))}
    </div>
  );
};

export default Toast;