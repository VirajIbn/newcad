# Asset Category Implementation Guide

## Overview
This document describes the implementation of the Asset Category feature in the frontend, aligned with the backend API specifications.

---

## Backend API Compliance

The frontend has been updated to match the exact API structure provided in the backend documentation:

### Field Mappings

| Frontend Field | Backend Field | Type | Required | Description |
|---------------|---------------|------|----------|-------------|
| `categoryname` | `categoryname` | string | Yes | Category name (max 100 chars) |
| `description` | `description` | string | No | Description (max 300 chars) |
| `isactive` | `isactive` | integer (0/1) | No | Active status (default: 1) |
| `isdeleted` | `isdeleted` | integer (0/1) | No | Soft delete flag (default: 0) |

### Auto-Managed Fields (Backend)
The following fields are automatically managed by the backend:
- `assetcategoryid` - Primary key (auto-increment)
- `orgid` - Assigned based on JWT token
- `addedby` - Current user ID from JWT
- `addeddate` - Current timestamp
- `modifiedby` - Current user ID from JWT
- `modifieddate` - Current timestamp

---

## API Endpoints

### Base URL
```
Development: http://127.0.0.1:8000/api/assets/
```

### Available Endpoints

1. **List All Categories**
   ```
   GET /asset-categories/
   Query Params: page, page_size, search, ordering, isactive, isdeleted
   ```

2. **Get Single Category**
   ```
   GET /asset-categories/{id}/
   ```

3. **Create Category**
   ```
   POST /asset-categories/
   Body: { categoryname, description, isactive }
   ```

4. **Update Category**
   ```
   PATCH /asset-categories/{id}/
   Body: { categoryname, description, isactive }
   ```

5. **Delete Category (Soft Delete)**
   ```
   DELETE /asset-categories/{id}/
   ```

6. **Get Active Categories Only**
   ```
   GET /asset-categories/active_categories/
   ```

---

## Files Created/Modified

### 1. Hook: `src/hooks/useAssetCategories.js`
Custom React hook for managing asset categories data:

**Features:**
- Fetch categories with pagination
- Search and filtering
- CRUD operations (Create, Read, Update, Delete)
- Automatic organization filtering via JWT
- Error handling and loading states

**Key Functions:**
- `fetchAssetCategories(page, pageSize)` - Fetch paginated list
- `createAssetCategory(data)` - Create new category
- `updateAssetCategory(id, data)` - Update existing category
- `deleteAssetCategory(id)` - Soft delete category
- `searchAssetCategories(term)` - Search categories
- `updateOrdering(ordering)` - Change sort order

**Default Filters:**
```javascript
{
  search: '',
  ordering: '-addeddate',
  isactive: 1,
  isdeleted: 0
}
```

### 2. Form Component: `src/components/forms/AssetCategoryForm.jsx`
Modal form for creating/editing asset categories.

**Fields:**
- Category Name (required, max 100 chars)
- Description (optional, max 300 chars)
- Active Status (default: 1)

**Validation:**
- Required field validation
- Character limit validation
- Client-side error display

**Features:**
- Auto-population for edit mode
- Loading states
- Error handling
- Beautiful UI with animations

### 3. Page Component: `src/pages/assets/AssetCategory.jsx`
Main page component for asset category management.

**Features:**
- ✅ Searchable table with real-time filtering
- ✅ Sortable columns (categoryname, addeddate)
- ✅ Column visibility toggle
- ✅ Pagination (10, 20, 50, All)
- ✅ Bulk operations (select all, delete multiple)
- ✅ Export to Excel (CSV format)
- ✅ Add, Edit, Delete operations
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states and error handling

**Columns:**
- Checkbox (for bulk operations)
- Sr No
- Category Name (sortable)
- Description (toggleable)
- Actions (Edit, Delete)

### 4. API Service: `src/services/api.js`
Added `assetCategoriesAPI` service with methods:

```javascript
export const assetCategoriesAPI = {
  getAll: async (params = {}) => {},
  getActive: async (params = {}) => {},
  getById: async (id) => {},
  create: async (data) => {},
  update: async (id, data) => {},
  delete: async (id) => {},
  search: async (searchTerm, params = {}) => {}
}
```

**Request Structure (Create/Update):**
```json
{
  "categoryname": "IT Equipment",
  "description": "Computers and IT hardware",
  "isactive": 1,
  "isdeleted": 0
}
```

**Response Structure:**
```json
{
  "assetcategoryid": 1,
  "orgid": 1,
  "org_name": "ACME Corporation",
  "categoryname": "IT Equipment",
  "description": "Computers and IT hardware",
  "isactive": 1,
  "isdeleted": 0,
  "addedby": 10,
  "addedby_username": "john.doe",
  "addeddate": "2024-01-15T10:30:00Z",
  "modifiedby": 10,
  "modifiedby_username": "john.doe",
  "modifieddate": "2024-01-15T10:30:00Z"
}
```

