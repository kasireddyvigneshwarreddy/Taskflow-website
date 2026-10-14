import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { PlusIcon } from './components/Icons';
import { generateSampleTasks } from './data/initialTasks';
import { isOverdue, getTodayString } from './utils/dateUtils';
import Login from './login';

const STORAGE_KEY = 'taskflow_tasks_v1';
const THEME_KEY = 'taskflow_theme';
const VIEW_KEY = 'taskflow_view_mode';

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Apply theme attribute to html/root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Tasks state from localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to parse saved tasks:', err);
    }
    // Default initial seed
    const initial = generateSampleTasks();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  });

  // Persist tasks on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
    }
  }, [tasks]);

  // View & UI Navigation States
  const [activeNav, setActiveNav] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('due_date_asc');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(VIEW_KEY) || 'list';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist view mode
  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_KEY, mode);
  };

  // Modals & Notifications
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Reset demo tasks
  const handleResetData = () => {
    const freshTasks = generateSampleTasks();
    setTasks(freshTasks);
    showToast('Reset to demo sample tasks');
  };

  // Clear all filters
  const handleResetFilters = () => {
    setActiveNav('all');
    setSelectedCategory('All');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  // CRUD Actions
  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      // Editing existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...taskData } : t))
      );
      showToast('Task updated successfully');
    } else {
      // Adding new task
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('New task added successfully');
    }
    setTaskToEdit(null);
  };

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task deleted successfully');
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleChangeStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    const todayStr = getTodayString();

    return tasks
      .filter((task) => {
        // 1. Sidebar Nav filter
        if (activeNav === 'today') {
          if (task.dueDate !== todayStr || task.status === 'completed') return false;
        } else if (activeNav === 'upcoming') {
          if (!task.dueDate || task.dueDate <= todayStr || task.status === 'completed') return false;
        } else if (activeNav === 'overdue') {
          if (!isOverdue(task.dueDate, task.status)) return false;
        } else if (activeNav === 'high') {
          if (task.priority !== 'high' || task.status === 'completed') return false;
        } else if (activeNav === 'completed') {
          if (task.status !== 'completed') return false;
        }

        // 2. Category filter
        if (selectedCategory !== 'All' && task.category !== selectedCategory) {
          return false;
        }

        // 3. Status filter (from filter bar or stat card click)
        if (statusFilter !== 'all') {
          if (statusFilter === 'overdue') {
            if (!isOverdue(task.dueDate, task.status)) return false;
          } else if (task.status !== statusFilter) {
            return false;
          }
        }

        // 4. Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        // 5. Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = task.title?.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCat = task.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'due_date_asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'due_date_desc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        }
        if (sortBy === 'priority_high') {
          const rank = { high: 3, medium: 2, low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
      });
  }, [
    tasks,
    activeNav,
    selectedCategory,
    statusFilter,
    priorityFilter,
    searchQuery,
    sortBy
  ]);

  const isFiltered =
    activeNav !== 'all' ||
    selectedCategory !== 'All' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    searchQuery.trim() !== '';

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const completionPercentage =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        tasks={tasks}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onResetData={handleResetData}
      />

      <div className="app-main-wrapper">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddTask={handleOpenAddTask}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="dashboard-content">
          {/* Welcome Banner */}
          <div className="dashboard-welcome-banner">
            <div className="welcome-banner-text">
              <h2>Welcome to TaskFlow</h2>
              <p>
                Manage tasks effortlessly with real-time tracking, deadline alerts, and automatic local storage persistence.
              </p>
            </div>
            <div className="welcome-banner-actions">
              <div className="banner-progress-badge">
                <span className="progress-indicator-dot" />
                <span>{completionPercentage}% Tasks Finished</span>
              </div>
            </div>
          </div>

          {/* Summary Stat Cards */}
          <StatCards
            tasks={tasks}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Filtering and Toolbar */}
          <TaskFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            categoryFilter={selectedCategory}
            setCategoryFilter={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={handleSetViewMode}
            totalTasks={tasks.length}
            filteredCount={filteredTasks.length}
            onResetFilters={handleResetFilters}
          />

          {/* Task List / Grid Display */}
          <TaskList
            tasks={filteredTasks}
            viewMode={viewMode}
            onToggleStatus={handleToggleStatus}
            onChangeStatus={handleChangeStatus}
            onEdit={handleOpenEditTask}
            onDelete={handleOpenDeleteTask}
            onOpenAddTask={handleOpenAddTask}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
          />
        </main>
      </div>

      {/* Floating Add Button for Mobile */}
      <button
        className="mobile-fab"
        onClick={handleOpenAddTask}
        aria-label="Create new task"
      >
        <PlusIcon size={24} />
      </button>

      {/* Add / Edit Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          key={taskToEdit ? `edit-${taskToEdit.id}` : 'new-task'}
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
    
  );
}

export default App;
