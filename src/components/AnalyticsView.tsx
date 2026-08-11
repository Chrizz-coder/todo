import React from 'react';
import type { Todo } from '../types/todo';
import { 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  Zap, 
  Award 
} from 'lucide-react';

interface AnalyticsViewProps {
  todos: Todo[];
  streak: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ todos, streak }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const completedEstTime = todos
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  // Priority Breakdown
  const priorities = ['urgent', 'high', 'medium', 'low'] as const;
  const priorityCounts = priorities.map((p) => ({
    priority: p,
    count: todos.filter((t) => t.priority === p).length,
    completed: todos.filter((t) => t.priority === p && t.completed).length,
  }));

  // Category Breakdown
  const categoriesMap: Record<string, { total: number; completed: number }> = {};
  todos.forEach((t) => {
    const cat = t.category || 'Uncategorized';
    if (!categoriesMap[cat]) categoriesMap[cat] = { total: 0, completed: 0 };
    categoriesMap[cat].total += 1;
    if (t.completed) categoriesMap[cat].completed += 1;
  });

  const categoryEntries = Object.entries(categoriesMap);

  // Productivity Score Calculation (0 to 100)
  const productivityScore = Math.min(
    100,
    Math.round(completionRate * 0.6 + Math.min(streak * 10, 30) + (completed > 0 ? 10 : 0))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Productivity Score */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Zap size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Productivity Score</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{productivityScore}/100</div>
          </div>
        </div>

        {/* Total Tasks Done */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tasks Completed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {completed} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {total}</span>
            </div>
          </div>
        </div>

        {/* Time Saved / Focused */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Focused Time Done</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {Math.round(completedEstTime / 60 * 10) / 10} hrs
            </div>
          </div>
        </div>

        {/* Streak Mastery */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(249, 115, 22, 0.15)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Streak</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{streak} Days</div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Priority Distribution & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Priority Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart2 size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Priority Distribution</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {priorityCounts.map(({ priority, count, completed: comp }) => {
              const itemRatio = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={priority}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span className={`badge badge-${priority}`}>{priority}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {comp}/{count} done ({Math.round(itemRatio)}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${itemRatio}%`,
                        background:
                          priority === 'urgent'
                            ? '#ef4444'
                            : priority === 'high'
                            ? '#f97316'
                            : priority === 'medium'
                            ? '#3b82f6'
                            : '#10b981',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Completion Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Performance</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryEntries.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No category data yet.</div>
            ) : (
              categoryEntries.map(([cat, stats]) => {
                const catRatio = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {stats.completed}/{stats.total} ({Math.round(catRatio)}%)
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${catRatio}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
