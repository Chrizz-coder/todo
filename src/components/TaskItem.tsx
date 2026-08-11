import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  Clock, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Copy, 
  Tag, 
  Timer 
} from 'lucide-react';
import type { Todo } from '../types/todo';

interface TaskItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDuplicate: (todo: Todo) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onAddSubtask: (todoId: string, title: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  todo,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask,
  onAddSubtask,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = todo.subtasks.length;
  const subtaskRatio = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = todo.dueDate && todo.dueDate < todayStr && !todo.completed;
  const isDueToday = todo.dueDate && todo.dueDate === todayStr && !todo.completed;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(todo.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div className={`glass-card task-item ${todo.completed ? 'completed' : ''} ${todo.pinned ? 'pinned' : ''}`}>
      <div className="task-item-main">
        {/* Custom Checkbox */}
        <button
          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(todo.id)}
          title={todo.completed ? 'Mark as Pending' : 'Mark as Complete'}
        >
          <Check size={14} strokeWidth={3} />
        </button>

        {/* Task Details Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
            {/* Priority Badge */}
            <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>

            {/* Category */}
            {todo.category && <span className="badge badge-category">{todo.category}</span>}

            {/* Due Date Indicator */}
            {todo.dueDate && (
              <span
                className="badge"
                style={{
                  background: isOverdue ? 'rgba(239, 68, 68, 0.15)' : isDueToday ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: isOverdue ? '#ef4444' : isDueToday ? '#f59e0b' : 'var(--text-secondary)',
                  border: isOverdue ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
                }}
              >
                <Clock size={12} />
                {isDueToday ? 'Today' : todo.dueDate}
              </span>
            )}

            {/* Estimated Minutes */}
            {todo.estimatedMinutes && (
              <span className="badge badge-category">
                <Timer size={12} /> {todo.estimatedMinutes}m
              </span>
            )}
          </div>

          {/* Title */}
          <div className="task-title">{todo.title}</div>

          {/* Description */}
          {todo.description && <div className="task-desc">{todo.description}</div>}

          {/* Tags List */}
          {todo.tags && todo.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-glow)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtask Progress Bar Preview */}
          {totalSubtasks > 0 && (
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <span>Subtasks Progress</span>
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
              <div className="progress-bar-bg" style={{ height: '4px' }}>
                <div className="progress-bar-fill" style={{ width: `${subtaskRatio}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {/* Star / Pin Button */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onTogglePin(todo.id)}
            title={todo.pinned ? 'Unpin task' : 'Pin task to top'}
            style={{ color: todo.pinned ? '#f59e0b' : 'var(--text-muted)' }}
          >
            <Star size={16} fill={todo.pinned ? '#f59e0b' : 'none'} />
          </button>

          {/* Subtask expand button */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setExpanded(!expanded)}
            title="Expand Subtasks"
            style={{ color: totalSubtasks > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Edit Task */}
          <button className="btn btn-ghost btn-icon" onClick={() => onEdit(todo)} title="Edit task details">
            <Edit3 size={16} />
          </button>

          {/* Duplicate Task */}
          <button className="btn btn-ghost btn-icon" onClick={() => onDuplicate(todo)} title="Duplicate task">
            <Copy size={16} />
          </button>

          {/* Delete Task */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onDelete(todo.id)}
            title="Delete task"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expanded Subtask List Accordion */}
      {expanded && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Checklist / Subtasks:
          </div>

          {todo.subtasks.map((st) => (
            <div
              key={st.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.85rem',
                color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: st.completed ? 'line-through' : 'none',
              }}
            >
              <button
                className={`custom-checkbox ${st.completed ? 'checked' : ''}`}
                style={{ width: '18px', height: '18px' }}
                onClick={() => onToggleSubtask(todo.id, st.id)}
              >
                <Check size={12} strokeWidth={3} />
              </button>
              <span>{st.title}</span>
            </div>
          ))}

          {/* Add Subtask Quick Input */}
          <form onSubmit={handleAddSubtaskSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Add subtask step..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <Plus size={14} /> Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
