import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authenticationAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for existing auth token
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expiry = localStorage.getItem('token_expiry');
    
    if (accessToken && refreshToken && expiry) {
      // Check if token is expired
      if (Date.now() > parseInt(expiry)) {
        // Token expired, clear everything
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('user');
      } else {
        // Token is valid, get user data
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setToken(accessToken);
            setUser(userData); // Use the stored user data directly
            
          } catch (error) {
            console.error('Error parsing user data:', error);
            // Clear invalid data
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('token_expiry');
            localStorage.removeItem('user');
          }
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
  
      
      // Call the authentication API to validate credentials
      const response = await authenticationAPI.login({ email: username, password });
      
      
      
      if (response.data && response.data.tokens) {
        const { tokens, user } = response.data;
        

        
        // Store tokens using backend developer's structure
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('token_expiry', Date.now() + (60 * 60 * 1000)); // 60 minutes
        
        // Set user data from the response
        const userData = {
          id: user.id || '1',
          username: user.name || user.username || 'Authenticated User',
          fullname: user.first_name + ' ' + user.last_name, // Use email from API response (no fallback)
          email: user.email, // Use email from API response (no fallback)
          role: user.role || 'NA',
          orgId: user.orgId, // Use orgId from API response (no fallback)
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        };
        
        // Store processed user information (not the raw API response)
        localStorage.setItem('user', JSON.stringify(userData));
        

        
        setUser(userData);
        setToken(tokens.access);
        
        
        toast.success('Namaste..!! Welcome to CADASHBOARD');
        return { success: true };
      } else {
        console.error('❌ Invalid response structure:', response);
        throw new Error('Invalid response from authentication server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
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
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
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
    
    // Clear financial year selection on logout
    localStorage.removeItem('selected_financial_year');
    
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Use the authentication API for token refresh
      const response = await authenticationAPI.refresh();
      if (response.data && response.data.access) {
        const newAccessToken = response.data.access;
        
        // Update tokens
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('token_expiry', Date.now() + (60 * 60 * 1000));
        setToken(newAccessToken);
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    logout,
    updateProfile,
    refreshToken,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 