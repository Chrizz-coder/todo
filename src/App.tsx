/**
 * App.tsx — Root component of the Todo application
 *
 * ARCHITECTURE OVERVIEW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  App                                                        │
 * │  ├── useTodos()  ← custom hook, talks to Supabase          │
 * │  ├── AddTodoForm ← creates new todos                        │
 * │  ├── FilterBar   ← All / Active / Completed                 │
 * │  ├── TodoItem[]  ← one per todo (toggle, edit, delete)      │
 * │  └── EmptyState  ← shown when list is empty                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * STATE MANAGED HERE:
 * - filter: which subset of todos to show
 * - All todo data lives inside useTodos() hook
 *
 * WHY THIS STRUCTURE?
 * - Separation of concerns: data logic in hook, UI logic in components
 * - Each component has one job and is easy to test/replace
 * - Mobile-first responsive design via Tailwind's sm: breakpoints
 */

import React, { useState, useMemo } from 'react';
import { CheckSquare, Sparkles, AlertCircle, X } from 'lucide-react';
import { useTodos } from './hooks/useTodos';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoItem } from './components/TodoItem';
import { FilterBar, type FilterType } from './components/FilterBar';
import { EmptyState } from './components/EmptyState';

function App() {
  // ─── DATA LAYER ─────────────────────────────────────────────────────────────
  // All Supabase interactions are handled by this custom hook.
  // We destructure only what we need.
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    clearError,
  } = useTodos();

  // ─── LOCAL UI STATE ──────────────────────────────────────────────────────────
  // filter is kept in App because it affects which todos are displayed,
  // but it's a UI concern, not a data concern — so it lives here, not in the hook.
  const [filter, setFilter] = useState<FilterType>('all');

  // ─── DERIVED DATA ────────────────────────────────────────────────────────────
  // useMemo prevents recomputing the filtered list on every render.
  // It only recalculates when todos or filter actually change.
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':    return todos.filter((t) => !t.completed);
      case 'completed': return todos.filter((t) =>  t.completed);
      default:          return todos;
    }
  }, [todos, filter]);

  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    // Full-screen dark gradient background
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white">

      {/* ── DECORATIVE BACKGROUND BLOBS (purely visual) ── */}
      {/* These absolutely-positioned divs add depth to the background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── MAIN CONTENT ── */}
      {/* max-w-2xl + mx-auto centers on desktop; px-4 gives mobile padding */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-16">

        {/* ── HEADER ── */}
        <header className="text-center mb-8 sm:mb-12">
          {/* App icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-4 sm:mb-5 backdrop-blur-sm">
            <CheckSquare size={28} className="text-violet-300" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent mb-2">
            My Tasks
          </h1>
          <p className="text-white/50 text-sm sm:text-base flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-violet-400" />
            Powered by Supabase · Real-time sync
          </p>
        </header>

        {/* ── ERROR BANNER ── */}
        {/* Shown only when the hook reports an error */}
        {error && (
          <div
            role="alert"
            className="
              flex items-start gap-3 mb-5 p-4 rounded-xl
              bg-rose-500/10 border border-rose-500/30 text-rose-200
            "
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="flex-1 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="shrink-0 hover:text-white transition-colors"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── ADD TODO FORM ── */}
        <div className="mb-5">
          <AddTodoForm onAdd={addTodo} />
        </div>

        {/* ── FILTER + STATS BAR ── */}
        <div className="mb-4">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            total={todos.length}
            completed={completedCount}
          />
        </div>

        {/* ── TODO LIST ── */}
        <main>
          {loading ? (
            // ── LOADING SKELETONS ──
            // Show 3 animated placeholder rows while data is fetching
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : filteredTodos.length === 0 ? (
            // ── EMPTY STATE ──
            <EmptyState filter={filter} />
          ) : (
            // ── ACTUAL TODO ITEMS ──
            // Each TodoItem is a self-contained row with its own edit/delete state
            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}   // React uses key to efficiently re-render the list
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodoText}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer className="mt-10 text-center text-white/20 text-xs">
          Built with React + Vite + Tailwind CSS + Supabase
        </footer>
      </div>
    </div>
  );
}

export default App;