### 5. Route: `src/routes/AppRoutes.jsx`
Added route for asset category page:

```javascript
<Route
  path="/assets/category"
  element={
    <ProtectedRoute>
      <MainLayout>
        <AssetCategory />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

### 6. Sidebar Menu: `src/layouts/Sidebar.jsx`
Added menu item in Asset Management section:

```javascript
{
  name: 'Asset Category',
  path: '/assets/category',
  icon: FolderTree,
}
```

**Position:** Between "Asset Types" and "Asset Vendors"

### 7. Export Files Updated
- `src/hooks/index.js` - Exported `useAssetCategories`
- `src/components/forms/index.js` - Exported `AssetCategoryForm`

---

## Authentication

All API requests require JWT authentication:

```javascript
Authorization: Bearer <access_token>
```

The token is automatically included in all requests via axios interceptor in `api.js`:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Organization Filtering

**Important:** The backend automatically filters asset categories by organization based on the JWT token. The frontend does NOT need to send `orgid` in requests.

**How it works:**
1. User logs in and receives JWT token
2. JWT token contains user's `orgid`
3. Backend extracts `orgid` from token
4. Backend filters all queries by this `orgid`
5. User only sees categories from their organization

---

## Search Functionality

The search feature supports searching across multiple fields:

**Frontend Implementation:**
```javascript
// Client-side filtering (backup)
const searchableFields = [
  assetCategory.categoryname,
  assetCategory.description,
  assetCategory.addeddate
];
```

**Backend API:**
```
GET /asset-categories/?search=IT+Equipment
```

The backend supports the `search` query parameter for general search across category names and descriptions.

---

## Sorting

**Available Sort Options:**
- `categoryname` - A to Z
- `-categoryname` - Z to A
- `addeddate` - Oldest first
- `-addeddate` - Newest first (default)
- `modifieddate` - Last modified (oldest)
- `-modifieddate` - Last modified (newest)

**Implementation:**
```javascript
const ordering = sortConfig.direction === 'desc' 
  ? `-${sortConfig.key}` 
  : sortConfig.key;
