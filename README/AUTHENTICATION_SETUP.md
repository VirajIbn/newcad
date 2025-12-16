# Authentication API Integration

This document explains how the authentication API has been integrated into your CADashboard frontend application.

## API Structure

### Single Base URL
- **Base URL**: `http://172.16.16.161:8000/api`
- **All endpoints** (authentication, assets, maintenance, etc.) use this single base URL
- **JWT token required** for all endpoints except authentication endpoints

### Available Endpoints
- **Authentication**: `/auth/test-token/`, `/auth/logout/`, `/auth/profile/`
- **Token Refresh**: `/token/refresh/`
- **Assets**: `/assets`, `/assets/{id}`, `/assets/types`, `/assets/stats`
- **Maintenance**: `/maintenance`, `/maintenance/{id}`, `/maintenance/schedule`
- **Requests**: `/requests`, `/requests/{id}`, `/requests/{id}/approve`, `/requests/{id}/reject`
- **Dashboard**: `/dashboard/stats`, `/dashboard/charts`, `/dashboard/activity`
- **Manufacturers**: `/manufacturers` (public endpoints)

## How It Works

### 1. Single API Instance
- **One axios instance** handles all API calls
- **Single base URL** for all endpoints
- **Automatic JWT token injection** for authenticated requests
- **Unified error handling** across all endpoints

### 2. Database Authentication
- **No hardcoded credentials** - all authentication is done against your database
- **Login endpoint** validates email/password combination using `/auth/test-token/`
- **Returns JWT tokens** upon successful authentication
- **Token validation** ensures security on every request

### 3. Token Management
- JWT tokens are stored in localStorage using backend developer's structure:
  - `access_token` - for API requests
  - `refresh_token` - for token refresh
  - `token_expiry` - for token expiration
  - `user` - for user information
- **Automatic validation** on app startup and login
- **Token refresh** handles expired tokens automatically
- **Secure logout** invalidates tokens on the server

### 4. API Security
- **All endpoints** automatically include JWT token (except public ones)
- **Token validation** on every request to your backend
- **Automatic logout** if token becomes invalid

## Files Modified

### 1. `src/config/backend.js`
- **Consolidated to single base URL**: `http://172.16.16.161:8000/api`
- **Matches backend developer's structure** exactly
- **Easy IP address changes** in one place

### 2. `src/services/api.js`
- **Updated to match backend developer's endpoints**:
  - Login: `/auth/test-token/` (not `/login/`)
  - Token refresh: `/token/refresh/` (not `/auth/refresh/`)
- **Uses correct localStorage keys**: `access_token`, `refresh_token`
- **Single axios instance** for all API calls

### 3. `src/stores/useAuthStore.js`
- **Updated to match backend developer's token structure**
- **Proper token storage** using `access_token`, `refresh_token`, `token_expiry`
- **Automatic token refresh** when expired
- **User data storage** in localStorage

### 4. `src/context/AuthContext.jsx`
- **Updated to work with new API structure**
- **Proper error handling** for backend responses
- **Token management** using backend developer's structure

### 5. `src/components/forms/LoginForm.jsx`
- **Removed demo credentials display**
- **Added proper login instructions**
- **Form now works with real database authentication**

### 6. `src/main.jsx`
- Added `AuthInitializer` component to initialize auth store on app startup
- Cleaned up duplicate providers

## Authentication Flow

### 1. **User Login**
```
User enters credentials → authenticationAPI.login() → /auth/test-token/ → Database validation → JWT tokens returned
```

### 2. **Token Storage & Management**
```
JWT tokens stored → access_token for API calls → refresh_token for renewal → token_expiry for validation
```

### 3. **API Requests**
```
API call made → JWT token automatically added → Backend validates token → Request processed
```

### 4. **Token Refresh**
```
Token expires → /token/refresh/ → New access token received → User stays logged in
```

## URL Structure Examples

### Authentication Endpoints
```
POST http://172.16.16.161:8000/api/auth/test-token/
POST http://172.16.16.161:8000/api/auth/logout/
GET  http://172.16.16.161:8000/api/auth/profile/
```

### Token Management
```
POST http://172.16.16.161:8000/api/token/refresh/
```

### Assets Endpoints
```
GET  http://172.16.16.161:8000/api/assets
GET  http://172.16.16.161:8000/api/assets/123
POST http://172.16.16.161:8000/api/assets
```

### Maintenance Endpoints
```
GET  http://172.16.16.161:8000/api/maintenance
GET  http://172.16.16.161:8000/api/maintenance/123
```

## Usage Examples

### Testing API Connection
```javascript
import { testAPIConnection } from '@/services/api';

// Test the API connections
const result = await testAPIConnection();
console.log(result);
```

### Using Authentication API
```javascript
import { authenticationAPI } from '@/services/api';

// Login with database credentials
const loginResult = await authenticationAPI.login({
  email: 'user@example.com',
  password: 'userpassword'
});

// Test a token
const validation = await authenticationAPI.testToken('your-jwt-token');
```

### Using Assets API (automatically authenticated)
```javascript
import { assetAPI } from '@/services/api';

// This will automatically include the JWT token
const assets = await assetAPI.getAll();
```

## Error Handling

The system now handles various authentication errors:

- **400 Bad Request**: Invalid credentials format
- **401 Unauthorized**: Invalid email/password
- **422 Validation Error**: Form validation failures
- **500 Server Error**: Backend server issues
- **Network Errors**: Connection problems

## Next Steps

1. **Test with your authentication backend** at `http://172.16.16.161:8000`
2. **Ensure your backend has these endpoints**:
   - `POST /api/auth/test-token/` for login
   - `POST /api/token/refresh/` for token refresh
   - `GET /api/assets` for assets
3. **Verify JWT token format** matches what the frontend expects
4. **Configure CORS** on your backend to allow frontend requests

## Testing

1. Start your authentication backend at `http://172.16.16.161:8000`
2. **All endpoints should be accessible** under `/api/`
3. **Use real database credentials** (no more hardcoded values)
4. Check browser console for API connection status
5. Verify JWT tokens are being sent in request headers

## Troubleshooting

- **CORS issues**: Ensure your backend allows requests from your frontend domain
- **Login fails**: Check that your `/api/auth/test-token/` endpoint is working and accepts `username` and `password`
- **Token refresh fails**: Verify your `/api/token/refresh/` endpoint is working
- **Assets API fails**: Verify JWT token is being sent correctly in Authorization header
- **Database connection**: Ensure your authentication backend can connect to the database
- **Endpoint routing**: Make sure your backend routes all endpoints under `/api/`
