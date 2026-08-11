/**
 * useTodos.ts — Client-side hook for all Supabase CRUD + realtime sync.
 *
 * "use client" is required because this hook uses useState, useEffect —
 * React hooks that only work in Client Components (not the server).
 *
 * Architecture: Custom hooks = data layer. Components = UI layer.
 * Nothing in a component should call supabase directly.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type Todo, type Priority } from "@/lib/supabase";

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string, priority: Priority) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodoText: (id: string, text: string) => Promise<void>;
  clearError: () => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches all todos ordered newest-first
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setTodos(data ?? []);
    setLoading(false);
  }, []);

  // INSERT — immediately reflected in UI (optimistic)
  const addTodo = async (text: string, priority: Priority) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const { data, error: err } = await supabase
      .from("todos")
      .insert([{ text: trimmed, completed: false, priority }])
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setTodos((prev) => [data, ...prev]);
  };

  // UPDATE completed — optimistic flip, revert on error
  const toggleTodo = async (id: string, completed: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    const { error: err } = await supabase.from("todos").update({ completed: !completed }).eq("id", id);
    if (err) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
      setError(err.message);
    }
  };

  // DELETE — optimistic removal
  const deleteTodo = async (id: string) => {
    const prev = todos;
    setTodos((p) => p.filter((t) => t.id !== id));
    const { error: err } = await supabase.from("todos").delete().eq("id", id);
    if (err) { setTodos(prev); setError(err.message); }
  };

  // UPDATE text
  const updateTodoText = async (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
    const { error: err } = await supabase.from("todos").update({ text: trimmed }).eq("id", id);
    if (err) { setError(err.message); fetchTodos(); }
  };

  // Mount: fetch + subscribe to realtime changes
  useEffect(() => {
    fetchTodos();
    const channel = supabase
      .channel("todos-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "todos" }, fetchTodos)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTodos]);

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodoText, clearError: () => setError(null) };
}
