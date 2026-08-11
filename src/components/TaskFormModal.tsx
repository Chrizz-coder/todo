import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Todo, Priority } from '../types/todo';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Todo, 'id' | 'createdAt'> & { id?: string }) => void;
  initialData?: Todo | null;
}

const CATEGORY_OPTIONS = ['Work', 'Personal', 'Health', 'Finance', 'Shopping', 'Learning', 'Ideas'];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(30);
  const [tags, setTags] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      if (CATEGORY_OPTIONS.includes(initialData.category)) {
        setCategory(initialData.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(initialData.category);
      }
      setDueDate(initialData.dueDate || '');
      setEstimatedMinutes(initialData.estimatedMinutes);
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setSubtasks(initialData.subtasks || []);
    } else {
      // Reset defaults for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
      setCustomCategory('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setEstimatedMinutes(30);
      setTags('');
      setSubtasks([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: Date.now().toString(), title: newSubtaskInput.trim(), completed: false },
    ]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;
    const formattedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      id: initialData?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      completed: initialData ? initialData.completed : false,
      priority,
      category: finalCategory,
      dueDate: dueDate || undefined,
      estimatedMinutes: Number(estimatedMinutes) || undefined,
      subtasks,
      pinned: initialData ? initialData.pinned : false,
      tags: formattedTags,
      status: initialData?.status || 'todo',
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {initialData ? '✏️ Edit Task' : '✨ Create New Task'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Task Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Design Landing Page Mockup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              className="input-field"
              placeholder="Add extra context, specifications, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Grid Row: Priority & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Priority */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Priority Level
              </label>
              <select
                className="input-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={{ paddingLeft: '0.85rem' }}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🔵 Medium Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ paddingLeft: '0.85rem' }}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">+ Custom Category</option>
              </select>
            </div>
          </div>

          {category === 'Custom' && (
            <div>
              <input
                type="text"
                className="input-field"
                placeholder="Enter custom category name"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          )}

          {/* Grid Row: Due Date & Estimated Minutes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Due Date
              </label>
              <input
                type="date"
                className="input-field"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ paddingLeft: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Est. Minutes
              </label>
              <input
                type="number"
                min="5"
                step="5"
                className="input-field"
                placeholder="30"
                value={estimatedMinutes || ''}
                onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
                style={{ paddingLeft: '0.85rem' }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Design, Frontend, Sprint1"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* Subtasks checklist setup */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Subtasks / Action Items
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Add subtask step..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                style={{ paddingLeft: '0.85rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSubtask}>
                <Plus size={16} /> Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span>• {st.title}</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      onClick={() => handleRemoveSubtask(st.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
