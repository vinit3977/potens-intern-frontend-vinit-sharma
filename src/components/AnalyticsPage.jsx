import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  TrendingUp, 
  Activity, 
  Cpu, 
  Server, 
  Globe, 
  AlertCircle,
  FileSpreadsheet,
  Settings,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnalyticsPage = () => {
  const { 
    lang, 
    loadLevel, 
    setLoadLevel, 
    telemetryHistory, 
    isLowBandwidth 
  } = useApp();

  const isEnglish = lang === 'en';
  const t = translations[lang];

  // Local state for export download indicator
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('latency'); // 'latency' | 'throughput' | 'cpu'

  // Extract latest telemetry metrics
  const latest = telemetryHistory[telemetryHistory.length - 1] || { latency: 180, throughput: 45, cpu: 22, memory: 41 };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(isEnglish ? "Telemetry Log exported successfully as binary matrix CSV." : "टेलीमेट्री लॉग सफलतापूर्वक बाइनरी मैट्रिक्स सीएसवी के रूप में निर्यात किया गया।");
    }, 1500);
  };

  // Render a highly detailed SVG Area Chart
  const renderAreaChart = (history) => {
    const width = 500;
    const height = 180;
    const padding = 30;
    
    const latencies = history.map(h => h.latency);
    const maxVal = Math.max(...latencies, 600); // fixed ceiling to prevent layout resizing constantly
    const minVal = 0;
    const range = maxVal - minVal || 1;

    const points = history.map((entry, i) => {
      const x = padding + (i / (history.length - 1)) * (width - padding * 2);
      const y = height - padding - ((entry.latency - minVal) / range) * (height - padding * 2);
      return { x, y };
    });

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaData = `${pathData} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grids */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + ratio * (height - padding * 2);
          const gridVal = Math.round(maxVal - ratio * range);
          return (
            <g key={idx} className="font-mono text-[9px] fill-slate-600">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 255, 255, 0.04)" />
              <text x={padding - 8} y={y + 3} textAnchor="end">{gridVal}ms</text>
            </g>
          );
        })}

        {/* X axis ticks */}
        {points.map((p, idx) => (
          <line key={idx} x1={p.x} y1={height - padding} x2={p.x} y2={height - padding + 4} stroke="rgba(255,255,255,0.08)" />
        ))}

        {/* Area fill with gradients */}
        <path d={areaData} fill="url(#latencyGrad)" className="transition-all duration-300" />
        
        {/* Draw main line */}
        <path d={pathData} fill="none" stroke="#22d3ee" strokeWidth="2" className="transition-all duration-300" />
        
        {/* Interactive dots */}
        {points.map((p, idx) => (
          <g key={idx} className="group/dot cursor-pointer">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="3.5" 
              fill="#0b0f19" 
              stroke="#22d3ee" 
              strokeWidth="2" 
              className="hover:r-5 transition-all duration-150"
            />
          </g>
        ))}

        <defs>
          <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Render CPU vs Ingress SVG Bar Chart
  const renderBarChart = (history) => {
    const width = 500;
    const height = 180;
    const padding = 30;
    
    const maxVal = 100; // CPU capacity percentage
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;
    const barWidth = (innerWidth / history.length) - 6;

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Grids */}
        {[0, 25, 50, 75, 100].map((val, idx) => {
          const y = padding + (1 - val / 100) * innerHeight;
          return (
            <g key={idx} className="font-mono text-[9px] fill-slate-600">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 255, 255, 0.04)" />
              <text x={padding - 8} y={y + 3} textAnchor="end">{val}%</text>
            </g>
          );
        })}

        {/* Draw CPU bars */}
        {history.map((entry, i) => {
          const x = padding + i * (innerWidth / history.length) + 3;
          const barHeight = (entry.cpu / 100) * innerHeight;
          const y = height - padding - barHeight;

          return (
            <g key={i} className="group/bar">
              {/* Core bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="2"
                fill="url(#cpuBarGrad)"
                className="transition-all duration-300 hover:fill-teal-400 cursor-pointer"
              />
              {/* Dot overlay label */}
              <text 
                x={x + barWidth / 2} 
                y={y - 5} 
                textAnchor="middle" 
                className="font-mono text-[8px] fill-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150"
              >
                {entry.cpu}%
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="cpuBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Render a custom Line Chart with SLA threshold breaches
  const renderLineChart = (history) => {
    const width = 500;
    const height = 180;
    const padding = 30;

    const maxVal = 200; // Throughput TPS limit
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const points = history.map((entry, i) => {
      const x = padding + (i / (history.length - 1)) * innerWidth;
      const y = height - padding - (entry.throughput / maxVal) * innerHeight;
      return { x, y };
    });

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const slaY = height - padding - (120 / maxVal) * innerHeight; // SLA Alert trigger line at 120 TPS

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grids */}
        {[0, 50, 100, 150, 200].map((val, idx) => {
          const y = height - padding - (val / maxVal) * innerHeight;
          return (
            <g key={idx} className="font-mono text-[9px] fill-slate-600">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 255, 255, 0.04)" />
              <text x={padding - 8} y={y + 3} textAnchor="end">{val} TPS</text>
            </g>
          );
        })}

        {/* SLA warning boundary line */}
        <line x1={padding} y1={slaY} x2={width - padding} y2={slaY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-80" />
        <text x={width - padding - 5} y={slaY - 6} textAnchor="end" className="font-mono text-[8px] fill-rose-400 font-bold">
          {isEnglish ? "SLA BREACH LIMIT (120 TPS)" : "SLA उल्लंघन सीमा (120 TPS)"}
        </text>

        {/* Transaction path */}
        <path d={pathData} fill="none" stroke="#eab308" strokeWidth="2.5" className="transition-all duration-300" />

        {/* Plot dots */}
        {points.map((p, idx) => (
          <circle 
            key={idx} 
            cx={p.x} 
            cy={p.y} 
            r="3" 
            fill="#0b0f19" 
            stroke="#eab308" 
            strokeWidth="1.5" 
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header and Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-display flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-cyan-400 animate-pulse" />
            {isEnglish ? "Telemetry Grid Analytics" : "टेलीमेट्री ग्रिड विश्लेषण"}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
            {isEnglish 
              ? "Live diagnostic stream metrics, SLA queue latency, and database CPU core balance visualizers."
              : "लाइव डायग्नोस्टिक स्ट्रीम मेट्रिक्स, SLA कतार विलंबता, और डेटाबेस CPU कोर संतुलन विज़ुअलाइज़र।"}
          </p>
        </div>

        {/* Core Export trigger button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 border transition-all duration-200 cursor-pointer
            ${isExporting 
              ? 'bg-slate-800 border-slate-700 text-slate-500' 
              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:border-cyan-400'
            }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          {isExporting ? (isEnglish ? "EXPORTING LOGS..." : "लॉग्स निर्यात हो रहे हैं...") : (isEnglish ? "EXPORT TELEMETRY" : "टेलीमेट्री निर्यात करें")}
        </button>
      </div>

      {/* 2. Top Metric Ticking Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        {[
          { label: isEnglish ? "INGRESS LATENCY" : "प्रवेश विलंबता", value: `${latest.latency} ms`, desc: `~${latest.latency > 400 ? "CRITICAL" : latest.latency > 250 ? "WARNING" : "STABLE"}`, icon: Activity, color: latest.latency > 400 ? "text-rose-400 border-rose-500/20 bg-rose-500/5" : latest.latency > 250 ? "text-amber-400 border-amber-500/20 bg-amber-500/5" : "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" },
          { label: isEnglish ? "CORE THROUGHPUT" : "लेन-देन थ्रूपुट", value: `${latest.throughput} TPS`, desc: isEnglish ? "Live transactions" : "लाइव लेनदेन", icon: Globe, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
          { label: isEnglish ? "DATABASE CPU" : "डेटाबेस सीपीयू", value: `${latest.cpu}%`, desc: isEnglish ? "Load factor" : "लोड फैक्टर", icon: Cpu, color: latest.cpu > 80 ? "text-rose-400 border-rose-500/20 bg-rose-500/5" : "text-teal-400 border-teal-500/20 bg-teal-500/5" },
          { label: isEnglish ? "HOST MEMORY" : "होस्ट मेमोरी", value: `${latest.memory}%`, desc: "12.4GB Buffer", icon: Server, color: "text-slate-400 border-slate-800 bg-slate-950/20" },
          { label: isEnglish ? "SLAS COMPLETED" : "SLA अनुपालन", value: "99.98%", desc: isEnglish ? "24h standard" : "24 घंटे का मानक", icon: ShieldCheck, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between h-24 ${item.color}`}>
              <div className="flex items-center justify-between text-slate-500 font-bold text-[9px] tracking-wider uppercase">
                <span>{item.label}</span>
                <Icon className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div className="mt-1.5">
                <span className="text-lg font-bold text-slate-200 font-display block leading-none">{item.value}</span>
                <span className="text-[9px] text-slate-500 mt-1 block uppercase tracking-wide">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Operational Stress Simulator Panel */}
      <div className="p-5 rounded-2xl bg-slate-950/30 border border-slate-900/60 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-5 font-mono">
        <div className="space-y-1">
          <span className="text-[10px] text-cyan-400 font-extrabold tracking-widest block uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
            {isEnglish ? "SYSTEM STREAM TELEMETRY SIMULATOR" : "सिस्टम स्ट्रीम टेलीमेट्री सिम्युलेटर"}
          </span>
          <p className="text-xs text-slate-400 max-w-xl font-sans">
            {isEnglish 
              ? "Modify simulated infrastructure throughput load levels to stress test response loops and check dynamic telemetry flow."
              : "सिस्टम प्रतिक्रिया प्रतिक्रिया छोरों और टेलीमेट्री प्रवाह का तनाव परीक्षण करने के लिए थ्रूपुट स्तर को बदलें।"}
          </p>
        </div>

        {/* Load Selector Triggers */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          {[
            { level: 'normal', label: isEnglish ? 'NORMAL LOAD' : 'सामान्य लोड', color: 'border-cyan-500/20 text-cyan-400 bg-cyan-950/10 hover:bg-cyan-500/20' },
            { level: 'peak', label: isEnglish ? 'PEAK TRAFFIC' : 'पीक ट्रैफिक लोड', color: 'border-amber-500/20 text-amber-400 bg-amber-950/10 hover:bg-amber-500/20' },
            { level: 'stress', label: isEnglish ? 'STRESS SURGE' : 'तनाव परीक्षण सर्ज', color: 'border-rose-500/20 text-rose-400 bg-rose-950/10 hover:bg-rose-500/20 animate-pulse' }
          ].map((btn) => (
            <button
              key={btn.level}
              onClick={() => setLoadLevel(btn.level)}
              className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer
                ${loadLevel === btn.level
                  ? btn.level === 'stress' 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-extrabold'
                    : btn.level === 'peak'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-extrabold'
                      : 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-extrabold'
                  : 'bg-transparent border-slate-900 text-slate-500 hover:text-slate-300'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extreme Load Red Warnings */}
      <AnimatePresence>
        {loadLevel === 'stress' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 flex items-center gap-3 text-xs text-rose-400 font-mono"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
            <div>
              <strong className="uppercase">{isEnglish ? "WARNING: STRESS OVERRIDE DETECTED" : "चेतावनी: अत्यधिक लोड दर्ज"}</strong> — {isEnglish ? "Latency levels are nearing 550ms thresholds. SLA queue buffers are saturated." : "विलंबता स्तर 550ms सीमा के करीब है। SLA कतार बफ़र्स संतृप्त हैं।"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Detailed Charts Deck (2-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: API Latency */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
              {isEnglish ? "API INGRESS LATENCY INDEX (ms)" : "API प्रवेश विलंबता सूचकांक"}
            </h3>
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {isEnglish ? "Real-time updates" : "वास्तविक समय अपडेट"}
            </span>
          </div>
          <div className="h-44 flex items-end justify-center p-2.5 bg-slate-950/40 rounded-xl border border-slate-900/40">
            {renderAreaChart(telemetryHistory)}
          </div>
        </div>

        {/* Chart B: SLA Limits */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-bold tracking-widest text-yellow-500 uppercase">
              {isEnglish ? "TRANSACTION THROUGHPUT RATE (TPS)" : "लेन-देन थ्रूपुट दर (TPS)"}
            </h3>
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase font-semibold">
              <Activity className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              {isEnglish ? "Throughput telemetry" : "थ्रूपुट टेलीमेट्री"}
            </span>
          </div>
          <div className="h-44 flex items-end justify-center p-2.5 bg-slate-950/40 rounded-xl border border-slate-900/40">
            {renderLineChart(telemetryHistory)}
          </div>
        </div>

        {/* Chart C: CPU Load Balance */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-bold tracking-widest text-teal-400 uppercase">
              {isEnglish ? "HOST CPU NODE CAPACITIES (%)" : "होस्ट सीपीयू नोड क्षमता (%)"}
            </h3>
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase font-semibold">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              {isEnglish ? "Node Core Load Factor" : "नोड कोर लोड फैक्टर"}
            </span>
          </div>
          <div className="h-44 flex items-end justify-center p-2.5 bg-slate-950/40 rounded-xl border border-slate-900/40">
            {renderBarChart(telemetryHistory)}
          </div>
        </div>
      </div>
    </div>
  );
};
