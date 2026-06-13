import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useObeliskStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAdmin: false,
      isAuthReady: false,
      setUser: (user) => set({
        user,
        isAdmin: user ? ['nCZLU2r9YfXVTrQ79EJqWJxPPT03'].includes(user.uid) : false,
        isAuthReady: true
      }),
      setAuthReady: () => set({ isAuthReady: true }),

      // Agent
      agentConnected: false,
      agentStats: { traffic_mbps: 0, packets_total: 0, hooks_intercepted: 0, cpu_percent: 0, memory_percent: 0, active_nodes: 0, risk_score: 0 },
      agentHistory: { traffic: [], load: [] },
      setAgentConnected: (v) => set({ agentConnected: v }),
      updateAgentStats: (stats) => set((state) => ({
        agentStats: { ...state.agentStats, ...stats },
        agentHistory: {
          traffic: [...state.agentHistory.traffic, stats.traffic_mbps || 0].slice(-60),
          load: [...state.agentHistory.load, stats.cpu_percent || 0].slice(-60)
        }
      })),

      // UI
      lang: 'en',
      showSplash: true,
      adminAlerted: false,
      setLang: (lang) => set({ lang }),
      setShowSplash: (v) => set({ showSplash: v }),
      setAdminAlerted: (v) => set({ adminAlerted: v }),

      // APK Analysis
      lastAnalysis: null,
      setLastAnalysis: (data) => set({ lastAnalysis: data }),
    }),
    { name: 'obelisk-store', partialize: (state) => ({ lang: state.lang, adminAlerted: state.adminAlerted }) }
  )
)
