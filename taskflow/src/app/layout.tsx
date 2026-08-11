/**
 * layout.tsx — Next.js App Router root layout (Server Component).
 *
 * HOW NEXT.JS FONTS WORK:
 * next/font/google downloads fonts at BUILD TIME and self-hosts them.
 * This is better than a Google Fonts <link> because:
 *  - No external network request at runtime (faster LCP)
 *  - No GDPR concerns from Google tracking
 *  - Font class applied to <html> so all components inherit it
 *
 * FONT CHOICE: Geist (not Inter — per high-end-visual-design skill ban)
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Geist Sans — main body + heading font (modern SaaS, not banned Inter)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Geist Mono — for monospaced elements (timestamps, counts)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO metadata — Next.js exports this automatically to <head>
export const metadata: Metadata = {
  title: "TaskFlow - Personal Task Manager",
  description:
    "A real-time personal task manager built with Next.js, Tailwind CSS, and Supabase. Create, prioritize, and sync tasks across all your devices.",
  keywords: ["todo app", "task manager", "productivity", "supabase", "nextjs"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
