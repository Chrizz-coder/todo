/**
 * AddTodoForm.tsx — Form component for creating new todos
 *
 * WHAT IT DOES:
 * - Controlled input: React state owns the input value
 * - User can set priority (low / medium / high) before adding
 * - Submits on Enter key OR clicking the Add button
 * - Clears itself after successful submission
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Todo } from '../lib/supabase';

interface AddTodoFormProps {
  onAdd: (text: string, priority: Todo['priority']) => Promise<void>;
}

// Styling helper: maps priority value to Tailwind ring color
const priorityConfig = {
  low:    { label: '🟢 Low',    ring: 'ring-emerald-500/60' },
  medium: { label: '🟡 Medium', ring: 'ring-amber-500/60'   },
  high:   { label: '🔴 High',   ring: 'ring-rose-500/60'    },
} satisfies Record<Todo['priority'], { label: string; ring: string }>;

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  // ─── LOCAL STATE ────────────────────────────────────────────────────────────
  const [text, setText] = useState('');                      // Input field value
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);  // Prevents double-submit

  // ─── SUBMIT HANDLER ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onAdd(text, priority);
    setText('');        // Clear input after adding
    setIsSubmitting(false);
  };

  return (
    // ─── FORM CARD ─────────────────────────────────────────────────────────────
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3"
    >
      {/* ── INPUT ROW ── */}
      <div className="flex gap-2">
        {/* Text input — uses Tailwind ring to show priority color */}
        <input
          id="todo-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          className={`
            flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3
            text-white placeholder-white/40 text-sm sm:text-base
            outline-none ring-2 transition-all duration-200
            focus:bg-white/15 disabled:opacity-50
            ${priorityConfig[priority].ring}
          `}
        />

        {/* Add Button */}
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          id="add-todo-btn"
          className="
            bg-violet-600 hover:bg-violet-500 disabled:bg-white/10
            disabled:text-white/30 text-white rounded-xl px-4 py-3
            transition-all duration-200 flex items-center gap-2
            font-medium text-sm sm:text-base active:scale-95
          "
        >
          {/* Plus icon from lucide-react */}
          <Plus size={18} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* ── PRIORITY SELECTOR ── */}
      {/* Three toggle buttons — only one active at a time */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
          Priority:
        </span>
        {(Object.keys(priorityConfig) as Todo['priority'][]).map((level) => (
          <button
            key={level}
            type="button"                               // Prevent form submit
            onClick={() => setPriority(level)}
            className={`
              px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150
              ${priority === level
                ? 'bg-white/20 text-white ring-1 ring-white/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/10'
              }
            `}
          >
            {priorityConfig[level].label}
          </button>
        ))}
      </div>
    </form>
  );
};
