import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authenticationAPI } from '../services/api'
import { toast } from 'react-toastify'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          // Call the authentication API to validate credentials
          // This matches the backend developer's structure: /auth/test-token/
          const response = await authenticationAPI.login(credentials);
          
          if (response.data && response.data.tokens) {
            const { tokens, user } = response.data;
            
            // Store tokens using backend developer's structure
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            localStorage.setItem('token_expiry', Date.now() + (60 * 60 * 1000)); // 60 minutes
            
            // Store user information
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set user data from the response
            const userData = {
              id: user.id || '1',
              email: credentials.email,
              name: user.name || user.username || 'Authenticated User',
              role: user.role || 'user',
              avatar: 'https://github.com/shadcn.png'
            }
            
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false,
              token: tokens.access
            })
            
                      // Toast message moved to AuthContext to avoid duplication
            return { success: true }
          } else {
            throw new Error('Invalid response from authentication server');
          }
        } catch (error) {
          console.error('Login error:', error);
          let errorMessage = 'Login failed';
          
          // Handle specific error cases
          if (error.response) {
            const { status, data } = error.response;
            switch (status) {
              case 400:
                errorMessage = data?.error || 'Invalid credentials';
                break;
              case 401:
                errorMessage = 'Invalid email or password';
                break;
              case 422:
                errorMessage = data?.error || 'Validation error';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
              default:
                errorMessage = data?.error || 'Login failed';
            }
          } else if (error.request) {
            errorMessage = 'Network error. Please check your connection.';
          } else {
            errorMessage = error.message || 'Login failed';
          }
          
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          toast.error(errorMessage);
          return { success: false, error: errorMessage }
        }
      },

      logout: async () => {
        try {
          // Call logout endpoint if token exists
          const token = localStorage.getItem('access_token');
          if (token) {
            await authenticationAPI.logout();
          }
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with logout even if API call fails
        }
        
        // Remove all tokens and user data (matching backend developer's structure)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('user');
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null,
          token: null
        })
        
        toast.success('Logged out successfully');
      },

      clearError: () => set({ error: null }),

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      // Initialize auth state from localStorage (matching backend developer's structure)
      initializeAuth: async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const expiry = localStorage.getItem('token_expiry');
        
        if (accessToken && refreshToken && expiry) {
          // Check if token is expired
          if (Date.now() > parseInt(expiry)) {
            // Token expired, try to refresh
            try {
              const refreshed = await get().refreshToken();
              if (!refreshed) {
                // Refresh failed, clear everything
                get().logout();
                return;
              }
            } catch (error) {
              console.error('Token refresh error:', error);
              get().logout();
              return;
            }
          }
          
          // Token is valid, get user data
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              set({ 
                user: {
                  id: user.id || '1',
                  email: user.email || user.username || 'user@example.com',
                  name: user.name || user.username || 'Authenticated User',
                  role: user.role || 'user',
                  avatar: 'https://github.com/shadcn.png'
                }, 
                isAuthenticated: true, 
                token: accessToken 
              });
            } catch (error) {
              console.error('Error parsing user data:', error);
              get().logout();
            }
          }
        }
      },

      // Refresh token (matching backend developer's structure)
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await authenticationAPI.refresh();
          if (response.data && response.data.access) {
            const newAccessToken = response.data.access;
            
            // Update tokens
            localStorage.setItem('access_token', newAccessToken);
            localStorage.setItem('token_expiry', Date.now() + (60 * 60 * 1000));
            set({ token: newAccessToken });
            
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
)
