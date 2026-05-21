import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  LayoutDashboard, 
  CheckSquare, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const { lang, activeTab, setActiveTab, isLowBandwidth } = useApp();
  const t = translations[lang];

  const menuItems = [
    { name: 'Overview', label: t.overview, icon: LayoutDashboard },
    { name: 'Tasks', label: t.tasks, icon: CheckSquare },
    { name: 'Alerts', label: t.alerts, icon: AlertTriangle, badge: 4 },
    { name: 'Analytics', label: t.analytics, icon: TrendingUp },
    { name: 'Teams', label: t.teams, icon: Users },
    { name: 'Settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 z-30 transition-all duration-300 flex flex-col justify-between
      ${isLowBandwidth 
        ? 'bg-[#0b0f19] border-r border-[#1e293b]' 
        : 'bg-[#070b13]/80 backdrop-blur-xl border-r border-slate-900/60 shadow-[4px_0_30px_rgba(0,0,0,0.3)]'
      }`}
    >
      {/* Top Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden
            ${isLowBandwidth 
              ? 'bg-blue-600' 
              : 'bg-gradient-to-tr from-blue-600 to-teal-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            {!isLowBandwidth && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-xs font-semibold tracking-[0.2em] text-slate-100 font-display">
              {t.logo}
            </h1>
            <span className="text-[9px] tracking-[0.15em] text-teal-400 font-mono font-bold block">
              COCKPIT v3.5
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 relative group
                ${isActive 
                  ? 'text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }
              `}
            >
              {/* Highlight Background */}
              {isActive && !isLowBandwidth && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-slate-900/60 border border-slate-800/80 rounded-xl shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {isActive && isLowBandwidth && (
                <div className="absolute inset-0 bg-slate-900 border border-slate-850 rounded-xl" />
              )}

              {/* Icon & Label */}
              <div className="flex items-center gap-3.5 z-10">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105
                  ${isActive 
                    ? (isLowBandwidth ? 'text-blue-500' : 'text-teal-400 filter drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]') 
                    : 'text-slate-500 group-hover:text-slate-400'
                  }
                `} />
                <span className="font-display">{item.label}</span>
              </div>

              {/* Badge or Glow marker */}
              <div className="flex items-center gap-2 z-10 font-mono">
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border
                    ${isActive
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
                {isActive && !isLowBandwidth && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#14b8a6]" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-slate-900/60">
        <div className={`p-4 rounded-xl flex items-center gap-3.5
          ${isLowBandwidth 
            ? 'bg-slate-900 border border-slate-800' 
            : 'bg-slate-900/40 backdrop-blur-md border border-slate-800/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
          }`}
        >
          {/* Avatar Icon */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-100 font-bold font-display
              ${isLowBandwidth 
                ? 'bg-slate-800' 
                : 'bg-gradient-to-br from-blue-600/30 to-teal-400/20 border border-teal-500/30'
              }`}
            >
              V
            </div>
            {/* Live active ring */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_6px_#10b981]" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 truncate font-display">
              Vinit
            </h4>
            <p className="text-[10px] text-slate-500 truncate font-mono">
              {t.profileTitle}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
