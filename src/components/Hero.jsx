import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  FileCheck, 
  Activity, 
  DollarSign, 
  Percent, 
  Radio 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Premium high-fidelity requestAnimationFrame counter
const AnimatedCounter = ({ value, duration = 1000, prefix = "", suffix = "", decimals = 0, isLowBandwidth }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLowBandwidth) {
      setCount(value);
      return;
    }

    let start = 0;
    const end = parseFloat(value);
    const range = end - start;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setCount(start + range * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isLowBandwidth]);

  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};

export const Hero = () => {
  const { lang, actionItems, isLowBandwidth } = useApp();
  const t = translations[lang];

  // Derive dynamic stats
  const pendingApprovalsCount = actionItems.filter(item => item.status === 'PENDING').length;
  const activeIncidentsCount = 3;
  const todayRevenueImpact = 142850;
  const slaCompliancePercent = 99.98;

  const kpiData = [
    {
      id: 'pending',
      title: t.kpiPendingApprovals,
      value: pendingApprovalsCount,
      decimals: 0,
      icon: FileCheck,
      colorClass: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      glowColor: 'rgba(59, 130, 246, 0.1)',
      prefix: '',
      suffix: ''
    },
    {
      id: 'incidents',
      title: t.kpiActiveIncidents,
      value: activeIncidentsCount,
      decimals: 0,
      icon: Activity,
      colorClass: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      glowColor: 'rgba(244, 63, 94, 0.1)',
      prefix: '',
      suffix: ''
    },
    {
      id: 'revenue',
      title: t.kpiRevenueImpact,
      value: todayRevenueImpact,
      decimals: 0,
      icon: DollarSign,
      colorClass: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      glowColor: 'rgba(16, 185, 129, 0.1)',
      prefix: '$',
      suffix: ''
    },
    {
      id: 'sla',
      title: t.kpiSlaCompliance,
      value: slaCompliancePercent,
      decimals: 2,
      icon: Percent,
      colorClass: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      glowColor: 'rgba(245, 158, 11, 0.1)',
      prefix: '',
      suffix: '%'
    }
  ];

  // Framer Motion staggered grid animation config
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      {/* Hero Headline Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 font-display">
            {t.commandCenter}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl font-sans">
            {t.heroSubtext}
          </p>
        </div>

        {/* Live Operational Status Badge */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all duration-300
          ${pendingApprovalsCount > 0 
            ? 'border-teal-500/20 bg-teal-950/10 text-teal-400' 
            : 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400'
          }`}
        >
          <div className="relative flex h-2 w-2">
            {!isLowBandwidth && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                ${pendingApprovalsCount > 0 ? 'bg-teal-400' : 'bg-emerald-400'}`} 
              />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 
              ${pendingApprovalsCount > 0 ? 'bg-teal-500' : 'bg-emerald-500'}`} 
            />
          </div>
          <span>
            {pendingApprovalsCount > 0 
              ? t.liveStatusActive 
              : t.liveStatusActive
            }
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {isLowBandwidth ? (
        // Plain Grid for Low Bandwidth Mode
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-32"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold tracking-wider font-mono uppercase">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-xl border ${kpi.colorClass}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-display text-slate-100 mt-2">
                  <AnimatedCounter
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.decimals}
                    isLowBandwidth={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Framer Motion Animated Grid for Standard Mode
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.id}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="relative bg-slate-950/40 border border-slate-900/60 rounded-2xl p-5 flex flex-col justify-between h-32 overflow-hidden transition-all duration-300 hover:border-slate-800/80 hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)] group"
                style={{
                  boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.02), 0 4px 20px rgba(0, 0, 0, 0.2)`
                }}
              >
                {/* Subtle internal glowing backdrop */}
                <div 
                  className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: kpi.glowColor }}
                />

                <div className="flex items-center justify-between text-slate-400 z-10">
                  <span className="text-[10px] font-bold tracking-widest font-mono uppercase text-slate-500 group-hover:text-slate-300 transition-colors">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-xl border transition-all duration-300 group-hover:scale-105 ${kpi.colorClass}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                
                <div className="text-2xl font-extrabold font-display text-slate-100 mt-2 z-10 tracking-tight flex items-baseline">
                  <AnimatedCounter
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.decimals}
                    isLowBandwidth={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
