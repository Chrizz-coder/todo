import React from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  LayoutList, 
  Kanban, 
  BarChart3, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import type { ViewMode } from '../types/todo';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onOpenCreateModal: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
  onOpenCreateModal,
  onExport,
  onImport,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="navbar">
      <div className="nav-content">
        {/* Brand Logo */}
        <div className="logo-brand">
          <div className="logo-icon">
            <CheckCircle2 size={22} strokeWidth={2.5} />
          </div>
          <span>TaskPulse</span>
        </div>

        {/* View Switcher Tabs */}
        <div className="view-tabs">
          <button
            className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <LayoutList size={16} />
            <span>List</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
            title="Kanban Board View"
          >
            <Kanban size={16} />
            <span>Board</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
            title="Calendar Agenda View"
          >
            <CalendarIcon size={16} />
            <span>Calendar</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'analytics' ? 'active' : ''}`}
            onClick={() => setViewMode('analytics')}
            title="Analytics View"
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Create Task */}
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={18} strokeWidth={2.5} />
            <span>New Task</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={toggleSound}
            title={soundEnabled ? 'Disable Audio Cues' : 'Enable Audio Cues'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} style={{ opacity: 0.5 }} />}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Export JSON */}
          <button className="btn btn-secondary btn-icon" onClick={onExport} title="Export Tasks Backup (JSON)">
            <Download size={18} />
          </button>

          {/* Import JSON */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => fileInputRef.current?.click()}
            title="Import Tasks from JSON"
          >
            <Upload size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImport}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </header>
  );
};
