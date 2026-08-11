import React from 'react';
import type { Todo } from '../types/todo';
import { TaskItem } from './TaskItem';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface CalendarViewProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDuplicate: (todo: Todo) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onAddSubtask: (todoId: string, title: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  todos,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask,
  onAddSubtask,
}) => {
  // Generate next 7 days starting from today
  const days: { dateStr: string; label: string; isToday: boolean }[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    days.push({
      dateStr,
      label: isToday ? `Today (${dayName}, ${monthDay})` : `${dayName}, ${monthDay}`,
      isToday,
    });
  }

  // Also group unscheduled (no due date) and overdue tasks
  const todayStr = today.toISOString().split('T')[0];
  const overdueTodos = todos.filter((t) => t.dueDate && t.dueDate < todayStr && !t.completed);
  const unscheduledTodos = todos.filter((t) => !t.dueDate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overdue Section (If any) */}
      {overdueTodos.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
            <Clock size={18} />
            <span>Overdue Agenda ({overdueTodos.length})</span>
          </div>
          {overdueTodos.map((todo) => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}

      {/* 7-Day Agenda Schedule Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {days.map((day) => {
          const dayTodos = todos.filter((t) => t.dueDate === day.dateStr);

          return (
            <div
              key={day.dateStr}
              className="glass-card"
              style={{
                padding: '1.25rem',
                borderTop: day.isToday ? '3px solid var(--accent-primary)' : '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <CalendarIcon size={16} style={{ color: day.isToday ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                  <span>{day.label}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {dayTodos.length} tasks
                </span>
              </div>

              {dayTodos.length === 0 ? (
                <div
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  No tasks scheduled
                </div>
              ) : (
                dayTodos.map((todo) => (
                  <TaskItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onTogglePin={onTogglePin}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onToggleSubtask={onToggleSubtask}
                    onAddSubtask={onAddSubtask}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Unscheduled Tasks Section */}
      {unscheduledTodos.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Unscheduled / Backlog ({unscheduledTodos.length})
          </h3>
          {unscheduledTodos.map((todo) => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
