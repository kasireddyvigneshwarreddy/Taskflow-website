// Realistic initial sample tasks for TaskFlow

export const generateSampleTasks = () => {
  const getOffsetDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [
    {
      id: 'task-1',
      title: 'Finalize Q4 Product Roadmap & Feature Specs',
      description: 'Collaborate with the engineering and UX leads to freeze key deliverables and milestone estimates.',
      category: 'Work',
      priority: 'high',
      status: 'in_progress',
      dueDate: getOffsetDate(0), // Due today
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'task-2',
      title: 'Redesign Customer Onboarding Flow in Figma',
      description: 'Create interactive high-fidelity prototypes incorporating user feedback from usability testing.',
      category: 'Design',
      priority: 'high',
      status: 'pending',
      dueDate: getOffsetDate(-2), // Overdue by 2 days
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'task-3',
      title: 'Optimize Database Query Indexes & API Caching',
      description: 'Audit slow query logs on PostgreSQL and configure Redis cache layer for analytics queries.',
      category: 'Development',
      priority: 'medium',
      status: 'in_progress',
      dueDate: getOffsetDate(1), // Due tomorrow
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'task-4',
      title: 'Prepare Monthly Financial & Budget Variance Report',
      description: 'Aggregate team SaaS subscriptions, cloud hosting costs, and project contractor expenses.',
      category: 'Finance',
      priority: 'medium',
      status: 'pending',
      dueDate: getOffsetDate(4), // Future
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'task-5',
      title: 'Quarterly Security Audit & Dependency Upgrades',
      description: 'Run npm audit checks, rotate production API keys, and update OAuth scopes.',
      category: 'Development',
      priority: 'high',
      status: 'completed',
      dueDate: getOffsetDate(-1), // Completed
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: 'task-6',
      title: 'Schedule Health Checkup & Annual Dental Cleaning',
      description: 'Book morning appointment at City Health Clinic and update insurance verification.',
      category: 'Personal',
      priority: 'low',
      status: 'pending',
      dueDate: getOffsetDate(7), // Future
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'task-7',
      title: 'Draft Product Launch Announcement & Press Release',
      description: 'Write engaging launch copy highlighting new collaboration features for TechCrunch & Blog.',
      category: 'Marketing',
      priority: 'medium',
      status: 'completed',
      dueDate: getOffsetDate(-3), // Completed
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ];
};

export const CATEGORIES = [
  'Work',
  'Design',
  'Development',
  'Marketing',
  'Finance',
  'Personal'
];

export const CATEGORY_COLORS = {
  Work: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.25)' },
  Design: { bg: 'rgba(168, 85, 247, 0.12)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.25)' },
  Development: { bg: 'rgba(6, 182, 212, 0.12)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.25)' },
  Marketing: { bg: 'rgba(236, 72, 153, 0.12)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' },
  Finance: { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' },
  Personal: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981', border: 'rgba(16, 185, 129, 0.25)' }
};
