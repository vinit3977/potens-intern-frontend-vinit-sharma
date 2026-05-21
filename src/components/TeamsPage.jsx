import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  Users, 
  Search, 
  Radio, 
  ShieldAlert, 
  Send, 
  CheckSquare, 
  Clock, 
  UserPlus, 
  Award,
  BellRing,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TeamsPage = () => {
  const { 
    lang, 
    actionItems, 
    setActionItems,
    isLowBandwidth 
  } = useApp();

  const isEnglish = lang === 'en';
  const t = translations[lang];

  // Local state for page features
  const [searchQuery, setSearchQuery] = useState('');
  const [pagerCount, setPagerCount] = useState(12);
  const [activeNotification, setActiveNotification] = useState(null);

  // Mock static-dynamic team roster
  const [roster, setRoster] = useState([
    { id: 1, name: "Neha Sharma", role: "Lead Payments Engineer", team: "Payments API", status: "ON CALL", experience: "5yr Sr.", email: "neha.s@aether.net" },
    { id: 2, name: "Sam Wilson", role: "Senior DevOps Lead", team: "Infra Allocations", status: "ONLINE", experience: "4yr Sr.", email: "sam.w@aether.net" },
    { id: 3, name: "Elena Rostova", role: "Principal Database Architect", team: "DB Core", status: "OFFLINE", experience: "7yr Principal", email: "elena.r@aether.net" },
    { id: 4, name: "John Doe", role: "Data Streams Engineer", team: "Telemetry Grid", status: "ON CALL", experience: "3yr Mid.", email: "john.d@aether.net" },
    { id: 5, name: "Vinit", role: "Senior Operations Director", team: "Foundry Ops", status: "ONLINE", experience: "Director Core", email: "vinit@aether.net" }
  ]);

  const getStatusIndicator = (st) => {
    switch (st) {
      case 'ONLINE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          ring: 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
        };
      case 'ON CALL':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          ring: 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800 text-slate-500',
          ring: 'bg-slate-600'
        };
    }
  };

  // Handle Dispatching Pager Alerts to individual engineers
  const handlePageEngineer = (engineerName, subsystem) => {
    setPagerCount(prev => prev + 1);
    setActiveNotification({
      message: isEnglish 
        ? `CRITICAL PagerDuty Alarm dispatched to ${engineerName} for system ${subsystem}.`
        : `सिस्टम ${subsystem} के लिए ${engineerName} को महत्वपूर्ण पेजरड्यूटी अलार्म भेजा गया।`,
      engineer: engineerName
    });

    setTimeout(() => {
      setActiveNotification(null);
    }, 4000);
  };

  // Change individual status in the session
  const toggleStatus = (id) => {
    setRoster(prev => prev.map(member => {
      if (member.id === id) {
        let nextStatus = "ONLINE";
        if (member.status === "ONLINE") nextStatus = "ON CALL";
        else if (member.status === "ON CALL") nextStatus = "OFFLINE";
        return { ...member, status: nextStatus };
      }
      return member;
    }));
  };

  // Assign task to an engineer team
  const assignTaskToTeam = (taskId, targetTeam) => {
    setActionItems(prev => prev.map(item => {
      if (item.id === taskId) {
        return { ...item, team: targetTeam };
      }
      return item;
    }));
    
    // Notify
    setActiveNotification({
      message: isEnglish 
        ? `Override Ticket #${taskId} reassigned to ${targetTeam} core logs.`
        : `ओवरराइड टिकट #${taskId} को ${targetTeam} कोर लॉग्स को फिर से सौंपा गया।`,
      engineer: "System Router"
    });
    setTimeout(() => {
      setActiveNotification(null);
    }, 3000);
  };

  // Get active items count for each team
  const getTeamTaskCount = (teamName) => {
    return actionItems.filter(item => item.team === teamName && item.status === 'PENDING').length;
  };

  // Filtering Roster
  const filteredRoster = roster.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = actionItems.filter(item => item.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-display flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            {isEnglish ? "Operational Command Roster" : "संचालन कमान रोस्टर"}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
            {isEnglish 
              ? "Coordinate on-call schedules, dispatch incident pagers, and assign override workflows to operational engineers."
              : "ऑन-कॉल शेड्यूल का समन्वय करें, घटना पेजर भेजें, और परिचालन इंजीनियरों को ओवरराइड वर्कफ़्लो सौंपें।"}
          </p>
        </div>

        {/* Dynamic header logs */}
        <div className="flex items-center gap-4 bg-indigo-950/10 border border-indigo-500/20 rounded-xl px-4 py-2 text-xs font-mono text-indigo-400">
          <BellRing className="w-4 h-4 text-indigo-400 animate-swing" />
          <div>
            <span>{isEnglish ? "PAGERS DISPATCHED TODAY: " : "आज भेजे गए पेजर: "}</span>
            <strong className="text-slate-200 text-sm ml-1">{pagerCount}</strong>
          </div>
        </div>
      </div>

      {/* Roster Notifications overlay */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex items-center gap-3 text-xs text-indigo-300 font-mono shadow-[0_4px_25px_rgba(99,102,241,0.15)]"
          >
            <ShieldAlert className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <strong>[{activeNotification.engineer.toUpperCase()}]</strong> {activeNotification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Roster control header (Search and Filters) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-950/20 backdrop-blur-md">
        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">
          {isEnglish ? "ACTIVE ON-DUTY RESPONDERS DIRECTORY" : "सक्रिय ऑन-ड्यूटी रिस्पॉन्सर्स निर्देशिका"}
        </span>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isEnglish ? "Search engineer or system..." : "इंजीनियर या प्रणाली खोजें..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#03060c] border border-slate-900 hover:border-slate-850 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none transition-colors font-mono"
          />
        </div>
      </div>

      {/* 3. Team Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRoster.map((member) => {
            const statusConfig = getStatusIndicator(member.status);
            const taskLoad = getTeamTaskCount(member.team);

            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[250px] transition-all duration-300 relative group
                  ${isLowBandwidth 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-[#060a15]/40 border-slate-900/60 hover:border-slate-800/80 hover:shadow-[0_12px_30px_rgba(0,0,0,0.55)]'
                  }`}
              >
                {/* Background decorative team glow */}
                {!isLowBandwidth && (
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-indigo-500/2 rounded-full blur-2xl opacity-20 pointer-events-none" />
                )}

                {/* Profile Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Status Ring & Label */}
                    <button
                      onClick={() => toggleStatus(member.id)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1.5 cursor-pointer select-none font-mono uppercase hover:border-slate-700
                        ${statusConfig.bg}`}
                      title={isEnglish ? "Change Active Status" : "सक्रिय स्थिति बदलें"}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.ring}`} />
                      {member.status}
                    </button>

                    {/* Team tag */}
                    <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wide flex items-center gap-1 uppercase">
                      <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                      {member.team}
                    </span>
                  </div>

                  {/* Name and Role */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-950 to-indigo-900/40 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm font-display shadow-glow-blue/5">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-100 font-display leading-tight group-hover:text-indigo-400 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Workspace Workload Stats */}
                  <div className="grid grid-cols-2 gap-3.5 mt-5 font-mono text-[10px] text-slate-400">
                    <div className="p-2 rounded-lg border border-slate-900/60 bg-[#03060c]/40">
                      <span className="text-slate-500 font-bold block uppercase">{isEnglish ? "PENDING TASKS" : "लंबित कार्य"}</span>
                      <span className={`text-xs font-bold font-display block mt-1 ${taskLoad > 0 ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {taskLoad} {isEnglish ? "Tickets" : "टिकट"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-900/60 bg-[#03060c]/40">
                      <span className="text-slate-500 font-bold block uppercase">{isEnglish ? "CORE SYSTEM" : "कोर सिस्टम"}</span>
                      <span className="text-[9px] text-slate-300 block truncate mt-1.5 uppercase font-bold" title={member.team}>
                        {member.team.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="pt-4 border-t border-slate-900/60 mt-5 space-y-3 font-mono">
                  
                  {/* Task assign input */}
                  {pendingTasks.length > 0 && member.status !== 'OFFLINE' ? (
                    <div className="flex items-center gap-1.5">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            assignTaskToTeam(parseInt(e.target.value), member.team);
                            e.target.value = "";
                          }
                        }}
                        className="w-full bg-[#03060b] border border-slate-900 hover:border-slate-850 text-[10px] text-slate-400 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                      >
                        <option value="">{isEnglish ? "Assign ticket..." : "टिकट सौंपें..."}</option>
                        {pendingTasks.map(task => (
                          <option key={task.id} value={task.id}>
                            #{task.id} - {task.client}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-600 text-center py-1">
                      {member.status === 'OFFLINE' 
                        ? (isEnglish ? "OFFLINE — REASSIGNMENT DISABLED" : "ऑफ़लाइन — असाइनमेंट अक्षम") 
                        : (isEnglish ? "NO PENDING TICKETS FOR REASSIGN" : "सौंपने के लिए कोई लंबित टिकट नहीं")}
                    </div>
                  )}

                  {/* Dispatch triggers */}
                  <button
                    onClick={() => handlePageEngineer(member.name, member.team)}
                    disabled={member.status === 'OFFLINE'}
                    className={`w-full py-2 rounded-xl text-[10px] font-extrabold tracking-widest uppercase flex items-center justify-center gap-1.5 border transition-all duration-200 cursor-pointer
                      ${member.status === 'OFFLINE'
                        ? 'bg-slate-900/40 border-slate-950 text-slate-600'
                        : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                      }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isEnglish ? "DISPATCH PAGER ALARM" : "पेजर अलार्म भेजें"}
                  </button>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
