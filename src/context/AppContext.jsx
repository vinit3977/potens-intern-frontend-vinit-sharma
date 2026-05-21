import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialActionItems, mockAnomalies } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isDark, setIsDark] = useState(true);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionItems, setActionItems] = useState(initialActionItems);
  const [anomalies, setAnomalies] = useState(mockAnomalies);
  const [notificationsCount, setNotificationsCount] = useState(4);
  const [focusedItemIndex, setFocusedItemIndex] = useState(0);
  const [loadLevel, setLoadLevel] = useState('normal'); // 'normal' | 'peak' | 'stress'
  const [accentColor, setAccentColor] = useState('cyan'); // 'cyan' | 'rose' | 'emerald' | 'gold'
  
  // Real-time telemetry history for charts
  const [telemetryHistory, setTelemetryHistory] = useState([
    { id: 1, latency: 180, throughput: 45, cpu: 22, memory: 41 },
    { id: 2, latency: 195, throughput: 48, cpu: 25, memory: 41 },
    { id: 3, latency: 172, throughput: 44, cpu: 21, memory: 42 },
    { id: 4, latency: 185, throughput: 46, cpu: 24, memory: 42 },
    { id: 5, latency: 210, throughput: 52, cpu: 28, memory: 43 },
    { id: 6, latency: 225, throughput: 55, cpu: 31, memory: 43 },
    { id: 7, latency: 190, throughput: 49, cpu: 26, memory: 44 },
    { id: 8, latency: 182, throughput: 47, cpu: 23, memory: 44 },
    { id: 9, latency: 235, throughput: 58, cpu: 33, memory: 45 },
    { id: 10, latency: 250, throughput: 62, cpu: 38, memory: 45 },
  ]);

  // Apply dark mode class to documentElement
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Live telemetry ticker depending on load levels
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryHistory(prev => {
        const nextId = prev[prev.length - 1].id + 1;
        
        let baseLatency = 180;
        let baseThroughput = 45;
        let baseCpu = 25;
        let jitter = Math.random() * 30 - 15;

        if (loadLevel === 'peak') {
          baseLatency = 350;
          baseThroughput = 95;
          baseCpu = 60;
          jitter = Math.random() * 80 - 40;
        } else if (loadLevel === 'stress') {
          baseLatency = 520;
          baseThroughput = 160;
          baseCpu = 88;
          jitter = Math.random() * 120 - 50;
        }

        const nextEntry = {
          id: nextId,
          latency: Math.max(50, Math.round(baseLatency + jitter)),
          throughput: Math.max(10, Math.round(baseThroughput + (jitter / 4))),
          cpu: Math.max(5, Math.min(100, Math.round(baseCpu + (jitter / 8)))),
          memory: Math.max(20, Math.min(100, Math.round(45 + Math.random() * 4 - 2)))
        };

        return [...prev.slice(1), nextEntry];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [loadLevel]);

  const toggleLang = () => setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  const toggleDark = () => setIsDark(prev => !prev);
  const toggleLowBandwidth = () => setIsLowBandwidth(prev => !prev);

  const approveItem = (id) => {
    setActionItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: 'APPROVED' } : item
      )
    );
  };

  const holdItem = (id) => {
    setActionItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: 'HELD' } : item
      )
    );
  };

  const resetItems = () => {
    setActionItems(initialActionItems);
    setFocusedItemIndex(0);
  };

  // New tasks helpers
  const addTask = (task) => {
    setActionItems(prev => [
      {
        id: Math.max(0, ...prev.map(t => t.id)) + 1,
        client: task.client || "Manual Trigger",
        context: task.context || "Database tuning or manual check required.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        priority: task.priority || "MEDIUM",
        risk: task.risk || "MEDIUM",
        team: task.team || "Infra Allocations",
        status: "PENDING"
      },
      ...prev
    ]);
  };

  const deleteTask = (id) => {
    setActionItems(prev => prev.filter(t => t.id !== id));
  };

  // New anomalies helpers
  const addAnomaly = (anomaly) => {
    setAnomalies(prev => [
      {
        id: Math.max(0, ...prev.map(a => a.id)) + 1,
        system: anomaly.system || "Diagnostic Ingress Probe",
        severity: anomaly.severity || "CRITICAL",
        confidence: anomaly.confidence || 95.0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "UNRESOLVED",
        trend: Array.from({ length: 7 }, () => Math.round(Math.random() * 80 + 20)),
        details: anomaly.details || "Custom telemetry flag raised by dashboard control."
      },
      ...prev
    ]);
    setNotificationsCount(prev => prev + 1);
  };

  const resolveAnomaly = (id) => {
    setAnomalies(prev =>
      prev.map(a => {
        if (a.id === id) {
          if (a.status !== 'RESOLVED') {
            setNotificationsCount(n => Math.max(0, n - 1));
          }
          return { ...a, status: 'RESOLVED' };
        }
        return a;
      })
    );
  };

  const setAnomalyStatus = (id, status) => {
    setAnomalies(prev =>
      prev.map(a => {
        if (a.id === id) {
          if (status === 'RESOLVED' && a.status !== 'RESOLVED') {
            setNotificationsCount(n => Math.max(0, n - 1));
          }
          return { ...a, status };
        }
        return a;
      })
    );
  };

  const resetAllState = () => {
    setActionItems(initialActionItems);
    setAnomalies(mockAnomalies);
    setNotificationsCount(4);
    setFocusedItemIndex(0);
    setLoadLevel('normal');
    setAccentColor('cyan');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        isDark,
        setIsDark,
        toggleDark,
        isLowBandwidth,
        setIsLowBandwidth,
        toggleLowBandwidth,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        actionItems,
        setActionItems,
        anomalies,
        setAnomalies,
        notificationsCount,
        setNotificationsCount,
        approveItem,
        holdItem,
        resetItems,
        focusedItemIndex,
        setFocusedItemIndex,
        // Added states and helpers
        loadLevel,
        setLoadLevel,
        accentColor,
        setAccentColor,
        telemetryHistory,
        addTask,
        deleteTask,
        addAnomaly,
        resolveAnomaly,
        setAnomalyStatus,
        resetAllState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
