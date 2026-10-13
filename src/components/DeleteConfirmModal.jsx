import React, { useEffect } from 'react';
import { TrashIcon, AlertCircleIcon } from './Icons';

export const DeleteConfirmModal = ({
  isOpen,
  task,
  onClose,
  onConfirm
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container modal-container-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-content">
          <div className="delete-icon-wrapper">
            <AlertCircleIcon size={28} />
          </div>

          <h3 className="delete-modal-title">Delete Task?</h3>
          <p className="delete-modal-desc">
            Are you sure you want to delete{' '}
            <strong className="delete-task-name">"{task.title}"</strong>? This
            action cannot be undone.
          </p>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger-confirm"
              onClick={() => {
                onConfirm(task.id);
                onClose();
              }}
            >
              <TrashIcon size={15} />
              <span>Delete Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
