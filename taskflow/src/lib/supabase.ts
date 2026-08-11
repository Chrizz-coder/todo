/**
 * supabase.ts — Lazy Supabase client singleton for the entire Next.js app.
 *
 * WHY LAZY?
 * Next.js runs a build-time prerender of every page. If the Supabase client
 * throws at module-load time (because env vars aren't set in the build environment),
 * the entire build fails. A lazy getter creates the client only when first called
 * at runtime — so the build completes even without env vars present.
 *
 * ENV VARS must be set in Vercel → Project Settings → Environment Variables.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── DATABASE TYPES ──────────────────────────────────────────────────────────
export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  created_at: string;
}

// ─── LAZY SINGLETON ───────────────────────────────────────────────────────────
// The client is created once on first call, then reused.
// This prevents build-time crashes when NEXT_PUBLIC_ vars aren't in the build env.
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel project settings."
    );
  }

  _client = createClient(url, key);
  return _client;
}

// Convenience export — same API as before for all hook/component imports
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

