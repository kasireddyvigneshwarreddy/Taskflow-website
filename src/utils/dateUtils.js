// Date utilities for TaskFlow

export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const today = getTodayString();
  return dueDate < today;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'No due date';
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return dateStr;
  }
};

export const getDueBadgeInfo = (dueDate, status) => {
  if (status === 'completed') {
    return {
      type: 'completed',
      label: 'Completed',
      className: 'badge-due-completed'
    };
  }

  if (!dueDate) {
    return {
      type: 'none',
      label: 'No date',
      className: 'badge-due-none'
    };
  }

  const today = getTodayString();
  if (dueDate < today) {
    // calculate days overdue
    const [tYear, tMonth, tDay] = today.split('-').map(Number);
    const [dYear, dMonth, dDay] = dueDate.split('-').map(Number);
    const diffTime = Math.abs(new Date(tYear, tMonth - 1, tDay) - new Date(dYear, dMonth - 1, dDay));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      type: 'overdue',
      label: diffDays === 1 ? '1 day overdue' : `${diffDays} days overdue`,
      className: 'badge-due-overdue'
    };
  }

  if (dueDate === today) {
    return {
      type: 'today',
      label: 'Due today',
      className: 'badge-due-today'
    };
  }

  const tomorrow = getTomorrowString();
  if (dueDate === tomorrow) {
    return {
      type: 'tomorrow',
      label: 'Due tomorrow',
      className: 'badge-due-tomorrow'
    };
  }

  return {
    type: 'future',
    label: formatDisplayDate(dueDate),
    className: 'badge-due-future'
  };
};
