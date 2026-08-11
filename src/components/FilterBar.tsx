/**
 * FilterBar.tsx — Filter + stats bar for the Todo list
 *
 * FILTER OPTIONS: All | Active | Completed
 * Also shows a summary like "3 of 7 done"
 */

import React from 'react';

// The 3 possible filter values
export type FilterType = 'all' | 'active' | 'completed';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  total: number;
  completed: number;
}

// Button config: label + filter value
const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Active',    value: 'active'    },
  { label: 'Completed', value: 'completed' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  total,
  completed,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* ── FILTER TOGGLE PILLS ── */}
      <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            id={`filter-${value}`}
            onClick={() => onFilterChange(value)}
            className={`
              px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150
              ${filter === value
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-white/50 hover:text-white/80 hover:bg-white/10'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── PROGRESS COUNTER ── */}
      <div className="flex items-center gap-2">
        {/* Visual progress bar */}
        <div className="w-20 sm:w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: total === 0 ? '0%' : `${(completed / total) * 100}%` }}
          />
        </div>
        <span className="text-white/50 text-xs sm:text-sm whitespace-nowrap">
          {completed}/{total} done
        </span>
      </div>
    </div>
  );
};
