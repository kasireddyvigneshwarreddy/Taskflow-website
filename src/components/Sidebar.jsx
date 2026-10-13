import React, { useMemo } from 'react';
import {
  LayersIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  FireIcon,
  CalendarIcon,
  TagIcon,
  RefreshIcon,
  XIcon
} from './Icons';
import { isOverdue, getTodayString } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../data/initialTasks';

export const Sidebar = ({
  tasks,
  activeNav,
  setActiveNav,
  selectedCategory,
  setSelectedCategory,
  isOpen,
  onClose,
  onResetData
}) => {
  const todayStr = useMemo(() => getTodayString(), []);

  // Calculate navigational counts
  const totalCount = tasks.length;
  const todayCount = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== 'completed'
  ).length;
  const upcomingCount = tasks.filter(
    (t) => t.dueDate > todayStr && t.status !== 'completed'
  ).length;
  const highPriorityCount = tasks.filter(
    (t) => t.priority === 'high' && t.status !== 'completed'
  ).length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  const categories = ['All', 'Work', 'Design', 'Development', 'Marketing', 'Finance', 'Personal'];

  const getCategoryCount = (cat) => {
    if (cat === 'All') return tasks.length;
    return tasks.filter((t) => t.category === cat).length;
  };

  const navItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: <LayersIcon size={18} />,
      count: totalCount
    },
    {
      id: 'today',
      label: 'Due Today',
      icon: <ClockIcon size={18} />,
      count: todayCount,
      highlight: todayCount > 0 ? 'amber' : null
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <CalendarIcon size={18} />,
      count: upcomingCount
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: <AlertCircleIcon size={18} />,
      count: overdueCount,
      highlight: overdueCount > 0 ? 'rose' : null
    },
    {
      id: 'high',
      label: 'High Priority',
      icon: <FireIcon size={18} />,
      count: highPriorityCount
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircleIcon size={18} />,
      count: completedCount
    }
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <div className="brand-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  fill="url(#brandGradient)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="brandGradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">TaskFlow</span>
              <span className="brand-badge">PRO</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Main Navigation Views */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Views</span>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-label">{item.label}</span>
                  <span
                    className={`nav-item-count ${
                      item.highlight ? `count-${item.highlight}` : ''
                    } ${isActive ? 'count-active' : ''}`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories / Projects Filter */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="sidebar-section-title">Categories</span>
            <TagIcon size={14} className="text-muted" />
          </div>
          <div className="category-list">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const colorInfo = CATEGORY_COLORS[cat];
              const count = getCategoryCount(cat);

              return (
                <button
                  key={cat}
                  className={`category-item ${isActive ? 'category-item-active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <span
                    className="category-dot"
                    style={{
                      backgroundColor: colorInfo ? colorInfo.text : 'var(--text-muted)'
                    }}
                  />
                  <span className="category-label">{cat}</span>
                  <span className="category-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset / Demo Data */}
        <div className="sidebar-footer">
          <button
            className="btn-reset-demo"
            onClick={onResetData}
            title="Reset to default sample tasks"
          >
            <RefreshIcon size={14} />
            <span>Reset Demo Tasks</span>
          </button>

          {/* User Profile Info */}
          <div className="user-profile-card">
            <div className="user-avatar">
              <span>TF</span>
            </div>
            <div className="user-info">
              <span className="user-name">Local Workspace</span>
              <span className="user-status">Auto-saved to Storage</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
