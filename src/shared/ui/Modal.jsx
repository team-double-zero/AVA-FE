import React, { useEffect } from 'react';

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
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

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

  const sizeStyles = {
    small: 'max-w-2xl',
    medium: 'max-w-3xl',
    large: 'max-w-5xl',
    xlarge: 'max-w-7xl',
    full: 'max-w-full mx-4',
  };

  const modalClasses = [
    'relative w-full bg-[rgba(255,255,255,0.85)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] rounded-2xl shadow-2xl overflow-hidden',
    sizeStyles[size],
    className
  ].filter(Boolean).join(' ');

  const backdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto"
      onClick={backdropClick}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md" />
      <div className={modalClasses} {...props}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/10">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400/80 bg-white/10 backdrop-blur-lg transition-all duration-300 hover:text-gray-600/90 hover:bg-white/20 hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
