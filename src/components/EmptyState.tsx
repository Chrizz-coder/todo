/**
 * EmptyState.tsx — Friendly empty state illustration
 *
 * Shown when there are no todos to display (either list is empty
 * or the active filter has no results).
 */

import React from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  filter: 'all' | 'active' | 'completed';
}

// Different messages depending on which filter is active
const messages = {
  all:       { title: 'No tasks yet',      sub: 'Add your first todo above to get started!' },
  active:    { title: 'Nothing left to do', sub: 'All tasks are completed. Great work! 🎉'    },
  completed: { title: 'No completed tasks', sub: 'Finish some tasks to see them here.'         },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  const { title, sub } = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
      {/* Glowing icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 sm:mb-5">
        <ClipboardList size={32} className="text-violet-400/60" />
      </div>
      <h3 className="text-white/70 text-base sm:text-lg font-semibold mb-1">{title}</h3>
      <p className="text-white/35 text-sm max-w-xs">{sub}</p>
    </div>
  );
};
