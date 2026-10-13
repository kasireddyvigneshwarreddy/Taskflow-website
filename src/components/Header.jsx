import React, { useRef, useEffect, useState } from 'react';
import {
  SearchIcon,
  PlusIcon,
  MenuIcon,
  SunIcon,
  MoonIcon,
  XIcon
} from './Icons';

export const Header = ({
  searchQuery,
  setSearchQuery,
  onOpenAddTask,
  onToggleSidebar,
  theme,
  onToggleTheme
}) => {
  const searchInputRef = useRef(null);

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [todayDisplay] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  });

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn-hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon size={22} />
        </button>

        <div className="header-greeting">
          <h1 className="header-title">TaskFlow Dashboard</h1>
          <p className="header-subtitle">
            <span className="header-date">{todayDisplay}</span>
            <span className="header-dot">•</span>
            <span>Organize, execute & achieve</span>
          </p>
        </div>
      </div>

      <div className="header-center">
        <div className="search-box">
          <SearchIcon size={18} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search tasks, categories, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <XIcon size={14} />
            </button>
          ) : (
            <kbd className="search-shortcut" title="Press Ctrl+K to search">
              Ctrl K
            </kbd>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button
          className="btn-theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon size={19} /> : <MoonIcon size={19} />}
        </button>

        {/* Add Task Primary Action */}
        <button
          className="btn-add-task-header"
          onClick={onOpenAddTask}
          id="btn-add-task-header"
        >
          <PlusIcon size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
