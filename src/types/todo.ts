export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string; // YYYY-MM-DD format or ISO string
  estimatedMinutes?: number;
  subtasks: SubTask[];
  pinned?: boolean;
  createdAt: string;
  completedAt?: string;
  tags: string[];
  status?: 'todo' | 'in-progress' | 'review' | 'done';
}

export type ViewMode = 'list' | 'kanban' | 'calendar' | 'analytics';

export type FilterOption = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed' | 'starred';

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';
