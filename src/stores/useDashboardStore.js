import { create } from 'zustand'

export const useDashboardStore = create((set, get) => ({
  // State
  stats: {
    revenue: 0,
    subscriptions: 0,
    sales: 0,
    activeUsers: 0
  },
  recentActivity: [],
  isLoading: false,
  error: null,

  // Actions
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockData = {
        stats: {
          revenue: 45231.89,
          subscriptions: 2350,
          sales: 12234,
          activeUsers: 573
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            message: 'New user registration',
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: 2,
            type: 'payment',
            message: 'Payment received',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: 3,
            type: 'system',
            message: 'System update completed',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            status: 'info'
          }
        ]
      }
      
      set({ 
        stats: mockData.stats, 
        recentActivity: mockData.recentActivity,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      })
    }
  },

  updateStats: (newStats) => {
    set({ stats: { ...get().stats, ...newStats } })
  },

  addActivity: (activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...activity
    }
    set({ 
      recentActivity: [newActivity, ...get().recentActivity.slice(0, 9)] 
    })
  },

  clearError: () => set({ error: null }),

  reset: () => {
    set({
      stats: { revenue: 0, subscriptions: 0, sales: 0, activeUsers: 0 },
      recentActivity: [],
      isLoading: false,
      error: null
    })
  }
}))
