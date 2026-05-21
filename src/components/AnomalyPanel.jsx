import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, anomalyTranslations } from '../data/translations';
import { mockAnomalies } from '../data/mockData';
import { 
  AlertTriangle, 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Percent, 
  TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium dynamic SVG sparkline charts
const Sparkline = ({ points, isCritical, isLowBandwidth }) => {
  if (isLowBandwidth) return null;

  const width = 100;
  const height = 24;
  const padding = 2;

  const maxX = points.length - 1;
  const minY = Math.min(...points);
  const maxY = Math.max(...points);

  const coordinates = points.map((val, index) => {
    const x = padding + (index / maxX) * (width - padding * 2);
    const y = padding + (1 - (val - minY) / (maxY - minY || 1)) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${coordinates.join(' L ')}`;
  const strokeColor = isCritical ? '#ef4444' : '#f59e0b';

  return (
    <div className="flex items-center">
      <svg width={width} height={height} className="overflow-visible opacity-80">
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pulsing indicator dot on last node */}
        {coordinates.length > 0 && (
          <circle
            cx={coordinates[coordinates.length - 1].split(',')[0]}
            cy={coordinates[coordinates.length - 1].split(',')[1]}
            r="2"
            fill={strokeColor}
          />
        )}
      </svg>
    </div>
  );
};

export const AnomalyPanel = () => {
  const { lang, isLowBandwidth } = useApp();
  const t = translations[lang];

  // Keep track of which anomaly card is expanded
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSeverityBadge = (severity) => {
    const configs = {
      CRITICAL: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      WARNING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      MINOR: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    };
    return configs[severity] || configs.MINOR;
  };

  const getStatusBadge = (status) => {
    const configs = {
      UNRESOLVED: 'text-rose-400 border-rose-500/35 bg-rose-950/10',
      INVESTIGATING: 'text-amber-400 border-amber-500/35 bg-amber-950/10',
      MONITORING: 'text-blue-400 border-blue-500/35 bg-blue-950/10',
      RESOLVED: 'text-emerald-400 border-emerald-500/35 bg-emerald-950/10'
    };
    return configs[status] || configs.MONITORING;
  };

  const getSeverityLabel = (severity) => {
    if (lang === 'hi') {
      const labels = { CRITICAL: 'अति-गंभीर', WARNING: 'चेतावनी', MINOR: 'लघु' };
      return labels[severity] || severity;
    }
    return severity;
  };

  const getStatusLabel = (status) => {
    if (lang === 'hi') {
      const labels = {
        UNRESOLVED: t.unresolved,
        INVESTIGATING: t.investigating,
        MONITORING: t.monitoring,
        RESOLVED: t.resolved
      };
      return labels[status] || status;
    }
    return status;
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300
      ${isLowBandwidth 
        ? 'bg-[#0c1222] border-slate-800' 
        : 'bg-[#0c1222]/40 backdrop-blur-md border-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-glow-blue/5'
      }`}
    >
      {/* Title */}
      <div className="flex items-center gap-2 pb-5 border-b border-slate-900/60">
        <BrainCircuit className="w-5 h-5 text-teal-400" />
        <div>
          <h2 className="text-base font-bold text-slate-100 font-display">
            {t.anomalyHeader}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 font-sans">
            {t.anomalySubtext}
          </p>
        </div>
      </div>

      {/* Grid of Anomalies */}
      <div className="mt-5 space-y-4">
        {mockAnomalies.map((anomaly) => {
          const isExpanded = !!expandedIds[anomaly.id];
          const isCritical = anomaly.severity === 'CRITICAL';
          const detailedAnalysis = anomalyTranslations[lang][anomaly.id] || anomaly.details;

          return (
            <div
              key={anomaly.id}
              onClick={() => toggleExpand(anomaly.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${isLowBandwidth 
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                  : `bg-[#090e1a]/30 hover:border-slate-800/80
                     ${isCritical 
                       ? 'border-slate-900 hover:shadow-[0_0_12px_rgba(239,68,68,0.03)]' 
                       : 'border-slate-900'
                     }`
                }`}
            >
              {/* Row content */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Area: System name & confidence */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Severity Badge */}
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${getSeverityBadge(anomaly.severity)}`}>
                      {getSeverityLabel(anomaly.severity)}
                    </span>
                    {/* System Name */}
                    <h3 className="text-xs font-bold text-slate-200 tracking-wide font-display flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-slate-500" />
                      {anomaly.system}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3.5 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1 font-semibold text-teal-400/80">
                      <Percent className="w-3 h-3 text-teal-500" />
                      {anomaly.confidence}% {t.confidence}
                    </span>
                    <span className="text-slate-700">|</span>
                    <span>
                      {t.detected}: {anomaly.time}
                    </span>
                  </div>
                </div>

                {/* Right Area: Sparkline, Status, Toggle */}
                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
                  {/* Custom Sparkline Graph */}
                  <Sparkline 
                    points={anomaly.trend} 
                    isCritical={isCritical} 
                    isLowBandwidth={isLowBandwidth} 
                  />

                  {/* Status Tag */}
                  <span className={`text-[9px] font-bold font-mono px-2.5 py-1 rounded-full border ${getStatusBadge(anomaly.status)}`}>
                    {getStatusLabel(anomaly.status)}
                  </span>

                  {/* Toggle Arrow */}
                  <div className="text-slate-500 hover:text-slate-350 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details Panel */}
              {isLowBandwidth ? (
                // Flat layout without animations
                isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed bg-slate-950/20 p-3 rounded-lg">
                    <div className="text-teal-400 font-bold uppercase tracking-widest text-[9px] mb-1 font-sans">
                      SYSTEM ANALYSIS
                    </div>
                    {detailedAnalysis}
                  </div>
                )
              ) : (
                // Smooth height animation inside Framer motion
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } } }}
                      exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.2 }, opacity: { duration: 0.1 } } }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400 font-mono leading-relaxed bg-[#05080e]/40 p-3.5 rounded-lg border border-slate-950/80">
                        <div className="text-teal-500 font-bold uppercase tracking-widest text-[9px] mb-1 flex items-center gap-1.5 font-sans">
                          <TrendingUp className="w-3.5 h-3.5" />
                          NEURAL INFERENCE LOGS
                        </div>
                        {detailedAnalysis}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
