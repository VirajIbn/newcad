# Environment Variables Setup Guide

## 🔒 Security Best Practices

**IMPORTANT**: Sensitive configuration like database URLs, API keys, and server IPs should NEVER be hardcoded in your source code. They should be stored in environment variables.

## 📍 Current Configuration Location

### Backend Configuration
**File**: `src/config/backend.js`

This file contains:
- Backend server IP addresses
- Port numbers
- API paths
- Protocol settings
- Debug flags

**⚠️ Security Issue**: Currently, these values are hardcoded and will be visible in your production build.

## ✅ Solution: Use Environment Variables

### Step 1: Create `.env` File

Create a `.env` file in the root of your project:

```env
# Backend API Configuration
VITE_BACKEND_IP=192.168.0.182
VITE_BACKEND_PORT=8000
VITE_API_BASE_PATH=/api
VITE_BACKEND_PROTOCOL=http
VITE_API_TIMEOUT=10000
VITE_DEBUG=true
```

### Step 2: Create `.env.example` (Template)

Create `.env.example` as a template (this file CAN be committed to git):

```env
# Backend API Configuration
# Copy this file to .env and fill in your actual values
# NEVER commit .env to version control

VITE_BACKEND_IP=your_backend_ip_here
VITE_BACKEND_PORT=8000
VITE_API_BASE_PATH=/api
VITE_BACKEND_PROTOCOL=http
VITE_API_TIMEOUT=10000
VITE_DEBUG=true
```

### Step 3: Update `.gitignore`

Make sure `.gitignore` includes:

```
# Environment variables
.env
.env.local
.env.production
.env.development
```

### Step 4: Vercel Environment Variables

For Vercel deployment:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add each variable:
   - `VITE_BACKEND_IP` = `your_production_backend_ip`
   - `VITE_BACKEND_PORT` = `8000`
   - `VITE_API_BASE_PATH` = `/api`
   - `VITE_BACKEND_PROTOCOL` = `https` (for production)
   - `VITE_API_TIMEOUT` = `10000`
   - `VITE_DEBUG` = `false` (for production)

## 🔐 What Should Be in Environment Variables?

### ✅ Should Use Environment Variables:
- Backend server IPs/URLs
- API keys
- Database connection strings (if any)
- Secret tokens
- Production vs Development settings

### ❌ Can Stay in Code:
- UI configuration
- Default values (with env overrides)
- Public API endpoints structure
- Non-sensitive constants

## 📝 Database URLs

**Note**: This is a **frontend React application**. It does NOT directly connect to databases. 

- **Database connections** are handled by your **backend server**
- The frontend only communicates with the backend API
- Backend IP/URL is configured in `src/config/backend.js` (now using env vars)

## 🚀 For Different Environments

### Development
```env
VITE_BACKEND_IP=localhost
VITE_BACKEND_PORT=8000
VITE_BACKEND_PROTOCOL=http
VITE_DEBUG=true
```

### Production (Vercel)
```env
VITE_BACKEND_IP=your-production-backend-domain.com
VITE_BACKEND_PORT=443
VITE_BACKEND_PROTOCOL=https
VITE_DEBUG=false
```

## 🔍 Where Privacy/Security Code is Stored

### Current Locations:

1. **Backend Configuration**: `src/config/backend.js`
   - Now uses environment variables with fallbacks

2. **JWT Tokens**: Stored in `localStorage` (browser)
   - Keys: `access_token`, `refresh_token`, `token_expiry`
   - This is normal for frontend apps

3. **API Service**: `src/services/api.js`
   - Handles authentication headers
   - Manages token refresh

4. **Auth Context**: `src/context/AuthContext.jsx`
   - Manages user authentication state

## ⚠️ Security Checklist

- [x] Backend config now uses environment variables
- [ ] Create `.env` file (don't commit it)
- [ ] Create `.env.example` template
- [ ] Update `.gitignore` to exclude `.env`
- [ ] Set environment variables in Vercel
- [ ] Use HTTPS in production
- [ ] Never commit sensitive data to git

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

