/**
 * FloatingNav.tsx — Floating glass-pill navigation bar.
 *
 * Follows high-end-visual-design skill: "Fluid Island Nav" pattern.
 * - Detached pill floating at the top (not sticky to edge)
 * - Frosted glass backdrop-blur
 * - Motion-powered entrance animation (motion/react)
 * - "use client" because it uses motion and interactive state
 */
"use client";

import { motion } from "motion/react";
import { CheckSquare, Lightning } from "@phosphor-icons/react";

export function FloatingNav() {
  return (
    // Outer wrapper: positions the nav at the top-center, floating
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        // Entrance animation: slide down + fade in
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto"
      >
        {/* Outer shell (Double-Bezel outer ring) */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-full p-[3px] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Inner core pill */}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0a0a0f]/80 border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
            {/* Logo mark */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <CheckSquare size={13} weight="fill" className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                TaskFlow
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/10" />

            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-white/40 text-xs flex items-center gap-1">
                <Lightning size={10} weight="fill" className="text-indigo-400" />
                Realtime
              </span>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
