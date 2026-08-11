import type { Todo } from '../types/todo';

const STORAGE_KEY = 'taskpulse_todos_v1';
const STREAK_KEY = 'taskpulse_streak_v1';

export const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    title: '🚀 Launch Product Architecture Review',
    description: 'Synthesize system design, evaluate Neo4j graph queries, and verify microservice API contracts for release candidate.',
    completed: false,
    priority: 'urgent',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    estimatedMinutes: 60,
    pinned: true,
    createdAt: new Date().toISOString(),
    status: 'in-progress',
    tags: ['Architecture', 'API', 'Release'],
    subtasks: [
      { id: '1-1', title: 'Audit API endpoint rate limits', completed: true },
      { id: '1-2', title: 'Review Database Indexing Strategy', completed: false },
      { id: '1-3', title: 'Prepare Architecture Diagram', completed: false },
    ],
  },
  {
    id: '2',
    title: '🎨 Design UI System & Micro-animations',
    description: 'Implement dark glassmorphism layout, vibrant HSL color palette, and springy interactive state transitions.',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0], // Today
    estimatedMinutes: 45,
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'in-progress',
    tags: ['UI/UX', 'CSS', 'Frontend'],
    subtasks: [
      { id: '2-1', title: 'Setup CSS color tokens', completed: true },
      { id: '2-2', title: 'Add dark/light theme switch', completed: true },
    ],
  },
  {
    id: '3',
    title: '🧘 Morning Wellness & HIIT Session',
    description: '30-minute high-intensity interval training followed by 10 minutes of mindfulness meditation.',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    priority: 'medium',
    category: 'Health',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 40,
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    status: 'done',
    tags: ['Fitness', 'Mindfulness'],
    subtasks: [
      { id: '3-1', title: 'Hydrate 500ml water', completed: true },
      { id: '3-2', title: 'Stretching & warm-up', completed: true },
      { id: '3-3', title: '20 min Cardio Circuit', completed: true },
    ],
  },
  {
    id: '4',
    title: '🛒 Weekly Fresh Meal Prep Grocery Shopping',
    description: 'Pick up organic produce, avocados, high-protein pantry staples, and fresh herbs for the week.',
    completed: false,
    priority: 'medium',
    category: 'Shopping',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    estimatedMinutes: 30,
    pinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'todo',
    tags: ['Groceries', 'Nutrition'],
    subtasks: [
      { id: '4-1', title: 'Spinach & Kale', completed: false },
      { id: '4-2', title: 'Greek Yogurt & Berries', completed: false },
      { id: '4-3', title: 'Almond milk & Oats', completed: false },
    ],
  },
  {
    id: '5',
    title: '📚 Read 2 Chapters of "Designing Data-Intensive Applications"',
    description: 'Focus on Consensus, Raft protocol, and Leaderless Replication models.',
    completed: false,
    priority: 'low',
    category: 'Learning',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    estimatedMinutes: 50,
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'todo',
    tags: ['SystemDesign', 'Books'],
    subtasks: [],
  },
  {
    id: '6',
    title: '💳 Monthly Financial Budget Audit',
    description: 'Review monthly subscriptions, investments allocation, and budget variance report.',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    priority: 'high',
    category: 'Finance',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    estimatedMinutes: 25,
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'done',
    tags: ['Finance', 'Audit'],
    subtasks: [
      { id: '6-1', title: 'Reconcile bank statement', completed: true },
      { id: '6-2', title: 'Update savings targets', completed: true },
    ],
  },
];

export const loadTodosFromStorage = (): Todo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_TODOS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TODOS;
  } catch (err) {
    console.error('Failed to load todos from localStorage:', err);
    return INITIAL_TODOS;
  }
};

export const saveTodosToStorage = (todos: Todo[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error('Failed to save todos to localStorage:', err);
  }
};

export const loadStreakFromStorage = (): { currentStreak: number; lastCompletedDate: string | null } => {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (!data) return { currentStreak: 3, lastCompletedDate: new Date().toISOString().split('T')[0] };
    return JSON.parse(data);
  } catch {
    return { currentStreak: 3, lastCompletedDate: new Date().toISOString().split('T')[0] };
  }
};

export const saveStreakToStorage = (streakData: { currentStreak: number; lastCompletedDate: string | null }) => {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  } catch (err) {
    console.error('Failed to save streak:', err);
  }
};

export const exportTodosJSON = (todos: Todo[]) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(todos, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `taskpulse_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
