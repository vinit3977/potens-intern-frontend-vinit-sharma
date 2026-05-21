import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  Zap, 
  TrendingDown, 
  Users, 
  Hourglass,
  Activity
} from 'lucide-react';

export const TickingCounter = () => {
  const { lang, isLowBandwidth } = useApp();
  const t = translations[lang];

  // Base state values
  const [transactions, setTransactions] = useState(24859384);
  const [revenueLoss, setRevenueLoss] = useState(3842.10);
  const [activeUsers, setActiveUsers] = useState(9482);
  
  // SLA breach countdown state: 14 mins, 20 secs base
  const [slaSeconds, setSlaSeconds] = useState(860); 

  // Pulse animation states for flashes
  const [txFlash, setTxFlash] = useState(false);
  const [revFlash, setRevFlash] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Transaction ticks up by 8-28 every second
      const txDelta = Math.floor(Math.random() * 20) + 8;
      setTransactions(prev => prev + txDelta);
      if (!isLowBandwidth) {
        setTxFlash(true);
        setTimeout(() => setTxFlash(false), 300);
      }

      // 2. Revenue leakage ticks up by $1.85 every second
      setRevenueLoss(prev => prev + 1.85);
      if (!isLowBandwidth) {
        setRevFlash(true);
        setTimeout(() => setRevFlash(false), 300);
      }

      // 3. Active users fluctuates slightly (-3 to +3)
      setActiveUsers(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return prev + delta;
      });

      // 4. SLA Countdown ticks down by 1s
      setSlaSeconds(prev => {
        if (prev <= 1) return 900; // Reset after 15 mins
        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(timer);
  }, [isLowBandwidth]);

  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300
      ${isLowBandwidth 
        ? 'bg-[#0c1222] border-slate-800' 
        : 'bg-[#0c1222]/40 backdrop-blur-md border-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-glow-blue/5'
      }`}
    >
      {/* Title block */}
      <div className="flex items-center gap-2 pb-5 border-b border-slate-900/60">
        <Activity className="w-5 h-5 text-teal-400" />
        <div>
          <h2 className="text-base font-bold text-slate-100 font-display">
            {t.liveTickerTitle}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 font-sans">
            Global real-time data streaming pipeline.
          </p>
        </div>
      </div>

      {/* Counter Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Live Transactions */}
        <div className="bg-slate-950/20 border border-slate-900/50 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">
              {t.throughput.toUpperCase()}
            </span>
            <span className={`text-lg font-bold font-mono text-slate-200 tracking-tight transition-all duration-300 block
              ${txFlash ? 'text-teal-400 scale-[1.02] filter drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]' : ''}`}
            >
              {transactions.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/5 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Zap className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 2: Est. Revenue Loss */}
        <div className="bg-slate-950/20 border border-slate-900/50 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">
              {t.revenueLossMin.toUpperCase()}
            </span>
            <span className={`text-lg font-bold font-mono text-slate-200 tracking-tight transition-all duration-300 block
              ${revFlash ? 'text-rose-400 scale-[1.02] filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : ''}`}
            >
              ${revenueLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 3: Active Operators Online */}
        <div className="bg-slate-950/20 border border-slate-900/50 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">
              OPERATORS CONNECTED
            </span>
            <span className="text-lg font-bold font-mono text-slate-200 tracking-tight block">
              {activeUsers.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 4: SLA Countdown */}
        <div className="bg-slate-950/20 border border-slate-900/50 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">
              {t.slaCountdown.toUpperCase()}
            </span>
            <span className={`text-lg font-bold font-mono text-slate-200 tracking-tight block
              ${slaSeconds < 180 ? 'text-rose-400 font-semibold animate-pulse' : 'text-amber-400'}`}
            >
              {formatCountdown(slaSeconds)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Hourglass className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
