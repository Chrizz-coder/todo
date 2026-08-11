import React from 'react';
import type { Todo } from '../types/todo';
import { TaskItem } from './TaskItem';
import { Plus } from 'lucide-react';

interface KanbanViewProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDuplicate: (todo: Todo) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onOpenCreateModal: () => void;
  onUpdateStatus: (todoId: string, status: 'todo' | 'in-progress' | 'review' | 'done') => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  todos,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask,
  onAddSubtask,
  onOpenCreateModal,
  onUpdateStatus,
}) => {
  const columns: { id: 'todo' | 'in-progress' | 'review' | 'done'; title: string; emoji: string }[] = [
    { id: 'todo', title: 'To Do', emoji: '📝' },
    { id: 'in-progress', title: 'In Progress', emoji: '⚡' },
    { id: 'review', title: 'In Review', emoji: '👀' },
    { id: 'done', title: 'Completed', emoji: '✅' },
  ];

  const getTodosForColumn = (colId: string) => {
    if (colId === 'done') {
      return todos.filter((t) => t.completed || t.status === 'done');
    }
    return todos.filter((t) => !t.completed && (t.status || 'todo') === colId);
  };

  return (
    <div className="kanban-board">
      {columns.map((col) => {
        const colTodos = getTodosForColumn(col.id);

        return (
          <div key={col.id} className="kanban-col">
            <div className="kanban-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{col.emoji}</span>
                <span>{col.title}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {colTodos.length}
                </span>
              </div>
              {col.id === 'todo' && (
                <button
                  className="btn btn-ghost btn-icon"
                  style={{ width: '28px', height: '28px' }}
                  onClick={onOpenCreateModal}
                  title="Add new task"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {colTodos.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  No tasks here
                </div>
              ) : (
                colTodos.map((todo) => (
                  <div key={todo.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <TaskItem
                      todo={todo}
                      onToggleComplete={onToggleComplete}
                      onTogglePin={onTogglePin}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onToggleSubtask={onToggleSubtask}
                      onAddSubtask={onAddSubtask}
                    />
                    {/* Quick Move Status Pills */}
                    <div style={{ display: 'flex', gap: '0.25rem', paddingLeft: '0.5rem' }}>
                      {columns.map((c) => {
                        if (c.id === (todo.status || 'todo')) return null;
                        return (
                          <button
                            key={c.id}
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                            onClick={() => onUpdateStatus(todo.id, c.id)}
                            title={`Move to ${c.title}`}
                          >
                            → {c.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
