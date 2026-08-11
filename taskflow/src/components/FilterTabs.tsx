/**
 * FilterTabs.tsx — All / Active / Done filter with animated indicator.
 *
 * HIGH-END SKILL: Motion's layout animation for the indicator pill.
 * - layoutId="filter-pill" creates a shared-element transition
 *   between filter buttons (the highlight glides smoothly)
 * - Tailwind v4 compatible
 */
"use client";

import { motion } from "motion/react";

export type FilterType = "all" | "active" | "completed";

interface FilterTabsProps {
  filter: FilterType;
  onChange: (f: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const TABS: { value: FilterType; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "active",    label: "Active"    },
  { value: "completed", label: "Done"      },
];

export function FilterTabs({ filter, onChange, counts }: FilterTabsProps) {
  return (
    // Container with background track
    <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          id={`filter-${value}`}
          onClick={() => onChange(value)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 z-10"
        >
          {/* Animated background pill via shared layoutId */}
          {filter === value && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 bg-indigo-600/80 rounded-lg shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {/* Label text (above the animated bg) */}
          <span className={`relative z-10 transition-colors ${filter === value ? "text-white" : "text-white/40 hover:text-white/70"}`}>
            {label}
          </span>
          {/* Count badge */}
          <span className={`relative z-10 text-[10px] font-bold tabular-nums transition-colors ${filter === value ? "text-white/80" : "text-white/25"}`}>
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}
