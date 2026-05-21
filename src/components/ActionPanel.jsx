import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, itemTranslations } from '../data/translations';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { 
  CheckCircle2, 
  AlertOctagon, 
  HelpCircle, 
  RotateCcw,
  Zap,
  Hand,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ActionPanel = () => {
  const { 
    lang, 
    actionItems, 
    approveItem, 
    holdItem, 
    resetItems, 
    searchQuery,
    focusedItemIndex,
    setFocusedItemIndex,
    isLowBandwidth 
  } = useApp();

  const t = translations[lang];

  // Filter items based on header search query
  const filteredItems = actionItems.filter(item => {
    const query = searchQuery.toLowerCase();
    const client = item.client.toLowerCase();
    const team = item.team.toLowerCase();
    const context = (itemTranslations['en'][item.id] || '').toLowerCase();
    return client.includes(query) || team.includes(query) || context.includes(query);
  });

  // Activate keyboard shortcuts hook for the filtered items list
  useKeyboardShortcuts(filteredItems);

  // Reset or clamp focused index when filtered list changes to prevent focus loss
  React.useEffect(() => {
    if (filteredItems.length === 0) {
      if (focusedItemIndex !== 0) {
        setFocusedItemIndex(0);
      }
    } else {
      if (focusedItemIndex >= filteredItems.length) {
        setFocusedItemIndex(filteredItems.length - 1);
      } else if (focusedItemIndex < 0) {
        setFocusedItemIndex(0);
      }
    }
  }, [filteredItems.length, focusedItemIndex, setFocusedItemIndex]);

  // Styling helper for Priority
  const getPriorityBadge = (priority) => {
    const configs = {
      CRITICAL: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      HIGH: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      MEDIUM: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      LOW: 'bg-slate-800/40 border-slate-700/50 text-slate-400'
    };
    return configs[priority] || configs.LOW;
  };

  // Styling helper for Risk
  const getRiskBadge = (risk) => {
    const configs = {
      HIGH: 'text-rose-400 bg-rose-500/5 border-rose-500/20',
      MEDIUM: 'text-amber-400 bg-amber-500/5 border-amber-500/20',
      LOW: 'text-slate-400 bg-slate-800/10 border-slate-800/40'
    };
    return configs[risk] || configs.LOW;
  };

  const getPriorityLabel = (priority) => {
    if (lang === 'hi') {
      const labels = { CRITICAL: 'अति-गंभीर', HIGH: 'उच्च', MEDIUM: 'मध्यम', LOW: 'निम्न' };
      return labels[priority] || priority;
    }
    return priority;
  };

  const getRiskLabel = (risk) => {
    if (lang === 'hi') {
      const labels = { HIGH: 'उच्च', MEDIUM: 'मध्यम', LOW: 'निम्न' };
      return labels[risk] || risk;
    }
    return risk;
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300
      ${isLowBandwidth 
        ? 'bg-[#0c1222] border-slate-800' 
        : 'bg-[#0c1222]/40 backdrop-blur-md border-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-glow-blue/5'
      }`}
    >
      {/* Header of Action Items */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-display">
            <Zap className="w-5 h-5 text-teal-400" />
            {t.actionItemsHeader}
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-400">
              {filteredItems.filter(item => item.status === 'PENDING').length} {t.itemsRemaining}
            </span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 font-sans">
            {t.actionItemsSubtext}
          </p>
        </div>

        {/* Reset / Diagnostic Trigger */}
        <button
          onClick={resetItems}
          title="Reset Action Items State"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/20 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>

      {/* List Area */}
      <div className="mt-5 space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-slate-900 rounded-xl text-slate-500 font-sans text-xs">
            {t.searchEmpty}
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isFocused = idx === focusedItemIndex;
            const contextText = itemTranslations[lang][item.id] || item.context;

            return (
              <div
                key={item.id}
                onClick={() => setFocusedItemIndex(idx)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-250 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group
                  ${isFocused 
                    ? (isLowBandwidth 
                        ? 'border-blue-600 bg-slate-900' 
                        : 'border-teal-500/40 bg-slate-900/40 shadow-glow-teal/10 shadow-[0_0_18px_rgba(20,184,166,0.06)]'
                      ) 
                    : 'border-slate-900/50 bg-[#080d1a]/20 hover:border-slate-800/80'
                  }
                `}
              >
                {/* Keyboard focus marker (left neon bar) */}
                {isFocused && !isLowBandwidth && (
                  <motion.div 
                    layoutId="focusBar"
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-teal-400 shadow-[0_0_10px_#14b8a6]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                {isFocused && isLowBandwidth && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-blue-600" />
                )}

                {/* Left Area: Priorities, Client, description */}
                <div className="space-y-2 flex-1 pl-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Priority */}
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${getPriorityBadge(item.priority)}`}>
                      {getPriorityLabel(item.priority)}
                    </span>
                    {/* Client name */}
                    <span className="text-xs font-bold text-slate-200 tracking-wide font-display">
                      {item.client}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">•</span>
                    {/* Team */}
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                      {item.team}
                    </span>
                  </div>

                  {/* Context sentence */}
                  <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
                    {contextText}
                  </p>

                  {/* Meta properties */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.timestamp}
                    </span>
                    <span className="flex items-center gap-1 border-l border-slate-800 pl-4">
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                      {t.risk}: 
                      <span className={`px-1.5 rounded font-bold ${getRiskBadge(item.risk)}`}>
                        {getRiskLabel(item.risk)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Area: Tactical Action Buttons */}
                <div className="flex items-center gap-3.5 lg:self-center self-end z-10 shrink-0">
                  {item.status === 'PENDING' ? (
                    <>
                      {/* Hold Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          holdItem(item.id);
                        }}
                        className={`px-4 py-2 text-[11px] font-bold font-mono rounded-xl border tracking-wider transition-all duration-200 flex items-center gap-1.5 active:scale-95
                          ${isLowBandwidth 
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500' 
                            : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-950/10'
                          }`}
                      >
                        <Hand className="w-3.5 h-3.5" />
                        {t.hold.toUpperCase()}
                      </button>

                      {/* Approve Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approveItem(item.id);
                        }}
                        className={`px-4 py-2 text-[11px] font-bold font-mono rounded-xl border tracking-wider transition-all duration-200 flex items-center gap-1.5 active:scale-95
                          ${isLowBandwidth 
                            ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700' 
                            : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                          }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.approve.toUpperCase()}
                      </button>
                    </>
                  ) : (
                    /* Visual state update instantly when approved/held */
                    <div className="flex items-center gap-2">
                      {item.status === 'APPROVED' ? (
                        <div className={`px-4 py-2 text-[11px] font-bold font-mono tracking-wider rounded-xl border flex items-center gap-2 transition-all duration-300
                          ${isLowBandwidth
                            ? 'bg-slate-900 border-slate-800 text-emerald-500'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.approved.toUpperCase()}</span>
                        </div>
                      ) : (
                        <div className={`px-4 py-2 text-[11px] font-bold font-mono tracking-wider rounded-xl border flex items-center gap-2 transition-all duration-300
                          ${isLowBandwidth
                            ? 'bg-slate-900 border-slate-800 text-amber-500'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]'
                          }`}
                        >
                          <AlertOctagon className="w-4 h-4" />
                          <span>{t.held.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
