/**
 * page.tsx — Root page (Server Component by default in Next.js App Router).
 *
 * WHY THIS FILE IS A SERVER COMPONENT:
 * Server Components render on the server = faster initial HTML load (better LCP).
 * They CANNOT use hooks (useState, useEffect) or event handlers.
 * All interactive UI is isolated in <TodoApp> which has "use client" at the top.
 *
 * This page renders the static shell (background, nav, layout chrome).
 * <TodoApp> is the "client island" that handles all interactivity.
 *
 * THEME: Ethereal Glass (OLED black, subtle indigo orbs, no gradients on text)
 * LAYOUT: Cinematic Center (centered hero, max-w-lg content column)
 */
import { FloatingNav } from "@/components/FloatingNav";
import { TodoApp } from "@/components/TodoApp";

export default function Home() {
  return (
    // Viewport-filling dark canvas — min-h-[100dvh] not h-screen (iOS safe)
    <main className="min-h-[100dvh] bg-[#050912] relative overflow-x-hidden">

      {/* ── AMBIENT DEPTH ORBS (purely decorative, pointer-events-none, fixed) ── */}
      {/* Applied to fixed elements only — never on scrolling containers (performance rule) */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-right indigo glow */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        {/* Bottom-left violet glow */}
        <div className="absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full bg-violet-700/8 blur-[100px]" />
        {/* Center subtle pulse */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px]" />

        {/* Fine grain/noise overlay on fixed layer — never on scroll containers */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* ── FLOATING GLASS NAV ── */}
      <FloatingNav />

      {/* ── MAIN CONTENT COLUMN ── */}
      {/*
        max-w-lg keeps the content tight and readable (not stretched wide).
        pt-28 clears the floating nav (80px nav + 28px breathing room).
        pb-16 generous bottom padding for mobile chrome.
      */}
      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* TodoApp is the client island — all hooks and interactivity live there */}
        <TodoApp />

        {/* ── FOOTER ── */}
        <footer className="mt-12 text-center">
          <p className="text-white/15 text-xs font-[family-name:var(--font-geist-mono)]">
            Built with Next.js · Tailwind CSS · Supabase
          </p>
        </footer>
      </div>
    </main>
  );
}
