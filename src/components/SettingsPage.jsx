import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  Settings, 
  Sliders, 
  Palette, 
  HelpCircle, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  Volume2,
  Terminal,
  Globe,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsPage = () => {
  const { 
    lang, 
    setLang,
    isLowBandwidth, 
    setIsLowBandwidth, 
    accentColor, 
    setAccentColor, 
    resetAllState 
  } = useApp();

  const isEnglish = lang === 'en';
  const t = translations[lang];

  // Local settings options states
  const [refreshRate, setRefreshRate] = useState(1.5);
  const [queueCapacity, setQueueCapacity] = useState(5000);
  const [gridOverlay, setGridOverlay] = useState(true);
  
  // Simulated terminal reboot loader
  const [isResetting, setIsResetting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const handleAccentChange = (color) => {
    setAccentColor(color);
  };

  // Run the premium terminal factory reset sequence simulation
  const handleFactoryReset = () => {
    setIsResetting(true);
    setTerminalLogs(["[CORE] AETHER CORES RESET DESTRUCT INITIATED..."]);

    const steps = [
      { delay: 400, text: "[CORE] Disconnecting telemetry pipelines: 4 active grids..." },
      { delay: 800, text: "[CORE] Erasing action items registry database cache... OK" },
      { delay: 1200, text: "[CORE] Purging simulated incident ingress queues... OK" },
      { delay: 1600, text: "[CORE] Reloading dictionary configurations & translation maps... OK" },
      { delay: 2000, text: "[CORE] Re-synchronizing global clock and SLA Breach window timers..." },
      { delay: 2400, text: "[CORE] Boot successful. Cockpit core restored to factory default." }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, step.text]);
      }, step.delay);
    });

    setTimeout(() => {
      resetAllState();
      setIsResetting(false);
      setTerminalLogs([]);
    }, 2800);
  };

  const accentColorsList = [
    { name: 'cyan', label: 'Neon Cyan', colorClass: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)] text-cyan-500' },
    { name: 'rose', label: 'Crimson Rose', colorClass: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] text-rose-500' },
    { name: 'emerald', label: 'Emerald Matrix', colorClass: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] text-emerald-500' },
    { name: 'gold', label: 'Gold Warp', colorClass: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] text-amber-500' }
  ];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isResetting ? (
          <motion.div
            key="settings-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* 1. Header */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-display flex items-center gap-2.5">
                <Settings className="w-6 h-6 text-indigo-400" />
                {isEnglish ? "Cockpit Parameters Control" : "कॉकपिट पैरामीटर नियंत्रण"}
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
                {isEnglish 
                  ? "Configure workspace layouts, metric refresh timers, language overlays, and threat thresholds."
                  : "कार्यक्षेत्र लेआउट, मीट्रिक ताज़ा टाइमर, भाषा ओवरले, और खतरा थ्रेसहोल्ड कॉन्फ़िगर करें।"}
              </p>
            </div>

            {/* 2. Parameters Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Box A: Workstation Parameters */}
              <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-5">
                <h3 className="text-xs font-bold tracking-widest text-indigo-400 font-mono uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  {isEnglish ? "WORKSTATION METRIC SPEEDS" : "कार्यक्षेत्र मीट्रिक गति"}
                </h3>

                {/* Telemetry Refresh Slider */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-400 font-bold text-[10px]">
                    <span>{isEnglish ? "METRICS TICK RATE" : "मीट्रिक टिक दर"}</span>
                    <span className="text-indigo-400">{refreshRate} {isEnglish ? "Seconds" : "सेकंड"}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.5"
                    value={refreshRate}
                    onChange={(e) => setRefreshRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                    {isEnglish 
                      ? "Sets the rate at which live diagnostic data is simulated and plotted on charts."
                      : "यह उस दर को निर्धारित करता है जिस पर लाइव नैदानिक ​​डेटा का अनुकरण किया जाता है।"}
                  </p>
                </div>

                {/* Max Queue capacity Input */}
                <div className="space-y-2 font-mono text-xs pt-3 border-t border-slate-900">
                  <div className="flex justify-between text-slate-400 font-bold text-[10px]">
                    <span>{isEnglish ? "MAX INGRESS QUEUE LIMIT" : "अधिकतम प्रवेश कतार सीमा"}</span>
                    <span className="text-indigo-400">{queueCapacity.toLocaleString()} Req/s</span>
                  </div>
                  <input
                    type="number"
                    value={queueCapacity}
                    onChange={(e) => setQueueCapacity(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#03060c] border border-slate-900 hover:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                    {isEnglish 
                      ? "Sets maximum capacity threshold limit. Exceeding triggers alarm alerts."
                      : "अधिकतम क्षमता सीमा निर्धारित करता है। अधिक होने पर अलार्म ट्रिगर होता है।"}
                  </p>
                </div>
              </div>

              {/* Box B: Display Aesthetics and Themes */}
              <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-5">
                <h3 className="text-xs font-bold tracking-widest text-indigo-400 font-mono uppercase flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {isEnglish ? "WORKSPACE DISPLAY AESTHETICS" : "कार्यक्षेत्र प्रदर्शन सौंदर्यशास्त्र"}
                </h3>

                {/* Theme selection accent schemes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block uppercase">
                    {isEnglish ? "ACCENT COLOR SIGNALS" : "एक्सेंट रंग संकेत"}
                  </label>
                  <div className="flex flex-wrap gap-2.5 font-mono text-[10px] font-bold">
                    {accentColorsList.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleAccentChange(color.name)}
                        className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2
                          ${accentColor === color.name
                            ? 'bg-slate-900 border-slate-700 text-slate-200 font-extrabold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                            : 'bg-transparent border-slate-900 text-slate-500 hover:text-slate-300'
                          }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${color.colorClass}`} />
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optimizations and overlay switch toggles */}
                <div className="space-y-3 pt-3 border-t border-slate-900 font-mono text-[10px] text-slate-400">
                  {/* Language switch */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 uppercase font-bold text-slate-500">
                      <Globe className="w-4 h-4 text-slate-600" />
                      {isEnglish ? "LOCALE DICTIONARY OVERLAY" : "स्थानीय शब्दकोश ओवरले"}
                    </span>
                    <button
                      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                      className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#03060c] text-indigo-400 font-bold hover:bg-slate-900 transition-colors"
                    >
                      {lang === 'en' ? "ENGLISH (EN)" : "हिंदी (HI)"}
                    </button>
                  </div>

                  {/* Low bandwidth switch */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 uppercase font-bold text-slate-500">
                      <Gauge className="w-4 h-4 text-slate-600" />
                      {isEnglish ? "BANDWIDTH THREAD OVERRIDE" : "बैंडविड्थ थ्रेड ओवरराइड"}
                    </span>
                    <button
                      onClick={() => setIsLowBandwidth(!isLowBandwidth)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors font-bold cursor-pointer
                        ${isLowBandwidth 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}
                    >
                      {isLowBandwidth ? "LOW BANDWIDTH" : "STANDARD DATA"}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Box C: Emergency Override System Destruct */}
            <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-950/5 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
              {/* Neon warnings decorations */}
              {!isLowBandwidth && (
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-rose-500/2 rounded-l-full blur-xl opacity-30 pointer-events-none" />
              )}
              
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-rose-400 font-extrabold tracking-widest block uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                  {isEnglish ? "EMERGENCY SYSTEM OVERRIDE CORE" : "आपातकालीन प्रणाली ओवरराइड कोर"}
                </span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-xl">
                  {isEnglish 
                    ? "Executing a factory reset erases simulated anomalies logs, task overlays, and restores standard accent config defaults."
                    : "फ़ैक्टरी रीसेट निष्पादित करने से सिम्युलेटेड विसंगतियाँ लॉग, कार्य ओवरले मिट जाते हैं और मानक एक्सेंट कॉन्फ़िगरेशन पुनर्स्थापित हो जाते हैं।"}
                </p>
              </div>

              {/* Reset button trigger */}
              <button
                onClick={handleFactoryReset}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 border transition-all duration-200 cursor-pointer
                  ${isLowBandwidth
                    ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                  }`}
              >
                <RotateCcw className="w-4 h-4 text-rose-400 animate-spin" />
                {isEnglish ? "FACTORY RESET WORKSTATION" : "फ़ैक्टरी रीसेट वर्कस्टेशन"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Simulated Interactive Terminal Rebooting screen */
          <motion.div
            key="reboot-terminal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 rounded-2xl bg-black border border-slate-900 font-mono text-xs text-rose-500 space-y-6 max-w-2xl mx-auto shadow-[0_15px_40px_rgba(0,0,0,0.8)] mt-12"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
              <Terminal className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="font-bold tracking-wider">{isEnglish ? "CORE CONSOLE SYSTEM DESTRUCT" : "मुख्य कंसोल सिस्टम विनाश"}</span>
            </div>

            {/* Simulated log shell output */}
            <div className="space-y-2 min-h-[160px] overflow-hidden">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                  {log}
                </div>
              ))}
              <div className="w-2.5 h-4 bg-rose-500 animate-pulse inline-block" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 border-t border-slate-900">
              <span>{isEnglish ? "RESTORING COCKPIT METRICS..." : "कॉकपिट मेट्रिक्स बहाल..."}</span>
              <span className="animate-spin w-4.5 h-4.5 border border-t-rose-500 border-r-transparent rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
