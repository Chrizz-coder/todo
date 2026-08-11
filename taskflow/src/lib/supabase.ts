/**
 * supabase.ts — Single Supabase client for the entire Next.js app.
 *
 * In Next.js App Router, this module is shared between Server and Client components.
 * The "use client" directive is NOT here because this is a pure utility — components
 * that call it decide themselves whether they run on server or client.
 *
 * ENV VARS are prefixed with NEXT_PUBLIC_ so Next.js exposes them to the browser.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── DATABASE TYPES ──────────────────────────────────────────────────────────
export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  created_at: string;
}
