import React from 'react';
import {
  LayersIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon
} from './Icons';
import { isOverdue } from '../utils/dateUtils';

export const StatCards = ({ tasks, statusFilter, setStatusFilter }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingOnly = tasks.filter((t) => t.status === 'pending').length;
  const pendingTotal = pendingOnly + inProgress;
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: total,
      subtext: total === 1 ? '1 active item' : `${total} active items`,
      icon: <LayersIcon size={22} />,
      theme: 'blue',
      filterTarget: 'all'
    },
    {
      id: 'completed',
      title: 'Completed',
      value: completed,
      subtext: `${completionRate}% completion rate`,
      icon: <CheckCircleIcon size={22} />,
      theme: 'emerald',
      filterTarget: 'completed',
      progress: completionRate
    },
    {
      id: 'pending',
      title: 'Pending',
      value: pendingTotal,
      subtext: `${inProgress} in progress · ${pendingOnly} queued`,
      icon: <ClockIcon size={22} />,
      theme: 'amber',
      filterTarget: 'pending'
    },
    {
      id: 'overdue',
      title: 'Overdue',
      value: overdue,
      subtext: overdue > 0 ? 'Requires attention' : 'All caught up 🎉',
      icon: <AlertCircleIcon size={22} />,
      theme: 'rose',
      filterTarget: 'overdue',
      isWarning: overdue > 0
    }
  ];

  return (
    <div className="stat-cards-grid">
      {cards.map((card) => {
        const isActive =
          (card.filterTarget === 'all' && statusFilter === 'all') ||
          (card.filterTarget !== 'all' && statusFilter === card.filterTarget);

        return (
          <div
            key={card.id}
            className={`stat-card stat-card-${card.theme} ${
              isActive ? 'stat-card-active' : ''
            }`}
            onClick={() => setStatusFilter(card.filterTarget)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setStatusFilter(card.filterTarget);
              }
            }}
            title={`Click to filter by ${card.title}`}
          >
            <div className="stat-card-top">
              <span className="stat-card-title">{card.title}</span>
              <div className={`stat-card-icon-wrapper icon-${card.theme}`}>
                {card.icon}
              </div>
            </div>

            <div className="stat-card-middle">
              <span className="stat-card-value">{card.value}</span>
              {card.isWarning && (
                <span className="stat-card-badge-urgent">Action Needed</span>
              )}
            </div>

            <div className="stat-card-bottom">
              <span className="stat-card-subtext">{card.subtext}</span>
            </div>

            {typeof card.progress === 'number' && (
              <div className="stat-progress-bar-bg">
                <div
                  className="stat-progress-bar-fill"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
