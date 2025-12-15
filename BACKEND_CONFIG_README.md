# Backend Configuration Guide

## 🎯 **Quick Setup - Change IP Address in One Place**

### **File to Modify**: `src/config/backend.js`

```javascript
export const BACKEND_CONFIG = {
  // Change this IP address to match your backend server
  IP: '172.16.16.161',  // ← CHANGE THIS IP ADDRESS
  
  // Backend server port
  PORT: '8000',          // ← CHANGE THIS PORT IF NEEDED
  
  // API base path (usually /api/auth)
  API_BASE_PATH: '/api/auth',
  
  // Protocol (http or https)
  PROTOCOL: 'http',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Whether to enable debug logging
  DEBUG: true,
};
```

## 🚀 **How It Works**

### **1. Centralized Configuration**
- **Single file** controls all backend settings
- **Automatic updates** everywhere in your app
- **No need to search and replace** multiple files

### **2. Automatic URL Generation**
```javascript
// Your backend URL is automatically generated as:
// http://172.16.16.161:8000/api/auth

// All API endpoints automatically use this base URL:
// - http://172.16.16.161:8000/api/auth/login/
// - http://172.16.16.161:8000/api/auth/assets
// - http://172.16.16.161:8000/api/auth/maintenance
// etc...
```

### **3. Environment Support**
- **Development**: `localhost:8000`
- **Staging**: `staging-server-ip:8000`
- **Production**: `production-server-ip:443`

## 📝 **Common Scenarios**

### **Scenario 1: Change Backend IP Address**
```javascript
// In src/config/backend.js
export const BACKEND_CONFIG = {
  IP: '172.16.16.161',  // ← Changed from 192.168.0.190
  PORT: '8000',
  // ... rest stays the same
};
```

### **Scenario 2: Change Port Number**
```javascript
// In src/config/backend.js
export const BACKEND_CONFIG = {
  IP: '172.16.16.161',
  PORT: '9000',          // ← Changed from 8000
  // ... rest stays the same
};
```

### **Scenario 3: Switch to HTTPS**
```javascript
// In src/config/backend.js
export const BACKEND_CONFIG = {
  IP: '172.16.16.161',
  PORT: '443',           // ← HTTPS port
  PROTOCOL: 'https',     // ← Changed from http
  // ... rest stays the same
};
```

### **Scenario 4: Different IP for Development**
```javascript
// In src/config/backend.js
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'development':
      return {
        ...BACKEND_CONFIG,
        IP: 'localhost',      // ← Local development
        PORT: '8000',
        DEBUG: true,
      };
    
    case 'production':
      return {
        ...BACKEND_CONFIG,
        IP: '172.16.16.161', // ← Production server
        PORT: '8000',
        DEBUG: false,
      };
    
    default:
      return BACKEND_CONFIG;
  }
};
```

## 🔧 **Available Configuration Options**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `IP` | string | `'172.16.16.161'` | Backend server IP address |
| `PORT` | string | `'8000'` | Backend server port |
| `API_BASE_PATH` | string | `'/api/auth'` | API base path |
| `PROTOCOL` | string | `'http'` | Protocol (http/https) |
| `TIMEOUT` | number | `10000` | API request timeout (ms) |
| `DEBUG` | boolean | `true` | Enable debug logging |

## 📍 **File Locations**

### **Configuration File**
```
src/config/backend.js  ← MODIFY THIS FILE
```

### **Files That Use Configuration**
```
src/services/api.js           ← Automatically uses config
src/stores/useAuthStore.js    ← Automatically uses config
src/context/AuthContext.jsx   ← Automatically uses config
All other API calls            ← Automatically use config
```

## 🎉 **Benefits**

✅ **Single Point of Change**: Modify one file, updates everywhere  
✅ **No Search & Replace**: Automatic propagation across the app  
✅ **Environment Support**: Different configs for dev/staging/prod  
✅ **Debug Logging**: Easy to enable/disable logging  
✅ **Type Safety**: Configuration is properly typed  
✅ **Helper Functions**: Built-in utilities for URL generation  

## 🚨 **Important Notes**

1. **Always restart your app** after changing configuration
2. **Check browser console** for debug logs (if DEBUG is true)
3. **Verify backend is running** on the specified IP and port
4. **Test API connection** using the `testAPIConnection()` function

## 🔍 **Testing Your Configuration**

```javascript
import { testAPIConnection } from '@/services/api';

// Test the API connection
const result = await testAPIConnection();
console.log(result);
```

## 📞 **Need Help?**

If you encounter issues:
1. Check browser console for error messages
2. Verify backend server is running
3. Test network connectivity to the IP/port
4. Check CORS configuration on your backend
