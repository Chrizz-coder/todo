/**
 * AddTodoForm.tsx — Premium command-bar style input for creating tasks.
 *
 * HIGH-END SKILL: "Button-in-Button" trailing icon pattern.
 * - Input ring color adapts to selected priority (Lila rule: no auto-purple, intent-based)
 * - Spring physics active:scale on button
 * - Priority selector uses pill architecture with transition spring
 */
"use client";

import { useState } from "react";
import { PlusCircle, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import type { Priority } from "@/lib/supabase";

interface AddTodoFormProps {
  onAdd: (text: string, priority: Priority) => Promise<void>;
}

const priorities: { value: Priority; label: string; ring: string; dot: string }[] = [
  { value: "high",   label: "High",   ring: "ring-rose-500/50",    dot: "bg-rose-400"    },
  { value: "medium", label: "Medium", ring: "ring-amber-500/50",   dot: "bg-amber-400"   },
  { value: "low",    label: "Low",    ring: "ring-emerald-500/50", dot: "bg-emerald-400" },
];

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const currentPriority = priorities.find((p) => p.value === priority)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onAdd(text, priority);
    setText("");
    setSubmitting(false);
  };

  return (
    // Outer shell (Double-Bezel)
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-[1px]"
    >
      {/* Inner core */}
      <div className="rounded-[15px] bg-[#0d0d14] border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
            <PlusCircle
              size={20}
              weight="duotone"
              className={`shrink-0 transition-colors duration-300 ${focused ? "text-indigo-400" : "text-white/25"}`}
            />

            <input
              id="task-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="What needs to be done?"
              disabled={submitting}
              className="flex-1 bg-transparent text-white placeholder-white/25 text-sm sm:text-base outline-none disabled:opacity-50"
            />

            {/* Add button — "Button-in-Button" trailing icon */}
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              id="add-task-btn"
              className="
                group flex items-center gap-2 px-4 py-2 rounded-full
                bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.06] disabled:text-white/20
                text-white text-sm font-semibold
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                active:scale-[0.96]
              "
            >
              <span className="hidden sm:inline">Add task</span>
              {/* Trailing icon — nested in its own circle (Button-in-Button) */}
              <span className="w-5 h-5 rounded-full bg-white/15 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <ArrowRight
                  size={11}
                  weight="bold"
                  className="group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform duration-200"
                />
              </span>
            </button>
          </div>

          {/* Priority selector row */}
          <div className={`flex items-center gap-2 px-4 sm:px-5 pb-3 border-t border-white/[0.04] pt-3 transition-opacity duration-200 ${focused || text ? "opacity-100" : "opacity-60"}`}>
            <span className="text-white/30 text-[11px] font-semibold uppercase tracking-widest mr-1">
              Priority
            </span>
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                  transition-all duration-200
                  ${priority === p.value
                    ? `bg-white/10 text-white ring-1 ${p.ring}`
                    : "text-white/35 hover:text-white/60 hover:bg-white/[0.05]"
                  }
                `}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                {p.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
