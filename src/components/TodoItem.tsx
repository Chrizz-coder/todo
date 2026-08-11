/**
 * TodoItem.tsx — Single todo row with inline editing, toggle, and delete
 *
 * FEATURES:
 * - Click the checkbox to toggle completed state
 * - Click the text to enter inline edit mode
 * - Priority badge shows the task urgency
 * - Smooth animations via Tailwind transition classes
 */

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import type { Todo } from '../lib/supabase';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, text: string) => Promise<void>;
}

// Priority visual config (color classes for the badge)
const priorityStyles: Record<Todo['priority'], { badge: string; dot: string }> = {
  low:    { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  medium: { badge: 'bg-amber-500/20  text-amber-300  border-amber-500/30',    dot: 'bg-amber-400'   },
  high:   { badge: 'bg-rose-500/20   text-rose-300   border-rose-500/30',     dot: 'bg-rose-400'    },
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  // ─── LOCAL STATE ────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null); // Auto-focus on edit

  // When entering edit mode, focus and select the input text
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  // ─── EDIT HANDLERS ──────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (editText.trim() && editText !== todo.text) {
      await onUpdate(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text); // Reset to original text
    setIsEditing(false);
  };

  // Save on Enter, cancel on Escape
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')  handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const style = priorityStyles[todo.priority];

  return (
    <div
      className={`
        group flex items-center gap-3 p-3 sm:p-4 rounded-xl
        bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20
        transition-all duration-200
        ${todo.completed ? 'opacity-60' : ''}
      `}
    >
      {/* ── CHECKBOX ── */}
      {/* Custom checkbox: a div styled to look like a rounded check button */}
      <button
        onClick={() => onToggle(todo.id, todo.completed)}
        id={`toggle-${todo.id}`}
        className={`
          shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-200 active:scale-90
          ${todo.completed
            ? 'bg-violet-500 border-violet-500'
            : 'border-white/30 hover:border-violet-400'
          }
        `}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && <Check size={12} strokeWidth={3} className="text-white" />}
      </button>

      {/* ── CONTENT AREA ── */}
      <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex overflow */}
        {isEditing ? (
          // ── EDIT MODE: show an input field ──
          <input
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleSaveEdit} // Auto-save when clicking away
            className="
              w-full bg-white/15 border border-violet-500/50 rounded-lg
              px-3 py-1 text-white text-sm sm:text-base outline-none
              ring-2 ring-violet-500/30
            "
          />
        ) : (
          // ── VIEW MODE: show the text ──
          <p
            onClick={() => !todo.completed && setIsEditing(true)} // Only edit if not done
            className={`
              text-sm sm:text-base truncate cursor-pointer
              ${todo.completed
                ? 'line-through text-white/40'
                : 'text-white hover:text-violet-200'
              }
            `}
            title="Click to edit"
          >
            {todo.text}
          </p>
        )}

        {/* ── META ROW: priority badge + timestamp ── */}
        <div className="flex items-center gap-2 mt-1">
          {/* Priority Badge */}
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full
              text-[10px] sm:text-xs font-medium border ${style.badge}
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {todo.priority}
          </span>

          {/* Timestamp */}
          <span className="text-white/25 text-[10px] sm:text-xs">
            {new Date(todo.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* ── ACTION BUTTONS ── */}
      {/* Hidden by default, shown on hover via group-hover */}
      <div className={`flex gap-1 shrink-0 ${isEditing ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
        {isEditing ? (
          // In edit mode: show Save and Cancel buttons
          <>
            <button
              onClick={handleSaveEdit}
              id={`save-${todo.id}`}
              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition-colors"
              title="Save"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancelEdit}
              id={`cancel-${todo.id}`}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 transition-colors"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          // View mode: show Edit and Delete buttons
          <>
            {!todo.completed && (
              <button
                onClick={() => setIsEditing(true)}
                id={`edit-${todo.id}`}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(todo.id)}
              id={`delete-${todo.id}`}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-300 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
