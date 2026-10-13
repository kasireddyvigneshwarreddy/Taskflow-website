import React from 'react';
import {
  EditIcon,
  TrashIcon,
  CalendarIcon,
  CheckIcon,
  FireIcon
} from './Icons';
import { getDueBadgeInfo } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../data/initialTasks';

export const TaskItem = ({
  task,
  viewMode,
  onToggleStatus,
  onChangeStatus,
  onEdit,
  onDelete
}) => {
  const isCompleted = task.status === 'completed';
  const dueInfo = getDueBadgeInfo(task.dueDate, task.status);
  const categoryStyle = CATEGORY_COLORS[task.category] || {
    bg: 'rgba(99, 102, 241, 0.12)',
    text: 'var(--primary)',
    border: 'rgba(99, 102, 241, 0.25)'
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="priority-badge priority-high" title="High Priority">
            <FireIcon size={13} />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="priority-badge priority-medium" title="Medium Priority">
            <span>Med</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="priority-badge priority-low" title="Low Priority">
            <span>Low</span>
          </span>
        );
    }
  };

  if (viewMode === 'grid') {
    return (
      <div
        className={`task-card-grid priority-border-${task.priority} ${
          isCompleted ? 'task-completed-state' : ''
        }`}
      >
        <div className="task-card-header">
          <div className="task-card-tags">
            <span
              className="task-category-pill"
              style={{
                backgroundColor: categoryStyle.bg,
                color: categoryStyle.text,
                borderColor: categoryStyle.border
              }}
            >
              {task.category || 'General'}
            </span>
            {getPriorityBadge(task.priority)}
          </div>

          <div className="task-actions-group">
            <button
              className="btn-icon-action btn-edit"
              onClick={() => onEdit(task)}
              title="Edit task"
              aria-label="Edit task"
            >
              <EditIcon size={15} />
            </button>
            <button
              className="btn-icon-action btn-delete"
              onClick={() => onDelete(task)}
              title="Delete task"
              aria-label="Delete task"
            >
              <TrashIcon size={15} />
            </button>
          </div>
        </div>

        <div className="task-card-body">
          <div className="task-title-row">
            <button
              type="button"
              className={`custom-checkbox ${isCompleted ? 'checkbox-checked' : ''}`}
              onClick={() => onToggleStatus(task.id)}
              aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
            >
              {isCompleted && <CheckIcon size={13} />}
            </button>
            <h3 className={`task-title ${isCompleted ? 'title-completed' : ''}`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>

        <div className="task-card-footer">
          <div className="task-due-date-wrapper">
            <CalendarIcon size={14} className="text-muted" />
            <span className={`due-date-badge ${dueInfo.className}`}>
              {dueInfo.label}
            </span>
          </div>

          <div className="status-selector-wrapper">
            <select
              className={`status-select-pill status-${task.status}`}
              value={task.status}
              onChange={(e) => onChangeStatus(task.id, e.target.value)}
              aria-label="Change status"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // List View (Row)
  return (
    <div
      className={`task-row-item ${isCompleted ? 'task-completed-state' : ''}`}
    >
      <div className="task-row-check">
        <button
          type="button"
          className={`custom-checkbox ${isCompleted ? 'checkbox-checked' : ''}`}
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && <CheckIcon size={13} />}
        </button>
      </div>

      <div className="task-row-content">
        <div className="task-title-group">
          <h3 className={`task-title ${isCompleted ? 'title-completed' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-description-compact">{task.description}</p>
          )}
        </div>
      </div>

      <div className="task-row-meta">
        {/* Category */}
        <div className="task-row-col category-col">
          <span
            className="task-category-pill"
            style={{
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.text,
              borderColor: categoryStyle.border
            }}
          >
            {task.category || 'General'}
          </span>
        </div>

        {/* Priority */}
        <div className="task-row-col priority-col">
          {getPriorityBadge(task.priority)}
        </div>

        {/* Due Date */}
        <div className="task-row-col due-col">
          <div className="due-date-inline">
            <CalendarIcon size={14} className="text-muted" />
            <span className={`due-date-badge ${dueInfo.className}`}>
              {dueInfo.label}
            </span>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="task-row-col status-col">
          <select
            className={`status-select-pill status-${task.status}`}
            value={task.status}
            onChange={(e) => onChangeStatus(task.id, e.target.value)}
            aria-label="Change status"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="task-row-col actions-col">
          <button
            className="btn-icon-action btn-edit"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <EditIcon size={15} />
          </button>
          <button
            className="btn-icon-action btn-delete"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label="Delete task"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
