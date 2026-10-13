import React from 'react';
import { TaskItem } from './TaskItem';
import { PlusIcon, SearchIcon, RefreshIcon } from './Icons';

export const TaskList = ({
  tasks,
  viewMode,
  onToggleStatus,
  onChangeStatus,
  onEdit,
  onDelete,
  onOpenAddTask,
  onResetFilters,
  isFiltered
}) => {
  if (tasks.length === 0) {
    return (
      <div className="task-empty-state">
        <div className="empty-state-icon">
          {isFiltered ? <SearchIcon size={36} /> : <span className="empty-emoji">📋</span>}
        </div>
        <h3 className="empty-state-title">
          {isFiltered ? 'No matching tasks found' : 'No tasks in your workspace yet'}
        </h3>
        <p className="empty-state-desc">
          {isFiltered
            ? 'We couldn\'t find any tasks matching your current filters or search query. Try resetting filters or search criteria.'
            : 'Get organized by creating your first task or restore the sample project tasks.'}
        </p>

        <div className="empty-state-actions">
          {isFiltered && (
            <button className="btn-secondary" onClick={onResetFilters}>
              <RefreshIcon size={16} />
              <span>Reset Filters</span>
            </button>
          )}
          <button className="btn-primary" onClick={onOpenAddTask}>
            <PlusIcon size={16} />
            <span>Add New Task</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      {viewMode === 'list' ? (
        <div className="task-list-table">
          <div className="task-table-header">
            <span className="th-cell th-check">Status</span>
            <span className="th-cell th-title">Task Details</span>
            <span className="th-cell th-category">Category</span>
            <span className="th-cell th-priority">Priority</span>
            <span className="th-cell th-due">Due Date</span>
            <span className="th-cell th-status">Progress</span>
            <span className="th-cell th-actions">Actions</span>
          </div>

          <div className="task-table-body">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                viewMode="list"
                onToggleStatus={onToggleStatus}
                onChangeStatus={onChangeStatus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="task-grid-layout">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              viewMode="grid"
              onToggleStatus={onToggleStatus}
              onChangeStatus={onChangeStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
