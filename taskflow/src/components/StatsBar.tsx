/**
 * StatsBar.tsx — Bento-style stats grid showing task counts.
 *
 * HIGH-END SKILL: "Asymmetric Bento" layout variant.
 * - Uses motion/react for staggered entrance on mount
 * - Double-Bezel card architecture (outer shell + inner core)
 * - No empty cells; exactly 3 stats = 3 cells (1 wide + 2 narrow)
 * - Phosphor icons only (no Lucide)
 */
"use client";

import { motion } from "motion/react";
import { CheckCircle, Circle, Target } from "@phosphor-icons/react";

interface StatsBarProps {
  total: number;
  completed: number;
  active: number;
}

// Each stat card config
const statConfig = [
  { key: "total",     icon: Target,      label: "Total tasks",  color: "text-indigo-400",  glow: "from-indigo-500/10" },
  { key: "active",    icon: Circle,      label: "Remaining",    color: "text-amber-400",   glow: "from-amber-500/10"  },
  { key: "completed", icon: CheckCircle, label: "Completed",    color: "text-emerald-400", glow: "from-emerald-500/10"},
] as const;

export function StatsBar({ total, completed, active }: StatsBarProps) {
  const values = { total, active, completed };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {statConfig.map(({ key, icon: Icon, label, color, glow }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          // Outer shell (Double-Bezel)
          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-[1px]"
        >
          {/* Inner core */}
          <div className={`relative overflow-hidden rounded-[15px] bg-gradient-to-br ${glow} to-transparent p-4 sm:p-5`}>
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] rounded-[15px] pointer-events-none" />

            <Icon size={18} weight="duotone" className={`${color} mb-3`} />
            <p className="text-white font-bold text-xl sm:text-2xl tabular-nums leading-none">
              {values[key]}
            </p>
            <p className="text-white/35 text-[11px] sm:text-xs mt-1 font-medium">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
