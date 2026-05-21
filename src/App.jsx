import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ActionPanel } from './components/ActionPanel';
import { AnomalyPanel } from './components/AnomalyPanel';
import { TickingCounter } from './components/TickingCounter';
import { ShortcutHelper } from './components/ShortcutHelper';
import { TasksPage } from './components/TasksPage';
import { AlertsPage } from './components/AlertsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { TeamsPage } from './components/TeamsPage';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const { activeTab, isLowBandwidth, lang, accentColor } = useApp();

  const isEnglish = lang === 'en';

  // Dynamic ambient glowing backdrops based on custom accent color selections
  const getAccentGlows = () => {
    switch (accentColor) {
      case 'rose':
        return {
          glowPrimary: 'rgba(244, 63, 94, 0.05)',
          glowSecondary: 'rgba(244, 63, 94, 0.03)'
        };
      case 'emerald':
        return {
          glowPrimary: 'rgba(16, 185, 129, 0.05)',
          glowSecondary: 'rgba(16, 185, 129, 0.03)'
        };
      case 'gold':
        return {
          glowPrimary: 'rgba(245, 158, 11, 0.05)',
          glowSecondary: 'rgba(245, 158, 11, 0.03)'
        };
      default: // cyan
        return {
          glowPrimary: 'rgba(34, 211, 238, 0.05)',
          glowSecondary: 'rgba(20, 184, 166, 0.03)'
        };
    }
  };

  const glows = getAccentGlows();

  return (
    <div 
      className={`min-h-screen text-slate-300 select-none overflow-x-hidden font-sans transition-all duration-500
        ${isLowBandwidth ? 'bg-[#05070c]' : 'bg-[#050811] grid-bg'}`}
      style={!isLowBandwidth ? {
        backgroundImage: `
          radial-gradient(circle at 10% 20%, ${glows.glowPrimary} 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, ${glows.glowSecondary} 0%, transparent 40%),
          linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
      } : {}}
    >
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Top Navigation & System Status Header */}
      <Header />

      {/* 3. Main Operational Layout Workspace */}
      <main className="pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {activeTab === 'Overview' && (
            <>
              {/* Main Mission Control Dashboard Sections */}
              <Hero />
              
              <TickingCounter />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* 3/5 width for Actions (Important operations panel) */}
                <div className="lg:col-span-3">
                  <ActionPanel />
                </div>

                {/* 2/5 width for AI-powered anomalies ingress */}
                <div className="lg:col-span-2">
                  <AnomalyPanel />
                </div>
              </div>
            </>
          )}

          {activeTab === 'Tasks' && <TasksPage />}
          {activeTab === 'Alerts' && <AlertsPage />}
          {activeTab === 'Analytics' && <AnalyticsPage />}
          {activeTab === 'Teams' && <TeamsPage />}
          {activeTab === 'Settings' && <SettingsPage />}
        </div>
      </main>

      {/* 4. Keyboard shortcuts guide floating console helper */}
      <ShortcutHelper />
    </div>
  );
}

export default App;
