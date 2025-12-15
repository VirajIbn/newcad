// ========================================
// BACKEND CONFIGURATION
// ========================================
// Change these values to match your backend server
// This is the ONLY file you need to modify when changing backend settings

export const BACKEND_CONFIG = {
  // Backend server IP address
  // IP: '192.168.0.190', // Rohan Office IP
   IP: '192.168.0.182', // Siddhika IP
  // IP: '13.233.21.121', // Previous IP
  // IP: '172.16.16.161', // Previous IP
  
  // Backend server port
  PORT: '8000',
  
  // API base path (matches backend developer's structure)
  API_BASE_PATH: '/api',
  
  // Protocol (http or https)
  PROTOCOL: 'http',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Whether to enable debug logging
  DEBUG: true,
};

// ========================================
// HELPER FUNCTIONS
// ========================================
// Get the full backend URL (matches backend developer's structure)
export const getBackendUrl = () => {
  const { PROTOCOL, IP, PORT, API_BASE_PATH } = BACKEND_CONFIG;
  return `${PROTOCOL}://${IP}:${PORT}${API_BASE_PATH}`;
};

// Get the base backend URL (without API path)
export const getBaseBackendUrl = () => {
  const { PROTOCOL, IP, PORT } = BACKEND_CONFIG;
  return `${PROTOCOL}://${IP}:${PORT}`;
};

// Get full URL for any endpoint
export const getFullUrl = (endpoint) => {
  const baseUrl = getBackendUrl();
  return `${baseUrl}${endpoint}`;
};

// ========================================
// ENVIRONMENT-SPECIFIC OVERRIDES
// ========================================
// You can add environment-specific overrides here
// For example, different IPs for development, staging, and production

export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'development':
      return {
        ...BACKEND_CONFIG,
        DEBUG: true,
        // You can override IP/port for development if needed
        // IP: 'localhost',
        // PORT: '8000',
      };
    
    case 'staging':
      return {
        ...BACKEND_CONFIG,
        DEBUG: false,
        // Override for staging environment
        // IP: 'staging-server-ip',
        // PORT: '8000',
      };
    
    case 'production':
      return {
        ...BACKEND_CONFIG,
        DEBUG: false,
        // Override for production environment
        // IP: 'production-server-ip',
        // PORT: '443', // Usually HTTPS on port 443
        // PROTOCOL: 'https',
      };
    
    default:
      return BACKEND_CONFIG;
  }
};

// Export the current environment configuration
export const CURRENT_CONFIG = getEnvironmentConfig();
