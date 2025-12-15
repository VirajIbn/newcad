import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'light',
      sidebarOpen: true,
      sidebarCollapsed: false,
      breadcrumbs: [],

      // Actions
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        // Apply theme to document
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      },

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen })
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      toggleSidebarCollapsed: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed })
      },



      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs })
      },

      addBreadcrumb: (breadcrumb) => {
        set({ 
          breadcrumbs: [...get().breadcrumbs, breadcrumb] 
        })
      },

      reset: () => {
        set({
          theme: 'light',
          sidebarOpen: true,
          sidebarCollapsed: false,
          breadcrumbs: []
        })
      }
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)
