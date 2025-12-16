# Asset Vendors Implementation

This document describes the complete implementation of the Asset Vendors module for the CAD Dashboard Frontend.

## Overview

The Asset Vendors module provides a fully functional interface for managing vendor information, including:

- **CRUD Operations**: Create, Read, Update, and Delete vendors
- **Search & Filtering**: Advanced search across multiple fields with filtering options
- **Pagination**: Configurable page sizes (10, 20, 50, or all items)
- **JWT Authentication**: Secure API integration with JWT tokens
- **Responsive Design**: Mobile-friendly interface with grid/list view modes

## Features

### 1. Vendor Management
- ✅ Add new vendors with comprehensive information
- ✅ Edit existing vendor details
- ✅ Soft delete vendors (marks as deleted, doesn't remove from database)
- ✅ View detailed vendor information in modal

### 2. Search & Filtering
- ✅ Full-text search across vendor name, GST number, contact person, email, and mobile
- ✅ Filter by active/inactive status
- ✅ Sort by name, date added, or date modified
- ✅ Debounced search for better performance

### 3. User Interface
- ✅ Grid and list view modes
- ✅ Responsive card-based layout
- ✅ Loading states and error handling
- ✅ Empty state handling
- ✅ Pagination with configurable page sizes

### 4. API Integration
- ✅ JWT token authentication
- ✅ RESTful API endpoints
- ✅ Error handling and user feedback
- ✅ Automatic token refresh handling

## API Endpoints

The vendor module integrates with the following backend API endpoints:

### Base URL
```
http://172.16.16.161:8000/assets/api/
```

### Endpoints
- `GET /asset-vendors/` - List all vendors with pagination and filtering
- `GET /asset-vendors/active/` - List active vendors only
- `GET /asset-vendors/{id}/` - Get single vendor details
- `POST /asset-vendors/` - Create new vendor
- `PUT /asset-vendors/{id}/` - Update vendor
- `DELETE /asset-vendors/{id}/` - Soft delete vendor

## Components

### 1. AssetVendors.jsx (Main Page)
- Main vendor management interface
- Handles search, filtering, and pagination
- Manages form and detail modal states
- Integrates with the useVendors hook

### 2. VendorForm.jsx
- Form component for creating and editing vendors
- Uses Zod validation schema
- Responsive grid layout
- Form state management with React Hook Form

### 3. VendorCard.jsx
- Individual vendor display card
- Hover effects and animations
- Edit and delete action buttons
- Click to view details

### 4. VendorDetailsModal.jsx
- Detailed vendor information modal
- Comprehensive vendor data display
- Edit button integration
- Responsive layout

### 5. VendorPagination.jsx
- Pagination controls with page size selection
- First/previous/next/last page navigation
- Page number display with smart truncation
- Loading state handling

## Hooks

### useVendors
Custom hook that manages all vendor-related state and operations:

```javascript
const {
  vendors,           // Array of vendor objects
  loading,           // Loading state
  error,            // Error state
  pagination,       // Pagination information
  createVendor,     // Create new vendor
  updateVendor,     // Update existing vendor
  deleteVendor,     // Delete vendor
  searchVendors,    // Search vendors
  // ... and more
} = useVendors(initialParams);
```

## Validation

Vendor data is validated using Zod schemas:

```javascript
export const vendorSchema = z.object({
  vendorname: z.string().min(1, 'Vendor name is required').max(100),
  gstno: z.string().max(100).optional(),
  contactperson: z.string().max(200).optional(),
  email: z.string().email('Invalid email format').max(100).optional(),
  mobilenumber: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  countryid: z.number().int().min(1).optional(),
  stateid: z.number().int().min(1).optional(),
  cityid: z.number().int().min(1).optional(),
  zip: z.string().max(10).optional(),
  description: z.string().max(1000).optional(),
  isactive: z.number().int().min(0).max(1).optional(),
  orgid: z.number().int().min(1).optional(),
});
```

## Usage

### Basic Implementation

```javascript
import { useVendors } from '../hooks/useVendors';

const MyComponent = () => {
  const { vendors, loading, createVendor } = useVendors();
  
  const handleAddVendor = async (vendorData) => {
    try {
      await createVendor(vendorData);
      // Vendor created successfully
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      {loading ? 'Loading...' : vendors.map(vendor => (
        <div key={vendor.assetvendorid}>{vendor.vendorname}</div>
      ))}
    </div>
  );
};
```

### Search and Filtering

```javascript
const { updateParams, clearSearch } = useVendors();

// Search vendors
updateParams({ search: 'tech' });

// Filter by status
updateParams({ isactive: '1' });

// Sort by name
updateParams({ ordering: 'vendorname' });

// Clear all filters
clearSearch();
```

## Configuration

### Backend Configuration
The vendor API uses the same configuration as other asset APIs:

```javascript
// src/config/backend.js
export const BACKEND_CONFIG = {
  IP: '172.16.16.161',
  PORT: '8000',
  API_BASE_PATH: '/api',
  PROTOCOL: 'http',
  TIMEOUT: 10000,
  DEBUG: true,
};
```

### JWT Token Management
JWT tokens are automatically managed by the API service:

```javascript
// Tokens are stored in localStorage
localStorage.getItem('access_token');     // Access token
localStorage.getItem('refresh_token');    // Refresh token

// API automatically includes tokens in requests
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

## Error Handling

The vendor module includes comprehensive error handling:

1. **API Errors**: Network errors, server errors, validation errors
2. **User Feedback**: Toast notifications for success/error states
3. **Loading States**: Visual feedback during API operations
4. **Form Validation**: Real-time validation with helpful error messages
5. **Fallback UI**: Empty states and error boundaries

## Performance Features

1. **Debounced Search**: 500ms delay to prevent excessive API calls
2. **Pagination**: Configurable page sizes to manage data load
3. **Lazy Loading**: Components only render when needed
4. **Memoization**: Callbacks and expensive operations are memoized
5. **Optimistic Updates**: UI updates immediately for better UX

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Input Validation**: Server-side and client-side validation
3. **XSS Protection**: Sanitized input handling
4. **CSRF Protection**: Token-based request validation
5. **Secure Storage**: Tokens stored securely in localStorage

## Testing

To test the vendor functionality:

1. **Ensure Backend is Running**: Backend should be accessible at `172.16.16.161:8000`
2. **Login**: User must be authenticated with valid JWT token
3. **Test CRUD Operations**: Create, read, update, and delete vendors
4. **Test Search**: Use the search functionality with various terms
5. **Test Filters**: Apply different filters and verify results
6. **Test Pagination**: Navigate through pages and change page sizes

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check JWT token validity and expiration
2. **Network Errors**: Verify backend server is running and accessible
3. **Validation Errors**: Check form data against validation schema
4. **Pagination Issues**: Verify page size and page number parameters

### Debug Mode

Enable debug mode in backend configuration:

```javascript
export const BACKEND_CONFIG = {
  DEBUG: true,  // Enable debug logging
  // ... other config
};
```

## Future Enhancements

1. **Bulk Operations**: Select multiple vendors for batch operations
2. **Advanced Filters**: Date range filters, custom field filters
3. **Export Functionality**: CSV, Excel, PDF export options
4. **Vendor Analytics**: Usage statistics and reporting
5. **Integration**: Connect with other modules (assets, maintenance, etc.)

## Dependencies

The vendor module requires the following dependencies:

```json
{
  "react": "^18.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "@hookform/resolvers": "^3.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.263.0",
  "react-hot-toast": "^2.4.0",
  "date-fns": "^2.30.0"
}
```

## Conclusion

The Asset Vendors module provides a complete, production-ready solution for managing vendor information in the CAD Dashboard. It follows modern React patterns, includes comprehensive error handling, and provides an excellent user experience with responsive design and smooth animations.

The implementation is fully integrated with the existing codebase architecture and follows the established patterns for API integration, state management, and component design.
