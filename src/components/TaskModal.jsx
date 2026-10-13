import React, { useState, useEffect, useRef } from 'react';
import {
  XIcon,
  PlusIcon,
  EditIcon,
  CalendarIcon,
  FireIcon
} from './Icons';
import { CATEGORIES } from '../data/initialTasks';
import { getTodayString } from '../utils/dateUtils';

export const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit
}) => {
  const isEditing = Boolean(taskToEdit);
  const titleInputRef = useRef(null);

  const [formData, setFormData] = useState(() => ({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    category: taskToEdit?.category || 'Work',
    priority: taskToEdit?.priority || 'medium',
    status: taskToEdit?.status || 'pending',
    dueDate: taskToEdit?.dueDate || getTodayString()
  }));

  const [errors, setErrors] = useState({});

  // Auto-focus title on mount
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const setOffsetDueDate = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    handleChange('dueDate', `${year}-${month}-${day}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      titleInputRef.current?.focus();
      return;
    }

    onSave({
      ...(taskToEdit ? { id: taskToEdit.id, createdAt: taskToEdit.createdAt } : {}),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-icon-badge">
              {isEditing ? <EditIcon size={20} /> : <PlusIcon size={20} />}
            </div>
            <div>
              <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
              <p className="modal-subtitle">
                {isEditing
                  ? 'Update your task details and deadline'
                  : 'Add a new task to your workspace queue'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title-input">
              Task Title <span className="text-required">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="task-title-input"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Conduct usability testing on prototype"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              maxLength={120}
              
            />
            <div className="character-count">
             {formData.title.length}/120 characters
            </div>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc-input">
              Description <span className="text-optional">(Optional)</span>
            </label>
            <textarea
              id="task-desc-input"
              className="form-textarea"
              rows={3}
              placeholder="Add key notes, links, or specific acceptance criteria..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={400}
            />
          </div>

          {/* Category & Status Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="task-cat-select">
                Category
              </label>
              <select
                id="task-cat-select"
                className="form-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-status-select">
                Initial Status
              </label>
              <select
                id="task-status-select"
                className="form-select"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Priority Selection */}
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div className="priority-button-group">
              {[
                { id: 'low', label: 'Low', desc: 'Can wait' },
                { id: 'medium', label: 'Medium', desc: 'Standard' },
                { id: 'high', label: 'High', desc: 'Urgent attention', icon: <FireIcon size={14} /> }
              ].map((p) => {
                const isSelected = formData.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`priority-select-btn priority-btn-${p.id} ${
                      isSelected ? 'priority-btn-selected' : ''
                    }`}
                    onClick={() => handleChange('priority', p.id)}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date & Quick Date Shortcuts */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-due-input">
              Due Date
            </label>
            <div className="date-input-wrapper">
              <CalendarIcon size={16} className="date-input-icon" />
              <input
                id="task-due-input"
                type="date"
                className="form-input date-picker-input"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
            <div className="quick-date-chips">
              <button
                type="button"
                className="date-chip"
                onClick={() => setOffsetDueDate(0)}
              >
                Today
              </button>
              <button
                type="button"
                className="date-chip"
                onClick={() => setOffsetDueDate(1)}
              >
                Tomorrow
              </button>
              <button
                type="button"
                className="date-chip"
                onClick={() => setOffsetDueDate(3)}
              >
                +3 Days
              </button>
              <button
                type="button"
                className="date-chip"
                onClick={() => setOffsetDueDate(7)}
              >
                +1 Week
              </button>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
