import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  Wifi, 
  WifiOff, 
  Command 
} from 'lucide-react';

export const Header = () => {
  const { 
    lang, 
    toggleLang, 
    isDark, 
    toggleDark, 
    isLowBandwidth, 
    toggleLowBandwidth,
    searchQuery,
    setSearchQuery,
    notificationsCount 
  } = useApp();

  const t = translations[lang];
  const [time, setTime] = useState(new Date());
  const searchInputRef = useRef(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatLiveTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Formatting date
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateString = date.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', options);
    
    return `${dateString} | ${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className={`fixed top-0 right-0 left-64 h-20 z-20 flex items-center justify-between px-8 border-b transition-all duration-300
      ${isLowBandwidth 
        ? 'bg-[#0b0f19] border-[#1e293b]' 
        : 'bg-[#070b13]/60 backdrop-blur-md border-slate-900/60 shadow-[0_4px_30px_rgba(0,0,0,0.15)]'
      }`}
    >
      {/* Left: Greeting & Clock */}
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold text-slate-400 font-display">
          {t.goodMorning}
        </h2>
        <span className="text-[11px] font-mono text-teal-400 tracking-wider font-semibold mt-0.5">
          {formatLiveTime(time)}
        </span>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-xl mx-8 relative group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`w-full pl-11 pr-14 py-2.5 rounded-xl text-xs font-medium font-sans text-slate-200 outline-none border transition-all duration-200
            ${isLowBandwidth 
              ? 'bg-slate-900 border-slate-800 focus:border-slate-700' 
              : 'bg-slate-950/50 border-slate-900 focus:border-slate-800/80 focus:ring-1 focus:ring-teal-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
            }
          `}
        />
        {/* Floating helper for hotkey '/' */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-[9px] font-mono font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> /
          </span>
        </div>
      </div>

      {/* Right: Controls & Toggles */}
      <div className="flex items-center gap-4.5">
        {/* Notifications Count */}
        <button className={`relative p-2.5 rounded-xl border transition-all duration-200 hover:bg-slate-900/60
          ${isLowBandwidth ? 'border-slate-800 bg-slate-900' : 'border-slate-900 bg-slate-950/30'}`}
        >
          <Bell className="w-4.5 h-4.5 text-slate-400" />
          {notificationsCount > 0 && (
            <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold font-mono flex items-center justify-center border border-slate-950
              ${isLowBandwidth 
                ? 'bg-rose-600 text-white' 
                : 'bg-rose-500 text-white shadow-[0_0_8px_#f43f5e]'
              }`}
            >
              {notificationsCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-900/60" />

        {/* Low Bandwidth Toggle */}
        <button
          onClick={toggleLowBandwidth}
          title={isLowBandwidth ? t.highBandwidth : t.lowBandwidth}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold font-mono tracking-wider transition-all duration-200
            ${isLowBandwidth 
              ? 'border-teal-500 bg-teal-950/20 text-teal-400' 
              : 'border-slate-900 bg-slate-950/30 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
        >
          {isLowBandwidth ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          <span className="hidden xl:inline">{isLowBandwidth ? "LOW BW" : "STANDARD"}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all duration-200 hover:bg-slate-900/60
            ${isLowBandwidth ? 'border-slate-800 bg-slate-900' : 'border-slate-900 bg-slate-950/30'} text-slate-300`}
        >
          <Globe className="w-4 h-4 text-teal-500" />
          <span>{lang === 'en' ? 'EN' : 'HI'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className={`p-2.5 rounded-xl border transition-all duration-200 hover:bg-slate-900/60
            ${isLowBandwidth ? 'border-slate-800 bg-slate-900' : 'border-slate-900 bg-slate-950/30'} text-slate-400`}
        >
          {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-blue-400" />}
        </button>
      </div>
    </header>
  );
};
