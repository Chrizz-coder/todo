import React from 'react';
import { 
  Flame, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star, 
  Layers, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';
import type { Todo, FilterOption } from '../types/todo';

interface StatsHeaderProps {
  todos: Todo[];
  activeFilter: FilterOption;
  setActiveFilter: (filter: FilterOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  streak: number;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  todos,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  streak,
}) => {
  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = todos.filter((t) => t.dueDate === todayStr && !t.completed).length;
  const overdueCount = todos.filter((t) => t.dueDate && t.dueDate < todayStr && !t.completed).length;
  const starredCount = todos.filter((t) => t.pinned).length;

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Extract unique categories
  const categories = Array.from(new Set(todos.map((t) => t.category))).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Total Progress Card */}
        <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Progress</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{percentage}%</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '8px' }}>
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {completedCount} of {total} tasks completed
          </div>
        </div>

        {/* Streak Counter */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(249, 115, 22, 0.15)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Streak Daily Goal</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{streak} Days 🔥</div>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Due Today</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{todayCount} Pending</div>
          </div>
        </div>

        {/* Overdue Warning */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: overdueCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: overdueCount > 0 ? '#ef4444' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overdue Tasks</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{overdueCount} Items</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Quick Filters */}
      <div
        className="glass-card"
        style={{
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Instant Search Bar */}
        <div style={{ flex: '1 1 280px', maxWidth: '420px' }}>
          <div className="input-wrapper">
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="input-field"
              placeholder="Search tasks, descriptions or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setActiveFilter('all')}
          >
            <Layers size={14} /> All ({total})
          </button>
          <button
            className={`btn ${activeFilter === 'today' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setActiveFilter('today')}
          >
            <Clock size={14} /> Today ({todayCount})
          </button>
          <button
            className={`btn ${activeFilter === 'starred' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setActiveFilter('starred')}
          >
            <Star size={14} /> Starred ({starredCount})
          </button>
          <button
            className={`btn ${activeFilter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setActiveFilter('overdue')}
          >
            <AlertTriangle size={14} /> Overdue ({overdueCount})
          </button>
          <button
            className={`btn ${activeFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setActiveFilter('completed')}
          >
            <CheckCircle size={14} /> Done ({completedCount})
          </button>
        </div>

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '0.4rem 0.85rem 0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
