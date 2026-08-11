/**
 * EmptyState.tsx — Contextual empty state with light animation.
 * Different message per active filter.
 */
"use client";

import { motion } from "motion/react";
import { ClipboardText, CheckCircle, SpinnerGap } from "@phosphor-icons/react";
import type { FilterType } from "./FilterTabs";

const config = {
  all:       { Icon: ClipboardText, title: "No tasks yet",       sub: "Add your first task above to get started." },
  active:    { Icon: CheckCircle,   title: "All done!",           sub: "You have no active tasks. Great work." },
  completed: { Icon: SpinnerGap,    title: "Nothing completed",   sub: "Finish some tasks and they will appear here." },
};

export function EmptyState({ filter }: { filter: FilterType }) {
  const { Icon, title, sub } = config[filter];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 sm:py-20 text-center"
    >
      {/* Icon container — Double-Bezel mini version */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-[1px] mb-5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[15px] bg-gradient-to-br from-indigo-500/10 to-transparent flex items-center justify-center">
          <Icon size={28} weight="duotone" className="text-indigo-400/60" />
        </div>
      </div>
      <h3 className="text-white/60 font-semibold text-base sm:text-lg mb-1.5">{title}</h3>
      <p className="text-white/30 text-sm max-w-[240px] leading-relaxed">{sub}</p>
    </motion.div>
  );
}
