/**
 * useTodos.ts — Custom React Hook for all Todo CRUD operations
 *
 * WHY A CUSTOM HOOK?
 * This separates data logic from UI logic. Components stay simple and
 * just call functions like `addTodo(text)` without knowing about Supabase.
 *
 * WHAT IT DOES:
 * - Fetches all todos from Supabase on mount
 * - Provides functions: addTodo, toggleTodo, deleteTodo, updateTodo
 * - Manages loading and error states
 * - Subscribes to real-time changes so multiple browser tabs stay in sync
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, type Todo } from '../lib/supabase';

// The shape of data this hook returns to components
interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string, priority: Todo['priority']) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodoText: (id: string, text: string) => Promise<void>;
  clearError: () => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── FETCH ALL TODOS ────────────────────────────────────────────────────────
  // useCallback prevents this function from being recreated on every render,
  // which is important since we pass it as a dependency to useEffect.
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first

      if (fetchError) throw fetchError;
      setTodos(data ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── ADD A NEW TODO ─────────────────────────────────────────────────────────
  const addTodo = async (text: string, priority: Todo['priority'] = 'medium') => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      // .insert() sends the new row to Supabase.
      // .select().single() returns the inserted row with its auto-generated id.
      const { data, error: insertError } = await supabase
        .from('todos')
        .insert([{ text: trimmed, completed: false, priority }])
        .select()
        .single();

      if (insertError) throw insertError;
      // Optimistically prepend to local state so UI updates instantly
      setTodos((prev) => [data, ...prev]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add todo';
      setError(message);
    }
  };

  // ─── TOGGLE COMPLETED STATE ─────────────────────────────────────────────────
  const toggleTodo = async (id: string, completed: boolean) => {
    // Optimistic update: flip the UI immediately without waiting for the server
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    );
    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id); // .eq() = WHERE id = '...'

      if (updateError) throw updateError;
    } catch (err: unknown) {
      // Revert optimistic update on failure
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      );
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      setError(message);
    }
  };

  // ─── DELETE A TODO ──────────────────────────────────────────────────────────
  const deleteTodo = async (id: string) => {
    // Save previous state in case we need to revert
    const previous = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err: unknown) {
      setTodos(previous); // Revert on failure
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(message);
    }
  };

  // ─── UPDATE TODO TEXT (INLINE EDIT) ────────────────────────────────────────
  const updateTodoText = async (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ text: trimmed })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      setError(message);
      fetchTodos(); // Re-fetch to get consistent state
    }
  };

  // ─── REAL-TIME SUBSCRIPTION ─────────────────────────────────────────────────
  // Supabase Realtime lets us listen for database changes.
  // This means if another user/tab modifies the todos, we see it instantly.
  useEffect(() => {
    fetchTodos();

    const channel = supabase
      .channel('todos-realtime')          // Unique channel name
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' }, // Listen to all changes
        () => {
          // Re-fetch all todos when any change happens
          // (A more advanced approach would process the payload directly)
          fetchTodos();
        }
      )
      .subscribe();

    // Cleanup: unsubscribe when the component unmounts to prevent memory leaks
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    clearError: () => setError(null),
  };
}
