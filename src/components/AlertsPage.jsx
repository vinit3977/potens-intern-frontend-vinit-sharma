import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, anomalyTranslations } from '../data/translations';
import { 
  AlertTriangle, 
  Terminal, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Radio, 
  RotateCcw,
  Zap,
  Play,
  VolumeX,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertsPage = () => {
  const { 
    lang, 
    anomalies, 
    addAnomaly, 
    resolveAnomaly, 
    setAnomalyStatus, 
    isLowBandwidth 
  } = useApp();

  const isEnglish = lang === 'en';
  const t = translations[lang];

  // Local state for active/selected anomaly
  const [selectedAnomalyId, setSelectedAnomalyId] = useState(anomalies[0]?.id || 1);
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'MINOR'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNRESOLVED' | 'RESOLVED' | 'INVESTIGATING'

  const activeAnomaly = anomalies.find(a => a.id === selectedAnomalyId) || anomalies[0];

  const getSeverityColor = (s) => {
    switch (s) {
      case 'CRITICAL': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'WARNING': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'RESOLVED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      case 'INVESTIGATING': return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
      case 'MONITORING': return 'text-teal-400 border-teal-500/30 bg-teal-500/5';
      default: return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
    }
  };

  const filteredAnomalies = anomalies.filter(a => {
    const matchesSeverity = severityFilter === 'ALL' ? true : a.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' ? true : a.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  // Simulated Alert generators
  const triggerSimulation = () => {
    const systems = [
      "Stripe Webhook Gateway",
      "Elasticsearch Cluster Host-04",
      "Redis Cluster Node-2 (Cache)",
      "AWS S3 Premium Assets Bucket",
      "Kubernetes Core Pod Ingress"
    ];
    const details = [
      "Ingress webhook queue exceeded threshold with 2500+ items lagging. Rate limits triggered.",
      "JVM garbage collection paused for 8.4s, blocking active indexes updates.",
      "Memory saturation at 98.4%. Eviction policy triggered on active user sessions cache.",
      "Sudden burst of PUT requests exceeding quota by 350%, triggering emergency asset throttle.",
      "Out of memory error in namespace payments-prod. Horizontal Pod Autoscaler failed."
    ];
    const severities = ["CRITICAL", "WARNING", "WARNING"];
    const idx = Math.floor(Math.random() * systems.length);

    addAnomaly({
      system: systems[idx],
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: parseFloat((85 + Math.random() * 14).toFixed(1)),
      details: details[idx]
    });
  };

  // Render inline custom SVG sparkline for trend visualization
  const renderTrendSVG = (trend) => {
    if (!trend || trend.length === 0) return null;
    const width = 340;
    const height = 110;
    const maxVal = Math.max(...trend);
    const minVal = Math.min(...trend);
    const range = maxVal - minVal || 1;
    
    // Convert points to coordinates
    const points = trend.map((val, index) => {
      const x = (index / (trend.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 20) - 10;
      return { x, y };
    });

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaData = `${pathData} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Draw grids */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
        <line x1="0" y1={height - 10} x2={width} y2={height - 10} stroke="rgba(255,255,255,0.05)" />
        
        {/* Area fill */}
        <path d={areaData} fill="url(#alertGlow)" className="transition-all duration-300" />
        {/* Plot line */}
        <path d={pathData} fill="none" stroke="#f43f5e" strokeWidth="2.5" className="transition-all duration-300" />
        
        {/* Draw dots */}
        {points.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r={i === points.length - 1 ? "5" : "3"} 
            fill={i === points.length - 1 ? "#f43f5e" : "#0f172a"} 
            stroke="#f43f5e" 
            strokeWidth="1.5" 
          />
        ))}

        <defs>
          <linearGradient id="alertGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const getTranslatedDetails = (anomaly) => {
    if (!anomaly) return "";
    // If it's one of the mock items, translate it
    if (anomaly.id <= 4) {
      return anomalyTranslations[lang][anomaly.id];
    }
    // Otherwise fallback to existing details
    return anomaly.details;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-display flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />
            {isEnglish ? "Cybernetic Incident Deck" : "साइबरनेटिक घटना डेक"}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
            {isEnglish 
              ? "Deep neural telemetry monitoring, real-time intrusion flags, and threat mitigation consoles."
              : "गहरी तंत्रिका टेलीमेट्री निगरानी, वास्तविक समय घुसपैठ झंडे, और खतरा न्यूनीकरण कंसोल।"}
          </p>
        </div>

        {/* Action simulators */}
        <button
          onClick={triggerSimulation}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 border transition-all duration-200 cursor-pointer
            ${isLowBandwidth
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:border-rose-500'
            }`}
        >
          <Zap className="w-4 h-4 text-rose-400 animate-bounce group-hover:scale-110" />
          {isEnglish ? "SIMULATE ANOMALY" : "विसंगति का अनुकरण करें"}
        </button>
      </div>

      {/* 2. Main Workstation Panel (Split Left-Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Alerts list (2/5 columns) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters block */}
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 backdrop-blur-md space-y-3 font-mono">
            {/* Severity Filter Row */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold">{isEnglish ? "SEVERITY LEVEL:" : "गंभीरता स्तर:"}</span>
              <div className="flex gap-1 text-[9px]">
                {['ALL', 'CRITICAL', 'WARNING'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer
                      ${severityFilter === sev
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 font-bold'
                        : 'border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter Row */}
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-900/60">
              <span className="text-slate-500 font-bold">{isEnglish ? "STATUS FILTER:" : "स्थिति फ़िल्टर:"}</span>
              <div className="flex gap-1 text-[9px]">
                {['ALL', 'UNRESOLVED', 'INVESTIGATING', 'RESOLVED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer
                      ${statusFilter === st
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-400 font-bold'
                        : 'border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    {st === 'ALL' ? 'ALL' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrolling Alert Cards */}
          <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-style">
            <AnimatePresence mode="popLayout">
              {filteredAnomalies.length > 0 ? (
                filteredAnomalies.map((anom) => (
                  <motion.div
                    key={anom.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setSelectedAnomalyId(anom.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group
                      ${anom.id === selectedAnomalyId 
                        ? 'bg-slate-900/50 border-slate-700/80 shadow-[inset_0_0_12px_rgba(244,63,94,0.05)]' 
                        : 'bg-slate-950/20 border-slate-900 hover:border-slate-850 hover:bg-slate-900/15'
                      }`}
                  >
                    {/* Active highlight side tag */}
                    {anom.id === selectedAnomalyId && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                    )}

                    <div className="flex items-center justify-between text-[9px] font-mono font-bold mb-2">
                      <span className={`px-2 py-0.5 rounded border ${getSeverityColor(anom.severity)}`}>
                        {anom.severity}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {anom.time}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 font-display line-clamp-1 mb-1 group-hover:text-slate-100">
                      {anom.system}
                    </h4>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-900/60 font-mono text-[9px]">
                      <span className="text-slate-500 font-semibold uppercase">{isEnglish ? "CONF:" : "विश्वास:"} <strong className="text-slate-400">{anom.confidence}%</strong></span>
                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${getStatusColor(anom.status)}`}>
                        {anom.status === 'UNRESOLVED' ? t.unresolved : anom.status === 'INVESTIGATING' ? t.investigating : anom.status === 'MONITORING' ? t.monitoring : t.resolved}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center rounded-xl border border-slate-900 bg-slate-950/20 text-slate-500 font-mono text-[10px]">
                  <VolumeX className="w-8 h-8 opacity-25 mx-auto mb-2 text-rose-500" />
                  {isEnglish ? "NO MATCHING SYSTEM BREACHES" : "कोई मिलान सिस्टम उल्लंघन नहीं"}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Deep Diagnostic Console (3/5 columns) */}
        <div className="lg:col-span-3">
          {activeAnomaly ? (
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-6 relative overflow-hidden flex flex-col h-full min-h-[500px]">
              
              {/* Header stats of selected alert */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-5 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-rose-400 font-mono font-bold tracking-widest block uppercase">
                    {isEnglish ? "DIAGNOSTIC DECK OVERRIDE CORE" : "नैदानिक डेक ओवरराइड कोर"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100 font-display">
                    {activeAnomaly.system}
                  </h3>
                </div>

                <div className="flex gap-2 font-mono text-[10px]">
                  <span className={`px-2.5 py-1 rounded-md border font-extrabold ${getSeverityColor(activeAnomaly.severity)}`}>
                    {activeAnomaly.severity}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md border font-extrabold ${getStatusColor(activeAnomaly.status)}`}>
                    {activeAnomaly.status}
                  </span>
                </div>
              </div>

              {/* Confidence analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="p-3.5 rounded-xl border border-slate-900/80 bg-slate-950/40">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">{isEnglish ? "PARSING CONFIDENCE" : "पार्सिंग विश्वसनीयता"}</span>
                  <span className="text-xl font-bold font-display text-emerald-400 block mt-1">{activeAnomaly.confidence}%</span>
                  {/* Neural line progress */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${activeAnomaly.confidence}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-900/80 bg-slate-950/40">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">{isEnglish ? "ALERT TIMING" : "अलर्ट का समय"}</span>
                  <span className="text-sm font-bold text-slate-300 block mt-2.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {activeAnomaly.time}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-900/80 bg-slate-950/40">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">{isEnglish ? "AUTO-ROUTING GATE" : "ऑटो-रूटिंग गेट"}</span>
                  <span className="text-[10px] font-bold text-teal-400 block mt-2.5 uppercase tracking-wide">
                    {activeAnomaly.severity === 'CRITICAL' ? "LEVEL-1 SEC OPS" : "LEVEL-2 DEV TEAM"}
                  </span>
                </div>
              </div>

              {/* Deep Analysis description */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 tracking-wider font-mono uppercase">
                  {isEnglish ? "DEEP INTRUSION ANALYSIS SUMMARY" : "गहन घुसपैठ विश्लेषण सारांश"}
                </h4>
                <div className="p-4 rounded-xl border border-slate-900 bg-[#03060b] text-slate-300 font-sans text-xs leading-relaxed">
                  {getTranslatedDetails(activeAnomaly)}
                </div>
              </div>

              {/* Metric Trend visualization (SVG Sparkline) */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 tracking-wider font-mono uppercase flex items-center justify-between">
                  <span>{isEnglish ? "METRIC TELEMETRY GRAPH" : "टेलीमेट्री मीट्रिक ग्राफ़"}</span>
                  <span className="text-[9px] text-rose-500 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    {isEnglish ? "LATENCY OVERRIDE (7 TICK TREND)" : "विलंबता ओवरराइड (7 टिक प्रवृत्ति)"}
                  </span>
                </h4>
                <div className="h-28 rounded-xl border border-slate-900 bg-[#03060b]/40 flex items-end p-2 justify-center">
                  {renderTrendSVG(activeAnomaly.trend)}
                </div>
              </div>

              {/* Terminal Logs Simulation snippet */}
              <div className="space-y-2 flex-1 flex flex-col">
                <h4 className="text-[10px] font-bold text-slate-500 tracking-wider font-mono uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  {isEnglish ? "LIVE TELEMETRY SHELL LOGS" : "लाइव टेलीमेट्री शेल लॉग"}
                </h4>
                <pre className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/80 font-mono text-[9px] text-rose-400/90 leading-relaxed overflow-x-auto overflow-y-hidden max-h-24">
                  {`[INFO] ${activeAnomaly.time} Routing diagnostic probe to root socket...\n`}
                  {`[WARN] Target queue buffer full. Ingress lagging behind.\n`}
                  {`[FAIL] ${activeAnomaly.system} status breach. Confidence threshold hit at ${activeAnomaly.confidence}%!\n`}
                  {`[SYSTEM] Mitigate sequence active. Waiting for manual cockpit signal.`}
                </pre>
              </div>

              {/* Interactive Mitigate Trigger controls */}
              <div className="pt-4 border-t border-slate-900 flex flex-wrap gap-2.5 items-center justify-end font-mono">
                {activeAnomaly.status !== 'RESOLVED' && (
                  <>
                    <button
                      onClick={() => setAnomalyStatus(activeAnomaly.id, 'INVESTIGATING')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer
                        ${activeAnomaly.status === 'INVESTIGATING'
                          ? 'bg-amber-600/10 border-amber-500/40 text-amber-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                      {isEnglish ? "INVESTIGATE" : "जांच शुरू करें"}
                    </button>
                    <button
                      onClick={() => setAnomalyStatus(activeAnomaly.id, 'MONITORING')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer
                        ${activeAnomaly.status === 'MONITORING'
                          ? 'bg-teal-600/10 border-teal-500/40 text-teal-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                      {isEnglish ? "MONITOR INCIDENT" : "घटना की निगरानी"}
                    </button>
                    <button
                      onClick={() => resolveAnomaly(activeAnomaly.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isEnglish ? "RESOLVE INCIDENT" : "घटना का समाधान करें"}
                    </button>
                  </>
                )}
                
                {activeAnomaly.status === 'RESOLVED' && (
                  <div className="text-emerald-400 text-xs font-extrabold flex items-center gap-2 py-2">
                    <CheckCircle className="w-4.5 h-4.5" />
                    {isEnglish ? "THREAT MITIGATED & SHUT DOWN" : "खतरे का समाधान कर दिया गया है"}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="py-24 text-center rounded-2xl border border-slate-900/60 bg-slate-950/20 text-slate-500 font-mono text-xs max-w-md mx-auto">
              <ShieldAlert className="w-12 h-12 text-rose-500/20 mx-auto mb-3" />
              {isEnglish ? "SELECT AN INCIDENT TO OPEN DIAGNOSTICS CONSOLE" : "नैदानिक कंसोल खोलने के लिए एक घटना का चयन करें"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
