import React, { useEffect } from 'react';
import { CheckCircleIcon, AlertCircleIcon, XIcon } from './Icons';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type !== 'error';

  return (
    <div className={`toast-notification toast-${toast.type || 'success'}`}>
      <div className="toast-icon">
        {isSuccess ? (
          <CheckCircleIcon size={18} />
        ) : (
          <AlertCircleIcon size={18} />
        )}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
};
