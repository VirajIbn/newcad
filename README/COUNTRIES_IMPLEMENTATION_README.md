# Countries API Implementation for Vendor Form

## Overview
This implementation adds a countries dropdown to the vendor add/edit form by fetching data from the backend API. The countries are fetched using the recommended `/api/master/countries/active_countries/` endpoint.

## Backend API Details

### Server Configuration
- **Primary Server**: `192.168.0.190:8000`
- **Alternative Server**: `13.233.21.121:8000`

### Primary Endpoint (Recommended for Dropdowns)
- **URL**: `GET /api/master/countries/active_countries/`
- **Description**: Returns all non-deleted countries
- **Filter**: `isdeleted=0`
- **Ordering**: Alphabetical by `countryname` (default)
- **Response**: Array of country objects

### Alternative Endpoints
- **All Countries**: `GET /api/master/countries/`
- **Search Countries**: `GET /api/master/countries/?search={query}`
- **Filter Countries**: `GET /api/master/countries/?{filter_params}`

### Country Data Structure
```json
{
  "countryid": 1,
  "countryname": "India",
  "isdeleted": 0,
  "oldpk": null,
  "currencyid": 1,
  "timezoneid": 1,
  "stdcode": "+91",
  "countrynamealis": "IN",
  "countrycodeforeinvoice": "IN"
}
```

## Frontend Implementation

### 1. API Service (`src/services/api.js`)
Added `countriesAPI` object with methods:
- `getActiveCountries()` - Main method for dropdown
- `getAll()` - Get all countries with pagination
- `searchCountries()` - Search by name/code
- `getById()` - Get single country
- `filter()` - Custom filtering

### 2. Custom Hook (`src/hooks/useCountries.js`)
Created `useCountries` hook that:
- Fetches active countries on mount
- Provides loading and error states
- Includes search functionality
- Handles API errors gracefully

### 3. Vendor Form Integration (`src/components/forms/VendorForm.jsx`)
Enhanced the form to:
- Display countries in dropdown
- Show loading state while fetching
- Display error messages if API fails
- Reset dependent fields (state/city) when country changes

### 4. Page Integration (`src/pages/assets/AssetVendors.jsx`)
Updated the vendors page to:
- Use the `useCountries` hook
- Pass countries data to VendorForm
- Handle loading and error states

## Usage

### Basic Implementation
```jsx
import { useCountries } from '../../hooks/useCountries';

const MyComponent = () => {
  const { countries, loading, error } = useCountries();
  
  return (
    <select disabled={loading}>
      <option value="">{loading ? 'Loading...' : 'Select Country'}</option>
      {countries.map(country => (
        <option key={country.countryid} value={country.countryid}>
          {country.countryname}
        </option>
      ))}
    </select>
  );
};
```

### With Error Handling
```jsx
const { countries, loading, error } = useCountries();

{error && (
  <p className="text-red-600">Failed to load countries: {error}</p>
)}
```

## Testing

### Test Component
Created `src/components/test/CountriesTest.jsx` for testing the API:
- Displays fetched countries
- Shows loading states
- Handles errors
- Provides refresh functionality

### Console Logging
The hook includes console logging for debugging:
- 🌍 Fetching countries
- ✅ Success response
- ❌ Error details

## Error Handling

### Network Errors
- Connection failures
- CORS issues
- Timeout errors

### User Feedback
- Toast notifications for errors
- Inline error messages
- Loading indicators
- Disabled states during loading

## Benefits

1. **Centralized Data**: Single source of truth for countries
2. **Performance**: Countries loaded once and cached
3. **User Experience**: Loading states and error handling
4. **Maintainability**: Easy to update API endpoints
5. **Consistency**: Follows existing codebase patterns

## Future Enhancements

1. **Caching**: Implement local storage caching
2. **Search**: Add searchable dropdown functionality
3. **Pagination**: Handle large country lists
4. **Offline Support**: Cache countries for offline use
5. **Real-time Updates**: WebSocket for country changes

## Troubleshooting

### Common Issues

1. **Countries not loading**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Check authentication token

2. **CORS errors**
   - Ensure backend allows frontend origin
   - Check API configuration

3. **Empty dropdown**
   - Verify API returns data
   - Check response format
   - Ensure countries array is populated

### Debug Steps

1. Open browser console
2. Check network tab for API calls
3. Verify response data structure
4. Test API endpoint directly
5. Check authentication headers

## API Configuration

The countries API uses the same configuration as other APIs:
- Base URL: Configured in `src/config/backend.js`
- Authentication: JWT Bearer token
- Timeout: 10 seconds (configurable)
- Error handling: Centralized in API interceptors
