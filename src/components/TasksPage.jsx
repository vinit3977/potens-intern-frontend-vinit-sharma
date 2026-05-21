import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Trash2, 
  Clock, 
  User, 
  AlertCircle, 
  ShieldAlert,
  ListTodo,
  CheckCircle,
  PauseCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TasksPage = () => {
  const { 
    lang, 
    actionItems, 
    addTask, 
    deleteTask, 
    approveItem, 
    holdItem, 
    resetItems, 
    isLowBandwidth 
  } = useApp();

  const isEnglish = lang === 'en';
  const t = translations[lang];

  // Local state for the new task form
  const [showAddForm, setShowAddForm] = useState(false);
  const [client, setClient] = useState('');
  const [context, setContext] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [risk, setRisk] = useState('MEDIUM');
  const [team, setTeam] = useState('Payments API');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'HELD' | 'APPROVED'

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!client || !context) return;
    addTask({ client, context, priority, risk, team });
    setClient('');
    setContext('');
    setPriority('MEDIUM');
    setRisk('MEDIUM');
    setTeam('Payments API');
    setShowAddForm(false);
  };

  const filteredTasks = actionItems.filter(item => {
    // Search filter
    const matchesSearch = 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'ALL' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate task statistics
  const totalCount = actionItems.length;
  const pendingCount = actionItems.filter(t => t.status === 'PENDING').length;
  const heldCount = actionItems.filter(t => t.status === 'HELD').length;
  const approvedCount = actionItems.filter(t => t.status === 'APPROVED').length;

  const getPriorityColor = (p) => {
    switch (p) {
      case 'CRITICAL': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'MEDIUM': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-display flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-teal-400" />
            {isEnglish ? "Operational Tasks Station" : "ऑपरेशनल कार्य स्टेशन"}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
            {isEnglish 
              ? "Track, dispatch, and approve infrastructure override tickets and client workflow pipelines."
              : "बुनियादी ढांचा ओवरराइड टिकट और क्लाइंट वर्कफ़्लो पाइपलाइनों को ट्रैक, प्रेषित और स्वीकृत करें।"}
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 border transition-all duration-200
              ${isLowBandwidth 
                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700' 
                : 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(20,184,166,0.35)] hover:border-teal-400'
              }`}
          >
            <Plus className="w-4 h-4" />
            {isEnglish ? "LOG SYSTEM TICKET" : "सिस्टम टिकट लॉग करें"}
          </button>

          <button
            onClick={resetItems}
            className="px-3.5 py-2 rounded-xl text-xs font-bold font-mono border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-colors"
          >
            {isEnglish ? "RESET REGISTER" : "रजिस्टर रीसेट"}
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {[
          { label: isEnglish ? "TOTAL CHECKS" : "कुल कार्य", value: totalCount, icon: ListTodo, color: 'text-slate-400 border-slate-800 bg-slate-950/20' },
          { label: isEnglish ? "PENDING ACTION" : "लंबित स्वीकृतियां", value: pendingCount, icon: AlertCircle, color: 'text-teal-400 border-teal-500/20 bg-teal-500/5' },
          { label: isEnglish ? "ON SYSTEM HOLD" : "होल्ड पर", value: heldCount, icon: PauseCircle, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
          { label: isEnglish ? "APPROVED CORES" : "स्वीकृत", value: approvedCount, icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${stat.color}`}>
              <div>
                <span className="text-[10px] text-slate-500 font-bold tracking-wider block uppercase">{stat.label}</span>
                <span className="text-xl font-bold font-display text-slate-200 block mt-1">{stat.value}</span>
              </div>
              <Icon className="w-5 h-5 opacity-70" />
            </div>
          );
        })}
      </div>

      {/* 3. Task Creator Collapsible Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateTask} className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/60 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-teal-400 font-mono uppercase">
                {isEnglish ? "CREATE OVERRIDE DECK REGISTRY" : "ओवरराइड डेक रजिस्ट्री बनाएं"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">{isEnglish ? "Target Client / Platform" : "लक्षित क्लाइंट / प्लेटफार्म"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe Dev, OpenAI Node"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors font-mono"
                  />
                </div>

                {/* Team Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">{isEnglish ? "Responsible Operations Team" : "जिम्मेदार संचालन टीम"}</label>
                  <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors font-mono"
                  >
                    <option value="Payments API">Payments API</option>
                    <option value="Telemetry Grid">Telemetry Grid</option>
                    <option value="DB Core">DB Core</option>
                    <option value="Infra Allocations">Infra Allocations</option>
                    <option value="Foundry Ops">Foundry Ops</option>
                  </select>
                </div>

                {/* Priority & Risk Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">{isEnglish ? "Priority Level" : "प्राथमिकता स्तर"}</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-2 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors font-mono"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">{isEnglish ? "Risk Assessment" : "जोखिम मूल्यांकन"}</label>
                    <select
                      value={risk}
                      onChange={(e) => setRisk(e.target.value)}
                      className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-2 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors font-mono"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Context Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">{isEnglish ? "Operational Action / Failure Log Context" : "ऑपरेशनल कार्रवाई / विफलता लॉग संदर्भ"}</label>
                <textarea
                  required
                  rows={2}
                  placeholder={isEnglish ? "Describe the failure event and required override intervention..." : "विफलता घटना और आवश्यक ओवरराइड हस्तक्षेप का वर्णन करें..."}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-[#03060c] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors font-mono resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors"
                >
                  {isEnglish ? "CANCEL" : "रद्द करें"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors"
                >
                  {isEnglish ? "SUBMIT COMMAND" : "कमांड सबमिट करें"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Filter and Search Deck */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl border border-slate-900/60 bg-slate-950/20 backdrop-blur-md">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto font-mono text-[11px]">
          {[
            { filter: 'ALL', label: isEnglish ? 'ALL ACTIONS' : 'सभी' },
            { filter: 'PENDING', label: isEnglish ? 'PENDING' : 'लंबित' },
            { filter: 'HELD', label: isEnglish ? 'ON HOLD' : 'होल्ड पर' },
            { filter: 'APPROVED', label: isEnglish ? 'APPROVED' : 'स्वीकृत' }
          ].map((item) => (
            <button
              key={item.filter}
              onClick={() => setStatusFilter(item.filter)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all duration-200 cursor-pointer whitespace-nowrap
                ${statusFilter === item.filter
                  ? 'bg-teal-500/10 border-teal-500/40 text-teal-400'
                  : 'bg-transparent border-slate-900 hover:border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isEnglish ? "Search registry database..." : "रजिस्ट्री डेटाबेस खोजें..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#03060c] border border-slate-900 hover:border-slate-800 focus:border-teal-500/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none transition-colors font-mono"
          />
        </div>
      </div>

      {/* 5. Tasks Roster list / Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative p-5 rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all duration-300 overflow-hidden group
                  ${isLowBandwidth 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-slate-950/40 border-slate-900/60 hover:border-slate-800/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]'
                  }`}
              >
                {/* Visual Accent Glow on Approved */}
                {task.status === 'APPROVED' && !isLowBandwidth && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                )}
                {task.status === 'HELD' && !isLowBandwidth && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                )}

                {/* Card Top Information */}
                <div>
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono font-bold">
                    <span className="text-slate-500 tracking-wider">#{task.id}</span>
                    <span className={`px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 font-display leading-snug tracking-tight mb-2 truncate">
                    {task.client}
                  </h4>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4 line-clamp-3">
                    {task.context}
                  </p>
                </div>

                {/* Card Bottom / Action Triggers */}
                <div className="pt-4 border-t border-slate-900/80 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      {task.timestamp}
                    </span>
                    <span className="flex items-center gap-1.5 uppercase font-semibold text-slate-400">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      {task.team}
                    </span>
                  </div>

                  {/* Operational Triggers Row */}
                  <div className="flex items-center justify-between gap-2 pt-1.5">
                    {/* Status Badge */}
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded
                      ${task.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                      ${task.status === 'HELD' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                      ${task.status === 'PENDING' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 animate-pulse' : ''}
                    `}>
                      {task.status === 'PENDING' ? t.pending : task.status === 'HELD' ? t.held : t.approved}
                    </span>

                    {/* Operational controls */}
                    <div className="flex items-center gap-1.5">
                      {task.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => approveItem(task.id)}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-400 text-emerald-400 transition-colors"
                          >
                            {t.approve}
                          </button>
                          <button
                            onClick={() => holdItem(task.id)}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-amber-500/20 bg-amber-950/20 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 text-amber-400 transition-colors"
                          >
                            {t.hold}
                          </button>
                        </>
                      )}

                      {task.status === 'HELD' && (
                        <button
                          onClick={() => approveItem(task.id)}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-400 text-emerald-400 transition-colors"
                        >
                          {t.approve}
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task.id)}
                        title={isEnglish ? "Delete Ticket" : "टिकट हटाएं"}
                        className="p-1 rounded-lg border border-slate-900 bg-slate-950/20 hover:bg-rose-950/30 hover:border-rose-900 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              layout
              className="col-span-full py-16 text-center rounded-2xl border border-slate-900/60 bg-slate-950/20 font-mono text-slate-400 text-xs max-w-md mx-auto w-full mt-4"
            >
              <ShieldAlert className="w-10 h-10 text-rose-500/20 mx-auto mb-3" />
              <p className="font-bold text-slate-300">{isEnglish ? "NO QUEUED OPERATIONS DETECTED" : "कोई कतारबद्ध संचालन नहीं मिला"}</p>
              <p className="text-[10px] text-slate-500 mt-1">{isEnglish ? "Adjust search queries or status toggles above to filter." : "फ़िल्टर करने के लिए ऊपर खोज प्रश्नों या स्थिति टॉगल को समायोजित करें।"}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
