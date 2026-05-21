import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { Keyboard, ChevronUp, ChevronDown, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShortcutHelper = () => {
  const { lang, isLowBandwidth } = useApp();
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);

  const shortcutList = [
    { key: 'J', action: t.shortcutNext },
    { key: 'K', action: t.shortcutPrev },
    { key: 'A', action: t.shortcutApprove },
    { key: 'H', action: t.shortcutHold },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isLowBandwidth ? (
        // Flat style without animations
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Header button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/60 hover:bg-slate-950 text-xs font-semibold font-mono tracking-wider text-slate-300 border-b border-slate-800 w-full"
          >
            <Keyboard className="w-4.5 h-4.5 text-teal-400" />
            <span>WORKSTATION CORE</span>
            {isOpen ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronUp className="w-4 h-4 ml-auto" />}
          </button>

          {/* List content */}
          {isOpen && (
            <div className="p-3.5 space-y-2.5 bg-slate-900">
              {shortcutList.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-5 text-[11px] font-mono text-slate-400">
                  <span>{item.action}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 font-bold">
                    {item.key}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Framer Motion animated glassmorphic panel
        <div className="bg-[#0b101c]/80 backdrop-blur-md border border-slate-900/60 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-slate-800/80">
          {/* Header Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-900/30 text-[10px] font-bold font-mono tracking-widest text-slate-400 hover:text-slate-200 w-full transition-colors"
          >
            <Keyboard className="w-4.5 h-4.5 text-teal-400 filter drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
            <span>KEYBOARD CONSOLE</span>
            {isOpen ? <ChevronDown className="w-4 h-4 ml-auto text-slate-500" /> : <ChevronUp className="w-4 h-4 ml-auto text-slate-500" />}
          </button>

          {/* Expandable items using AnimatePresence */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } } }}
                exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.2 }, opacity: { duration: 0.1 } } }}
                className="overflow-hidden border-t border-slate-950"
              >
                <div className="p-3.5 space-y-2.5 bg-slate-950/20 font-mono text-[10px]">
                  {shortcutList.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-5 text-slate-400">
                      <span className="font-sans font-medium text-slate-400">{item.action}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900/80 text-teal-400 font-extrabold shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                        {item.key}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
