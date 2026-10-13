import React from 'react';
import {
  SortIcon,
  ListIcon,
  GridIcon,
  XIcon
} from './Icons';
import { CATEGORIES } from '../data/initialTasks';

export const TaskFilters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalTasks,
  filteredCount,
  onResetFilters
}) => {
  const isFiltered =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'All';

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'due_date_asc', label: 'Due Date (Earliest)' },
    { value: 'due_date_desc', label: 'Due Date (Latest)' },
    { value: 'priority_high', label: 'Priority (High to Low)' },
    { value: 'title_asc', label: 'Title (A to Z)' },
    { value: 'newest', label: 'Recently Added' }
  ];

  return (
    <div className="task-filters-bar">
      <div className="filters-left">
        {/* Status Filter Dropdown / Pills */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="status-select">
            Status:
          </label>
          <div className="select-wrapper">
            <select
              id="status-select"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="priority-select">
            Priority:
          </label>
          <div className="select-wrapper">
            <select
              id="priority-select"
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="category-select">
            Category:
          </label>
          <div className="select-wrapper">
            <select
              id="category-select"
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters Pill */}
        {isFiltered && (
          <button
            className="btn-clear-filters"
            onClick={onResetFilters}
            title="Reset all filters to default"
          >
            <XIcon size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="filters-right">
        {/* Sort Dropdown */}
        <div className="sort-group">
          <SortIcon size={16} className="text-muted" />
          <div className="select-wrapper">
            <select
              className="filter-select select-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks by"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle" role="group" aria-label="View layout">
          <button
            className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
            aria-label="List view"
          >
            <ListIcon size={17} />
          </button>
          <button
            className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid / Card view"
            aria-label="Grid view"
          >
            <GridIcon size={17} />
          </button>
        </div>

        {/* Match Count Badge */}
        <span className="results-count">
          Showing <strong>{filteredCount}</strong> of {totalTasks}
        </span>
      </div>
    </div>
  );
};
