/**
 * TodoApp.tsx — Main client-side orchestrator.
 *
 * WHY SEPARATE FROM page.tsx?
 * In Next.js App Router, page.tsx is a Server Component by default.
 * All interactive state (useState, hooks) must live in Client Components.
 * This component is the "client island" that handles all interactivity.
 *
 * DESIGN SYSTEM (Ethereal Glass / Impeccable skill):
 * - OLED-black background (#050912)
 * - Indigo accent (not generic purple — intent-based)
 * - Radial mesh gradient depth overlays
 * - motion/react for all transitions
 * - AnimatePresence for list enter/exit
 * - Progress bar shows completion percentage
 */
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WarningCircle, X } from "@phosphor-icons/react";
import { useTodos } from "@/hooks/useTodos";
import { AddTodoForm } from "./AddTodoForm";
import { TodoItem } from "./TodoItem";
import { FilterTabs, type FilterType } from "./FilterTabs";
import { StatsBar } from "./StatsBar";
import { EmptyState } from "./EmptyState";

export function TodoApp() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodoText, clearError } = useTodos();
  const [filter, setFilter] = useState<FilterType>("all");

  // Derived — computed only when todos/filter change (useMemo optimisation)
  const filtered = useMemo(() => {
    if (filter === "active")    return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) =>  t.completed);
    return todos;
  }, [todos, filter]);

  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);
  const activeCount = todos.length - completedCount;

  // Progress percentage for the bar
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── HERO HEADLINE (cinematic center) ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center pt-2"
      >
        {/* Eyebrow — max 1 per page, this is it */}
        <p className="text-[11px] text-indigo-400/80 font-semibold uppercase tracking-[0.22em] mb-3">
          Personal workspace
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white leading-none">
          My Tasks
        </h1>
        {/* Subtext — 20 words max */}
        <p className="text-white/35 text-sm sm:text-base mt-2 max-w-xs mx-auto leading-relaxed">
          Stay focused. Real-time sync across all your devices.
        </p>
      </motion.div>

      {/* ── PROGRESS BAR ── */}
      {todos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-1.5"
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/30 font-medium">Progress</span>
            <span className="text-indigo-400 font-bold tabular-nums">{progress}%</span>
          </div>
          {/* Track */}
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}

      {/* ── BENTO STATS (3 cells, no empty spaces) ── */}
      <StatsBar total={todos.length} completed={completedCount} active={activeCount} />

      {/* ── ADD TASK FORM ── */}
      <AddTodoForm onAdd={addTodo} />

      {/* ── ERROR BANNER ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            role="alert"
            className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300"
          >
            <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
            <p className="flex-1 text-sm">{error}</p>
            <button onClick={clearError} className="shrink-0 hover:text-white transition-colors active:scale-90" aria-label="Dismiss">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FILTER TABS + LIST ── */}
      <div className="space-y-3">
        {/* Filter tabs row */}
        <div className="flex items-center justify-between gap-3">
          <FilterTabs filter={filter} onChange={setFilter} counts={{ all: todos.length, active: activeCount, completed: completedCount }} />
          {filtered.length > 0 && (
            <span className="text-white/25 text-xs tabular-nums">{filtered.length} {filtered.length === 1 ? "task" : "tasks"}</span>
          )}
        </div>

        {/* Task list */}
        {loading ? (
          // Skeleton loaders (shape-matched to real items)
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[62px] rounded-xl bg-white/[0.03] border border-white/[0.05] animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <motion.div className="space-y-2" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((todo, i) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={i}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodoText}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
