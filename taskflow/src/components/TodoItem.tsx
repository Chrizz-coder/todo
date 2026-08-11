/**
 * TodoItem.tsx — Single task row with inline edit, toggle, delete.
 *
 * HIGH-END SKILL compliant:
 * - AnimatePresence for exit animations (slide out)
 * - Custom spring transitions, no linear easing
 * - Priority badge uses proper color token system
 * - Phosphor icons (no Lucide)
 * - Magnetic active:scale on interactive elements
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { CheckCircle, Circle, PencilSimple, Trash, Check, X } from "@phosphor-icons/react";
import type { Todo } from "@/lib/supabase";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, text: string) => Promise<void>;
  index: number;
}

// Priority visual system — one accent color per level, no mixing
const priorityMap = {
  high:   { label: "High",   badge: "bg-rose-500/15 text-rose-300 ring-rose-500/25",    dot: "bg-rose-400"    },
  medium: { label: "Med",    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/25", dot: "bg-amber-400"   },
  low:    { label: "Low",    badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25", dot: "bg-emerald-400" },
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate, index }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editRef = useRef<HTMLInputElement>(null);
  const p = priorityMap[todo.priority];

  useEffect(() => {
    if (editing) { editRef.current?.focus(); editRef.current?.select(); }
  }, [editing]);

  const saveEdit = async () => {
    if (editText.trim() && editText !== todo.text) await onUpdate(todo.id, editText);
    setEditing(false);
  };

  const cancelEdit = () => { setEditText(todo.text); setEditing(false); };

  return (
    <motion.div
      // Staggered entrance based on index position in list
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.98 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      layout
      className={`group relative ${todo.completed ? "opacity-50" : ""}`}
    >
      {/* Outer shell */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-[1px] hover:border-white/[0.12] transition-colors duration-200">
        {/* Inner core */}
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-[11px] bg-[#0d0d14] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">

          {/* Toggle checkbox */}
          <button
            onClick={() => onToggle(todo.id, todo.completed)}
            id={`toggle-${todo.id}`}
            className="shrink-0 active:scale-90 transition-transform duration-150"
            aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
          >
            {todo.completed
              ? <CheckCircle size={20} weight="fill" className="text-indigo-400" />
              : <Circle size={20} weight="regular" className="text-white/25 hover:text-indigo-400 transition-colors duration-200" />
            }
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                onBlur={saveEdit}
                className="w-full bg-white/[0.08] border border-indigo-500/40 rounded-lg px-3 py-1 text-white text-sm outline-none ring-2 ring-indigo-500/20"
              />
            ) : (
              <p
                onClick={() => !todo.completed && setEditing(true)}
                title="Click to edit"
                className={`text-sm sm:text-base truncate ${todo.completed ? "line-through text-white/30" : "text-white/85 cursor-pointer hover:text-white transition-colors"}`}
              >
                {todo.text}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-1">
              {/* Priority badge — ring architecture */}
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${p.badge}`}>
                <span className={`w-1 h-1 rounded-full ${p.dot}`} />
                {p.label}
              </span>
              <span className="text-white/20 text-[10px]">
                {new Date(todo.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>

          {/* Action buttons — revealed on hover via group */}
          <div className={`flex items-center gap-1 shrink-0 transition-all duration-200 ${editing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            {editing ? (
              <>
                <button onClick={saveEdit} id={`save-${todo.id}`}
                  className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 transition-colors active:scale-90">
                  <Check size={13} weight="bold" />
                </button>
                <button onClick={cancelEdit} id={`cancel-${todo.id}`}
                  className="p-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/50 transition-colors active:scale-90">
                  <X size={13} weight="bold" />
                </button>
              </>
            ) : (
              <>
                {!todo.completed && (
                  <button onClick={() => setEditing(true)} id={`edit-${todo.id}`}
                    className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/25 hover:text-white/70 transition-all active:scale-90">
                    <PencilSimple size={14} />
                  </button>
                )}
                <button onClick={() => onDelete(todo.id)} id={`delete-${todo.id}`}
                  className="p-1.5 rounded-lg hover:bg-rose-500/15 text-white/25 hover:text-rose-300 transition-all active:scale-90">
                  <Trash size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