```

---

## Pagination

**Frontend Support:**
- 10 per page
- 20 per page
- 50 per page
- All (1000)

**API Request:**
```
GET /asset-categories/?page=1&page_size=20
```

**Response Structure:**
```json
{
  "count": 50,
  "next": "http://...?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Soft Delete

Asset categories use soft delete:

**What happens:**
1. User clicks delete
2. Frontend sends `DELETE` request
3. Backend sets `isdeleted = 1`
4. Record remains in database
5. Frontend filters out deleted records (`isdeleted: 0`)

**Restore Feature:**
The backend supports restoring deleted categories:
```
POST /asset-categories/{id}/restore/
```

---

## Export Feature

**Format:** CSV (Excel-compatible)

**Columns Exported:**
- Sr No
- Category Name
- Description
- Added Date

**File Name Format:**
```
asset_categories_2024-01-25.csv
```

**Implementation:**
```javascript
const exportToExcel = () => {
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');
  
  // Download as file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  // ... download logic
};
```

---

## Validation Rules

### Category Name
- **Required:** Yes
- **Max Length:** 100 characters
- **Type:** String
- **Example:** "IT Equipment", "Office Furniture"

### Description
- **Required:** No
- **Max Length:** 300 characters
- **Type:** String
- **Example:** "All IT and computer equipment"

### Active Status
- **Required:** No
- **Default:** 1
- **Type:** Integer (0 or 1)
- **Values:** 0 = Inactive, 1 = Active

---

## Error Handling

### Client-Side Validation
```javascript
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.categoryname.trim()) {
    newErrors.categoryname = 'Asset category name is required';
  }
  
  if (formData.description?.length > 300) {
    newErrors.description = 'Description must be 300 characters or less';
  }
  
  return Object.keys(newErrors).length === 0;
};
```

### API Error Handling
```javascript
try {
  await createAssetCategory(data);
  toast.success('Category created successfully!');
} catch (error) {
  toast.error('Failed to create category');
  console.error(error);
}
```

### Common Error Responses

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
  "error": "Permission denied",
  "message": "You can only access categories from your organization"
}
```

**400 Bad Request:**
```json
{
  "categoryname": ["This field is required."]
}
```

---

## Testing Checklist

### Functional Testing
- [ ] Create new asset category
- [ ] Edit existing category
- [ ] Delete category (soft delete)
- [ ] Search categories by name
- [ ] Search categories by description
- [ ] Sort by category name (A-Z)
- [ ] Sort by category name (Z-A)
- [ ] Sort by date added
- [ ] Change page size (10, 20, 50, All)
- [ ] Navigate between pages
- [ ] Select single category
- [ ] Select all categories
- [ ] Bulk delete categories
- [ ] Export to Excel
- [ ] Column visibility toggle

### UI/UX Testing
- [ ] Form validation messages display correctly
- [ ] Loading states show during API calls
- [ ] Success toasts appear after operations
- [ ] Error toasts show on failures
- [ ] Modal opens/closes smoothly
- [ ] Table rows highlight on hover
- [ ] Buttons disable during operations
- [ ] Search clears properly
- [ ] Responsive on mobile devices
- [ ] Dark mode displays correctly

### Security Testing
- [ ] JWT token required for all requests
- [ ] Users only see their organization's categories
- [ ] Unauthorized access redirects to login
- [ ] CSRF protection in place
- [ ] SQL injection prevented (backend)

### Performance Testing
- [ ] Large datasets load quickly
- [ ] Search debounce prevents excessive API calls
- [ ] Pagination limits dataset size
- [ ] Export handles large datasets
- [ ] No memory leaks on page navigation

---

## Troubleshooting

### Issue: "Authentication credentials were not provided"
**Solution:** Check if JWT token is stored in localStorage:
```javascript
localStorage.getItem('access_token')
```

### Issue: "No categories found" but categories exist
**Solution:** Check filters - ensure `isactive: 1` and `isdeleted: 0`

### Issue: Categories from other organizations visible
**Solution:** Check backend JWT token validation and organization filtering

### Issue: Export not working
**Solution:** Check browser's download settings and popup blockers

### Issue: Search not working
**Solution:** Verify debounce is functioning (500ms delay)

---

## Future Enhancements

### Possible Features
1. **Category Hierarchy:** Parent-child relationships
2. **Category Icons:** Custom icons for each category
3. **Category Colors:** Color coding for visual organization
4. **Import from Excel:** Bulk import categories
5. **Activity Log:** Track all changes to categories
6. **Duplicate Detection:** Warn about similar names
7. **Archive Categories:** Instead of delete, archive old categories
8. **Category Templates:** Predefined category sets
9. **Usage Statistics:** Show how many assets in each category
10. **Advanced Filters:** Filter by date range, user, etc.

---

## API Documentation Reference

For complete API documentation, see:
- `API_Documentation.txt` in project root
- Backend API documentation (internal link)

---

## Support

For issues or questions:
- **Frontend Team:** Contact frontend lead
- **Backend Team:** Contact backend lead
- **Bug Reports:** Use issue tracker

---

## Changelog

### Version 1.0.0 (January 2025)
- ✅ Initial implementation
- ✅ Complete CRUD operations
- ✅ Search and filtering
- ✅ Pagination support
- ✅ Export to Excel
- ✅ Bulk operations
- ✅ Soft delete implementation
- ✅ JWT authentication
- ✅ Organization-based filtering
- ✅ Responsive design
- ✅ Dark mode support

---

## File Structure

```
src/
├── hooks/
│   ├── useAssetCategories.js       # Custom hook for data management
│   └── index.js                     # Export hook
├── components/
│   └── forms/
│       ├── AssetCategoryForm.jsx   # Form component
│       └── index.js                 # Export form
├── pages/
│   └── assets/
│       └── AssetCategory.jsx       # Main page component
├── services/
│   └── api.js                       # API service (assetCategoriesAPI)
├── routes/
│   └── AppRoutes.jsx               # Route configuration
└── layouts/
    └── Sidebar.jsx                 # Sidebar menu
```

---

## Code Examples

### Example 1: Create Category
```javascript
const newCategory = {
  categoryname: "Medical Equipment",
  description: "Medical devices and equipment",
  isactive: 1,
  isdeleted: 0
};

await createAssetCategory(newCategory);
```

### Example 2: Update Category
```javascript
const updatedData = {
  categoryname: "IT & Electronics",
  description: "Updated description",
  isactive: 1
};

await updateAssetCategory(categoryId, updatedData);
```

### Example 3: Search Categories
```javascript
searchAssetCategories("IT Equipment");
```

### Example 4: Change Sort Order
```javascript
updateOrdering("-categoryname"); // Z to A
updateOrdering("categoryname");  // A to Z
```

### Example 5: Filter Active Categories
```javascript
const params = {
  isactive: 1,
  isdeleted: 0,
  page: 1,
  page_size: 20
};

await assetCategoriesAPI.getAll(params);
```

---

## Best Practices

1. **Always validate input** before sending to API
2. **Use debounce** for search (500ms recommended)
3. **Handle loading states** for better UX
4. **Show toast notifications** for user feedback
5. **Implement error boundaries** for graceful failures
6. **Use pagination** to limit dataset size
7. **Cache data** when appropriate
8. **Test on multiple browsers** and devices
9. **Follow existing code patterns** for consistency
10. **Document any deviations** from standard patterns

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

