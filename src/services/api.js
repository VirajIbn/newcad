import axios from 'axios';
import { toast } from 'react-toastify';

// ========================================
// CONFIGURATION
// ========================================
const DEBUG = true;
const API_TIMEOUT = 10000;

// ========================================
// API INSTANCE CREATION (Mocked - no real backend)
// ========================================
// Create single axios instance for all API calls (mocked)
const api = axios.create({
  baseURL: '', // No real backend
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for all API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Changed to match backend developer's token key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
    }
    
    // Debug logging if enabled
    if (DEBUG) {
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for all API calls
api.interceptors.response.use(
  (response) => {
    // Debug logging if enabled
    if (DEBUG) {

    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Debug logging if enabled
      if (DEBUG) {
        console.error(`❌ API Error: ${status} ${error.config?.url}`, data);
      }
      
      // Don't show error toasts on login page
      const isLoginPage = window.location.pathname === '/login';
      
      switch (status) {
        case 401:
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('user');
          if (!isLoginPage) {
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
          }
          break;
        case 403:
          if (!isLoginPage) {
            toast.error('You do not have permission to perform this action.');
          }
          break;
        case 404:
          if (!isLoginPage) {
            toast.error('Resource not found.');
          }
          break;
        case 500:
          if (!isLoginPage) {
            toast.error('Server error. Please try again later.');
          }
          break;
        default:
          if (!isLoginPage) {
            toast.error(data?.error || data?.message || 'An error occurred.');
          }
      }
    } else if (error.request) {
      // Don't show network error toasts on login page
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        toast.error('Network error. Please check your connection.');
      }
    } else {
      // Don't show generic error toasts on login page
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        toast.error('An unexpected error occurred.');
      }
    }
    
    return Promise.reject(error);
  }
);

// ========================================
// API ENDPOINTS (Matching Backend Developer's Structure)
// ========================================
// Authentication API endpoints (fully mocked for frontend‑only usage)
export const authenticationAPI = {
  // Mock login – accepts any credentials and returns a fake token + user
  login: async (credentials) => {
    const now = Date.now();
    const tokens = {
      access: `mock-access-token-${now}`,
      refresh: `mock-refresh-token-${now}`,
    };

    const user = {
      id: '1',
      name: credentials.email?.split('@')[0] || 'demo.user',
      username: credentials.email || 'demo@cadashboard.local',
      first_name: 'Demo',
      last_name: 'User',
      email: credentials.email || 'demo@cadashboard.local',
      role: 'ADMIN',
      orgId: 962834,
    };

    return {
      data: {
        tokens,
        user,
      },
    };
  },

  // Mock token test – always succeeds
  testToken: async () => {
    return { data: { valid: true } };
  },

  // Mock logout – no-op
  logout: async () => {
    return { data: { success: true } };
  },

  // Mock refresh – returns a new access token
  refresh: async () => {
    const newAccess = `mock-access-token-${Date.now()}`;
    return { data: { access: newAccess } };
  },

  // Mock profile – returns a basic profile derived from stored user
  profile: async () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return { data: JSON.parse(userStr) };
    }
    return {
      data: {
        id: '1',
        username: 'demo.user',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@cadashboard.local',
        role: 'ADMIN',
        orgId: 962834,
      },
    };
  },
};

// (Asset, maintenance, request, and dashboard APIs were removed because they
// are not used in the current frontend. If you reintroduce those features,
// re-add the corresponding API clients here.)

// Get JWT token from localStorage (matching backend developer's key)
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// ========================================
// MANUFACTURER API (using /assets/api/manufacturers/ with JWT authentication)
// ========================================
// API request helper (MOCKED - returns mock data instead of real API calls)
const apiRequest = async (endpoint, options = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock response based on endpoint
  const method = options.method || 'GET';
  
  if (method === 'DELETE') {
    return { success: true };
  }
  
  // Return empty result for GET requests (will be handled by specific API functions)
  return { results: [], count: 0 };
};

// Manufacturer API Service
export const manufacturerAPI = {
  // Get all manufacturers with pagination and filtering
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/manufacturers/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get public manufacturers (no authentication required)
  getPublic: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/manufacturers/public_manufacturers/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get active manufacturers only
  getActive: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/manufacturers/active_manufacturers/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get single manufacturer by ID
  getById: async (id) => {
    return apiRequest(`/manufacturers/${id}/`);
  },

  // Check for duplicate manufacturer based on name
  checkDuplicate: async (manufacturerName, orgId) => {
    try {
      // Use existing getAll endpoint with filters to check for duplicates
      const params = {
        manufacturername: manufacturerName,
        orgid: orgId,
        page_size: 1 // We only need to know if any exist
      };
      
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/manufacturers/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(endpoint);
      
      // Check if any manufacturers were found
      const hasDuplicates = response && (
        (response.results && response.results.length > 0) ||
        (Array.isArray(response) && response.length > 0)
      );
      
      // Get the first duplicate manufacturer details
      let duplicateManufacturer = null;
      if (hasDuplicates) {
        duplicateManufacturer = response.results?.[0] || response[0];
      }
      
      return {
        exists: hasDuplicates,
        count: hasDuplicates ? (response.results?.length || response.length || 0) : 0,
        duplicateManufacturer: duplicateManufacturer
      };
    } catch (error) {
      console.error('❌ manufacturerAPI: Check duplicate error:', error);
      // If there's an error checking for duplicates, assume no duplicate exists
      // This allows the creation to proceed and the backend will handle any actual duplicates
      return {
        exists: false,
        count: 0,
        duplicateManufacturer: null
      };
    }
  },

  // Create new manufacturer
  create: async (data) => {

    
    // Ensure we have the required fields with proper structure (matching Postman API)
    const manufacturerData = {
      manufacturername: data.manufacturername,
      description: data.description || '',
      orgid: data.orgid,
      addedby: data.addedby,
      modifiedby: data.modifiedby,
    };
    
    
    
    try {
      const response = await apiRequest('/manufacturers/', {
        method: 'POST',
        body: JSON.stringify(manufacturerData),
      });

      return response;
    } catch (error) {
      console.error('Create manufacturer error:', error);
      throw error;
    }
  },

  // Update manufacturer completely
  update: async (id, data) => {
    // Ensure we have the required fields with proper structure (matching Postman API)
    const manufacturerData = {
      manufacturername: data.manufacturername,
      description: data.description || '',
      orgid: data.orgid,
      addedby: data.addedby,
      modifiedby: data.modifiedby,
    };
    

    
    return apiRequest(`/manufacturers/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(manufacturerData),
    });
  },

  // Partial update manufacturer
  partialUpdate: async (id, data) => {
    return apiRequest(`/manufacturers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete manufacturer (soft delete)
  delete: async (id, modifiedby = null) => {
    const deleteData = {};
    if (modifiedby) {
      deleteData.modifiedby = modifiedby;
    }
    return apiRequest(`/manufacturers/${id}/`, {
      method: 'DELETE',
      body: Object.keys(deleteData).length > 0 ? JSON.stringify(deleteData) : undefined,
    });
  },

  // Search manufacturers
  search: async (searchTerm, params = {}) => {
    const searchParams = { 
      ...params, 
      search: searchTerm,
      q: searchTerm,
      query: searchTerm,
      keyword: searchTerm,
      // Add specific field searches for comprehensive search
      manufacturername: searchTerm,
      description: searchTerm
    };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/manufacturers/?${queryString}`;
    return apiRequest(endpoint);
  },
};

// ========================================
// ASSET TYPES API (using /assets/api/asset-types/ with JWT authentication)
// ========================================
// Asset Types API Service
export const assetTypesAPI = {
  // Get all asset types with pagination and filtering
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-types/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get active asset types only
  getActive: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-types/active_types/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get single asset type by ID
  getById: async (id) => {
    return apiRequest(`/asset-types/${id}/`);
  },

  // Check for duplicate asset type based on name or prefix
  checkDuplicate: async (assetTypeName, assetTypePrefix, orgId) => {
    try {
      // Use existing getAll endpoint with filters to check for duplicates
      const params = {
        orgid: orgId,
        page_size: 100 // Get more results to check both name and prefix
      };
      
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/asset-types/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(endpoint);
      
      // Check if any asset types were found
      const hasResults = response && (
        (response.results && response.results.length > 0) ||
        (Array.isArray(response) && response.length > 0)
      );
      
      if (!hasResults) {
        return {
          exists: false,
          count: 0,
          duplicateAssetType: null,
          duplicateType: null
        };
      }
      
      const assetTypes = response.results || response;
      
      // Check for duplicate name
      const nameDuplicate = assetTypes.find(assetType => 
        assetType.assettypename && 
        assetType.assettypename.toLowerCase() === assetTypeName.toLowerCase()
      );
      
      // Check for duplicate prefix
      const prefixDuplicate = assetTypes.find(assetType => 
        assetType.assettypeprefix && 
        assetType.assettypeprefix.toLowerCase() === assetTypePrefix.toLowerCase()
      );
      
      if (nameDuplicate) {
        return {
          exists: true,
          count: 1,
          duplicateAssetType: nameDuplicate,
          duplicateType: 'name'
        };
      }
      
      if (prefixDuplicate) {
        return {
          exists: true,
          count: 1,
          duplicateAssetType: prefixDuplicate,
          duplicateType: 'prefix'
        };
      }
      
      return {
        exists: false,
        count: 0,
        duplicateAssetType: null,
        duplicateType: null
      };
    } catch (error) {
      console.error('❌ assetTypesAPI: Check duplicate error:', error);
      // If there's an error checking for duplicates, assume no duplicate exists
      // This allows the creation to proceed and the backend will handle any actual duplicates
      return {
        exists: false,
        count: 0,
        duplicateAssetType: null,
        duplicateType: null
      };
    }
  },

  // Create new asset type
  create: async (data) => {
    // Ensure we have the required fields with proper structure
    const assetTypeData = {
      assettypename: data.assettypename,
      assettypeprefix: data.assettypeprefix || '',
      assetcategoryid: data.assetcategoryid, // Required field
      assetdepreciationrate: data.assetdepreciationrate || '',
      description: data.description || '',
      
      orgid: data.orgid,
      addedby: data.addedby,
      modifiedby: data.modifiedby,
    };
    
    try {
      const response = await apiRequest('/asset-types/', {
        method: 'POST',
        body: JSON.stringify(assetTypeData),
      });

      return response;
    } catch (error) {
      console.error('Create asset type error:', error);
      throw error;
    }
  },

  // Update asset type completely
  update: async (id, data) => {
    // Ensure we have the required fields with proper structure
    const assetTypeData = {
      assettypename: data.assettypename,
      assettypeprefix: data.assettypeprefix || '',
      assetcategoryid: data.assetcategoryid, // Required field
      assetdepreciationrate: data.assetdepreciationrate || '',
      description: data.description || '',
      orgid: data.orgid,
      addedby: data.addedby,
      modifiedby: data.modifiedby,
    };
    
    return apiRequest(`/asset-types/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(assetTypeData),
    });
  },

  // Partial update asset type
  partialUpdate: async (id, data) => {
    return apiRequest(`/asset-types/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete asset type (soft delete)
  delete: async (id, data = {}) => {
    return apiRequest(`/asset-types/${id}/`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  },

  // Search asset types
  search: async (searchTerm, params = {}) => {
    const searchParams = { 
      ...params, 
      search: searchTerm,
      q: searchTerm,
      query: searchTerm,
      keyword: searchTerm,
      // Add specific field searches for comprehensive search
      assettypename: searchTerm,
      description: searchTerm,
      assettypeprefix: searchTerm,
      assetdepreciationrate: searchTerm
    };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/asset-types/?${queryString}`;
    return apiRequest(endpoint);
  },
};

// ========================================
// ASSET CATEGORIES API (using /assets/api/asset-categories/ with JWT authentication)
// ========================================
// Asset Categories API Service
export const assetCategoriesAPI = {
  // Get all asset categories with pagination and filtering
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-categories/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get active asset categories only
  getActive: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-categories/active_categories/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get single asset category by ID
  getById: async (id) => {
    return apiRequest(`/asset-categories/${id}/`);
  },

  // Check for duplicate asset category based on name
  checkDuplicate: async (categoryName) => {
    try {
      // Use existing getAll endpoint with filters to check for duplicates
      const params = {
        categoryname: categoryName,
        page_size: 1 // We only need to know if any exist
      };
      
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/asset-categories/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(endpoint);
      
      // Check if any asset categories were found
      const hasDuplicates = response && (
        (response.results && response.results.length > 0) ||
        (Array.isArray(response) && response.length > 0)
      );
      
      // Get the first duplicate asset category details
      let duplicateCategory = null;
      if (hasDuplicates) {
        duplicateCategory = response.results?.[0] || response[0];
      }
      
      return {
        exists: hasDuplicates,
        count: hasDuplicates ? (response.results?.length || response.length || 0) : 0,
        duplicateCategory: duplicateCategory
      };
    } catch (error) {
      console.error('❌ assetCategoriesAPI: Check duplicate error:', error);
      // If there's an error checking for duplicates, assume no duplicate exists
      // This allows the creation to proceed and the backend will handle any actual duplicates
      return {
        exists: false,
        count: 0,
        duplicateCategory: null
      };
    }
  },

  // Create new asset category
  create: async (data) => {
    // Get current user ID from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Ensure we have the required fields with proper structure
    const assetCategoryData = {
      categoryname: data.categoryname,
      description: data.description || '',
      isactive: data.isactive !== undefined ? data.isactive : 1,
      isdeleted: 0, // Always 0 for new records
      modifiedby: userId, // Set to logged-in user ID
    };
    
    try {
      const response = await apiRequest('/asset-categories/', {
        method: 'POST',
        body: JSON.stringify(assetCategoryData),
      });

      return response;
    } catch (error) {
      console.error('Create asset category error:', error);
      throw error;
    }
  },

  // Update asset category (use PATCH for partial updates)
  update: async (id, data) => {
    // Get current user ID from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Ensure we have the required fields with proper structure
    const assetCategoryData = {
      categoryname: data.categoryname,
      description: data.description || '',
      isactive: data.isactive !== undefined ? data.isactive : 1,
      isdeleted: 0, // Keep as 0 for updates (use delete endpoint for soft delete)
      modifiedby: userId, // Set to logged-in user ID
    };
    
    return apiRequest(`/asset-categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(assetCategoryData),
    });
  },

  // Delete asset category (soft delete)
  delete: async (id) => {
    // Get current user ID from localStorage for audit trail
    const userData = localStorage.getItem('user');
    let userId = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const deleteData = {};
    if (userId) {
      deleteData.modifiedby = userId;
    }
    
    return apiRequest(`/asset-categories/${id}/`, {
      method: 'DELETE',
      body: Object.keys(deleteData).length > 0 ? JSON.stringify(deleteData) : undefined,
    });
  },

  // Search asset categories
  search: async (searchTerm, params = {}) => {
    const searchParams = { 
      ...params, 
      search: searchTerm,
    };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/asset-categories/?${queryString}`;
    return apiRequest(endpoint);
  },
};

// ========================================
// VENDOR API (using /assets/api/asset-vendors/ with JWT authentication)
// ========================================
// Vendor API Service
export const vendorAPI = {
  // Get all vendors with pagination and filtering
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-vendors/${queryString ? `?${queryString}` : ''}`;
    
    
    return apiRequest(endpoint);
  },

  // Get active vendors only
  getActive: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-vendors/active/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get single vendor by ID
  getById: async (id) => {
    return apiRequest(`/asset-vendors/${id}/`);
  },

  // Check for duplicate vendor based on name
  checkDuplicate: async (vendorName, orgId) => {
    try {
      // Use existing getAll endpoint with filters to check for duplicates
      const params = {
        vendorname: vendorName,
        orgid: orgId,
        page_size: 1 // We only need to know if any exist
      };
      
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/asset-vendors/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(endpoint);
      
      // Check if any vendors were found
      const hasDuplicates = response && (
        (response.results && response.results.length > 0) ||
        (Array.isArray(response) && response.length > 0)
      );
      
      // Get the first duplicate vendor details
      let duplicateVendor = null;
      if (hasDuplicates) {
        duplicateVendor = response.results?.[0] || response[0];
      }
      
      return {
        exists: hasDuplicates,
        count: hasDuplicates ? (response.results?.length || response.length || 0) : 0,
        duplicateVendor: duplicateVendor
      };
    } catch (error) {
      console.error('❌ vendorAPI: Check duplicate error:', error);
      // If there's an error checking for duplicates, assume no duplicate exists
      // This allows the creation to proceed and the backend will handle any actual duplicates
      return {
        exists: false,
        count: 0,
        duplicateVendor: null
      };
    }
  },

  // Create new vendor
  create: async (data) => {
    
    // Ensure we have the required fields with proper structure
    const vendorData = {
      vendorname: data.vendorname,
      gstno: data.gstno || '',
      contactperson: data.contactperson || '',
      email: data.email || '',
      mobilenumber: data.mobilenumber || '',
      address: data.address || '',
      countryid: data.countryid || null,
      stateid: data.stateid || null,
      cityid: data.cityid || null,
      zip: data.zip || '',
      description: data.description || '',
      orgid: data.orgid,
      addedby: data.addedby,
      modifiedby: data.modifiedby, // Set modifiedby same as addedby for new vendors
    };


    try {
      const response = await apiRequest('/asset-vendors/', {
        method: 'POST',
        body: JSON.stringify(vendorData),
      });

      return response;
    } catch (error) {
      console.error('❌ vendorAPI: Create vendor error:', error);
      throw error;
    }
  },

  // Update vendor completely
  update: async (id, data) => {
    // Ensure we have the required fields with proper structure
    const vendorData = {
      vendorname: data.vendorname,
      gstno: data.gstno || '',
      contactperson: data.contactperson || '',
      email: data.email || '',
      mobilenumber: data.mobilenumber || '',
      address: data.address || '',
      countryid: data.countryid || null,
      stateid: data.stateid || null,
      cityid: data.cityid || null,
      zip: data.zip || '',
      description: data.description || '',
      orgid: data.orgid,
      modifiedby: data.modifiedby, // Include modifiedby for updates
    };

    return apiRequest(`/asset-vendors/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  },

  // Partial update vendor
  partialUpdate: async (id, data) => {
    return apiRequest(`/asset-vendors/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete vendor (soft delete)
  delete: async (id, modifiedBy) => {
    return apiRequest(`/asset-vendors/${id}/`, {
      method: 'DELETE',
      body: JSON.stringify({ modifiedby: modifiedBy }),
    });
  },

  // Search vendors
  search: async (searchTerm, params = {}) => {
    // Try different search parameter names that the backend might expect
    const searchParams = { 
      ...params, 
      search: searchTerm,
      q: searchTerm,           // Alternative search parameter
      query: searchTerm,       // Another alternative
      keyword: searchTerm,     // Yet another alternative
      // Add specific field searches for comprehensive search
      vendorname: searchTerm,
      contactperson: searchTerm,
      gstno: searchTerm,
      email: searchTerm,
      mobilenumber: searchTerm,
      address: searchTerm,
      cityname: searchTerm,
      statename: searchTerm,
      zip: searchTerm
    };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/asset-vendors/?${queryString}`;
    return apiRequest(endpoint);
  },
};

// ========================================
// COUNTRIES API ENDPOINTS (MOCKED)
// ========================================
const MOCK_COUNTRIES = [
  { id: 1, countryid: 1, countryname: 'India', countrycode: 'IN', isactive: 1 },
  { id: 2, countryid: 2, countryname: 'United States', countrycode: 'US', isactive: 1 },
  { id: 3, countryid: 3, countryname: 'United Kingdom', countrycode: 'GB', isactive: 1 },
  { id: 4, countryid: 4, countryname: 'Canada', countrycode: 'CA', isactive: 1 },
  { id: 5, countryid: 5, countryname: 'Australia', countrycode: 'AU', isactive: 1 },
  { id: 6, countryid: 6, countryname: 'Germany', countrycode: 'DE', isactive: 1 },
  { id: 7, countryid: 7, countryname: 'France', countrycode: 'FR', isactive: 1 },
  { id: 8, countryid: 8, countryname: 'Japan', countrycode: 'JP', isactive: 1 },
];

export const countriesAPI = {
  // Get all active countries for dropdown (MOCKED)
  getActiveCountries: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_COUNTRIES.filter(c => c.isactive === 1);
  },

  // Get all countries (MOCKED)
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    let results = [...MOCK_COUNTRIES];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      results = results.filter(c => 
        c.countryname.toLowerCase().includes(search) || 
        c.countrycode.toLowerCase().includes(search)
      );
    }
    
    return { results, count: results.length };
  },

  // Search countries by name or code (MOCKED)
  searchCountries: async (searchTerm) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const search = searchTerm.toLowerCase();
    return MOCK_COUNTRIES.filter(c => 
      c.countryname.toLowerCase().includes(search) || 
      c.countrycode.toLowerCase().includes(search)
    );
  },

  // Get country by ID (MOCKED)
  getById: async (countryId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_COUNTRIES.find(c => c.id === countryId || c.countryid === countryId) || null;
  },

  // Filter countries with custom parameters (MOCKED)
  filter: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    let results = [...MOCK_COUNTRIES];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(c => 
        c.countryname.toLowerCase().includes(search) || 
        c.countrycode.toLowerCase().includes(search)
      );
    }
    
    return { results, count: results.length };
  },
};

// ========================================
// STATES API ENDPOINTS (MOCKED)
// ========================================
const MOCK_STATES = [
  { id: 1, stateid: 1, statename: 'Maharashtra', statecode: 'MH', countryid: 1, isactive: 1 },
  { id: 2, stateid: 2, statename: 'Karnataka', statecode: 'KA', countryid: 1, isactive: 1 },
  { id: 3, stateid: 3, statename: 'Tamil Nadu', statecode: 'TN', countryid: 1, isactive: 1 },
  { id: 4, stateid: 4, statename: 'Gujarat', statecode: 'GJ', countryid: 1, isactive: 1 },
  { id: 5, stateid: 5, statename: 'Delhi', statecode: 'DL', countryid: 1, isactive: 1 },
  { id: 6, stateid: 6, statename: 'California', statecode: 'CA', countryid: 2, isactive: 1 },
  { id: 7, stateid: 7, statename: 'Texas', statecode: 'TX', countryid: 2, isactive: 1 },
  { id: 8, stateid: 8, statename: 'New York', statecode: 'NY', countryid: 2, isactive: 1 },
];

export const statesAPI = {
  // Get all active states (MOCKED)
  getActiveStates: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STATES.filter(s => s.isactive === 1);
  },

  // Get states by country (for cascading dropdown) (MOCKED)
  getStatesByCountry: async (countryId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STATES.filter(s => s.countryid === countryId && s.isactive === 1);
  },

  // Debug states (for development/testing) (MOCKED)
  getDebugStates: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STATES;
  },

  // Get state by ID (MOCKED)
  getById: async (stateId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STATES.find(s => s.id === stateId || s.stateid === stateId) || null;
  },
};

// ========================================
// CITIES API ENDPOINTS (MOCKED)
// ========================================
const MOCK_CITIES = [
  { id: 1, cityid: 1, cityname: 'Mumbai', stateid: 1, isactive: 1 },
  { id: 2, cityid: 2, cityname: 'Pune', stateid: 1, isactive: 1 },
  { id: 3, cityid: 3, cityname: 'Bangalore', stateid: 2, isactive: 1 },
  { id: 4, cityid: 4, cityname: 'Mysore', stateid: 2, isactive: 1 },
  { id: 5, cityid: 5, cityname: 'Chennai', stateid: 3, isactive: 1 },
  { id: 6, cityid: 6, cityname: 'Coimbatore', stateid: 3, isactive: 1 },
  { id: 7, cityid: 7, cityname: 'Ahmedabad', stateid: 4, isactive: 1 },
  { id: 8, cityid: 8, cityname: 'Surat', stateid: 4, isactive: 1 },
  { id: 9, cityid: 9, cityname: 'New Delhi', stateid: 5, isactive: 1 },
  { id: 10, cityid: 10, cityname: 'Los Angeles', stateid: 6, isactive: 1 },
  { id: 11, cityid: 11, cityname: 'San Francisco', stateid: 6, isactive: 1 },
  { id: 12, cityid: 12, cityname: 'Houston', stateid: 7, isactive: 1 },
  { id: 13, cityid: 13, cityname: 'Dallas', stateid: 7, isactive: 1 },
  { id: 14, cityid: 14, cityname: 'New York City', stateid: 8, isactive: 1 },
  { id: 15, cityid: 15, cityname: 'Buffalo', stateid: 8, isactive: 1 },
];

export const citiesAPI = {
  // Get all active cities (MOCKED)
  getActiveCities: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_CITIES.filter(c => c.isactive === 1);
  },

  // Get cities by state (for cascading dropdown) (MOCKED)
  getCitiesByState: async (stateId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_CITIES.filter(c => c.stateid === stateId && c.isactive === 1);
  },

  // Get city by ID (MOCKED)
  getById: async (cityId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_CITIES.find(c => c.id === cityId || c.cityid === cityId) || null;
  },
};

// ========================================
// ASSET LOGS API ENDPOINTS
// ========================================
// In‑memory mock asset logs to avoid backend calls
// Structured to match the UI layout shown in the provided screenshot:
// Sr No | Description                                            | Added By | Added Date
// 1     | Asset IBN/KB/2 created by Leo Sharma on 16-Sep-25      | Mahesh   | 16-Sep-25 06:42 PM
// 2     | Asset IBN/KB/2 stored to location IT Operation on ...  | Mahesh   | 16-Sep-25 06:42 PM
// Base example used to derive text for every record
const CREATED_BY_NAMES = ['Leo Sharma', 'Anita Rao', 'Rahul Mehta', 'Sneha Patil'];
const ADDED_BY_NAMES = ['Mahesh', 'Admin', 'System'];
const LOCATIONS = ['IT Operation', 'Head Office Store', 'Warehouse A', 'Branch B Store'];

// Generate logs for any asset ID following the provided sentence structure:
// "Asset IBN/KB/{n} created by {Name} on {DD-MMM-YY}"
// "Asset IBN/KB/{n} stored to location {Location} on {DD-MMM-YY}"
const generateAssetLogs = (assetId, assetNumber) => {
  const idNumber = Number(assetId) || 0;
  const now = new Date();

  // Deterministic but varied dates: created yesterday, stored today
  const createdDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const storedDate = new Date(now.getTime());

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const formatDisplayDate = (d) => {
    const day = pad(d.getDate());
    const mon = MONTHS[d.getMonth()];
    const yr = d.getFullYear().toString().slice(-2);
    return `${day}-${mon}-${yr}`;
  };

  const assetCode = assetNumber || `Asset-${idNumber}`;
  // Creator name (first + last) used in description
  const createdBy = CREATED_BY_NAMES[idNumber % CREATED_BY_NAMES.length];
  // "Added By" column should show the same person who created the asset
  const addedBy = createdBy;
  const location = LOCATIONS[idNumber % LOCATIONS.length];
  const createdOnText = formatDisplayDate(createdDate);
  const storedOnText = formatDisplayDate(storedDate);

  return [
    {
      assetlogid: idNumber * 10 + 1,
      description: `Asset ${assetCode} created by ${createdBy} on ${createdOnText}`,
      addedby_username: addedBy,
      addeddate: createdDate.toISOString(),
    },
    {
      assetlogid: idNumber * 10 + 2,
      description: `Asset ${assetCode} stored to location ${location} on ${storedOnText}`,
      addedby_username: addedBy,
      addeddate: storedDate.toISOString(),
    },
  ];
};

export const assetLogsAPI = {
  // Get asset logs by asset ID (mocked)
  getByAssetId: async (assetId, assetNumber) => {
    if (!assetId || assetId === 0 || assetId === '0') {
      throw new Error('Asset ID is required and must be a valid number');
    }
    const logs = generateAssetLogs(assetId, assetNumber);

    return {
      count: logs.length,
      results: logs,
    };
  },
};

// ========================================
// ASSET DETAILS API ENDPOINTS
// ========================================
export const assetDetailsAPI = {
  // Get all asset details with pagination and filtering
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-details/${queryString ? `?${queryString}` : ''}`;
    
    
    return apiRequest(endpoint);
  },

  // Get active assets only
  getActive: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/asset-details/active_assets/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get high value assets
  getHighValue: async (threshold = 10000, params = {}) => {
    const searchParams = { ...params, threshold };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/asset-details/high_value_assets/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get asset detail by ID
  getById: async (id) => {
    try {
      const response = await apiRequest(`/asset-details/${id}/`);
      return response;
    } catch (error) {
      console.error('Error fetching asset detail by ID:', error);
      throw error;
    }
  },

  // Check for duplicate asset based on model and serial number
  checkDuplicate: async (model, serialNumber, orgId = 962834) => {
    try {
      
      // Use existing getAll endpoint with filters to check for duplicates
      const params = {
        model: model,
        serialnumber: serialNumber,
        orgid: orgId,
        page_size: 1 // We only need to know if any exist
      };
      
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/asset-details/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(endpoint);
      
      // Check if any assets were found
      const hasDuplicates = response && (
        (response.results && response.results.length > 0) ||
        (Array.isArray(response) && response.length > 0)
      );
      
      // Get the first duplicate asset details
      let duplicateAsset = null;
      if (hasDuplicates) {
        duplicateAsset = response.results?.[0] || response[0];
      }
      
      return {
        exists: hasDuplicates,
        count: hasDuplicates ? (response.results?.length || response.length || 0) : 0,
        duplicateAsset: duplicateAsset
      };
    } catch (error) {
      console.error('❌ assetDetailsAPI: Check duplicate error:', error);
      // If there's an error checking for duplicates, assume no duplicate exists
      // This allows the creation to proceed and the backend will handle any actual duplicates
      return {
        exists: false,
        count: 0,
        duplicateAsset: null
      };
    }
  },

  // Create new asset detail
  create: async (data) => {
    // Ensure we have the required fields with proper structure
    const assetData = {
      orgid: data.orgid,
      assettypeid: data.assettypeid || null,
      status: data.status !== undefined ? data.status : 1,
      manufacturerid: data.manufacturerid || null,
      vendorid: data.vendorid || null,
      model: data.model || '',
      serialnumber: data.serialnumber || '',
      purchasedate: data.purchasedate || null,
      purchasecost: data.purchasecost || '0.00',
      branchid: data.branchid || null,
      departmentid: data.departmentid || null,
      depreciationrate: data.depreciationrate || '0.00',
      currentvalue: data.currentvalue || '0.00',
      acquisitiontype: data.acquisitiontype || '',
      conditionid: data.conditionid || null,
      warrantystartdate: data.warrantystartdate || null,
      warrantyenddate: data.warrantyenddate || null,
      insurancedetails: data.insurancedetails || '',
      description: data.description || '',
      employeeid: data.employeeid || null,
      addedby: data.addedby,
      modifiedby: data.modifiedby,
      storedlocation: data.storedlocation || '',
      financialyearid: data.financialyearid || new Date().getFullYear(),
      assignedondate: data.assignedondate || null,
    };

    try {
      const response = await apiRequest('/asset-details/', {
        method: 'POST',
        body: JSON.stringify(assetData),
      });
      return response;
    } catch (error) {
      console.error('❌ assetDetailsAPI: Create asset error:', error);
      throw error;
    }
  },

  // Update asset detail
  update: async (id, data) => {
    const assetData = {
      orgid: data.orgid,
      assettypeid: data.assettypeid || null,
      status: data.status !== undefined ? data.status : 1,
      manufacturerid: data.manufacturerid || null,
      vendorid: data.vendorid || null,
      model: data.model || '',
      serialnumber: data.serialnumber || '',
      purchasedate: data.purchasedate || null,
      purchasecost: data.purchasecost || '0.00',
      branchid: data.branchid || null,
      departmentid: data.departmentid || null,
      depreciationrate: data.depreciationrate || '0.00',
      currentvalue: data.currentvalue || '0.00',
      acquisitiontype: data.acquisitiontype || '',
      conditionid: data.conditionid || null,
      warrantystartdate: data.warrantystartdate || null,
      warrantyenddate: data.warrantyenddate || null,
      insurancedetails: data.insurancedetails || '',
      description: data.description || '',
      employeeid: data.employeeid || null,
      addedby: data.addedby,
      modifiedby: data.modifiedby,
      storedlocation: data.storedlocation || '',
      financialyearid: data.financialyearid || new Date().getFullYear(),
      assignedondate: data.assignedondate || null,
    };

    return apiRequest(`/asset-details/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    });
  },

  // Partial update asset detail
  patch: async (id, data) => {
    return apiRequest(`/asset-details/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete asset detail (soft delete)
  delete: async (id, modifiedby = null) => {
    // Validate ID before making API request
    if (!id || id === 0 || id === '0') {
      const errorMsg = 'Invalid asset ID. Cannot delete asset with ID: ' + id;
      console.error('❌ assetDetailsAPI: delete - Invalid ID:', id);
      throw new Error(errorMsg);
    }
    
    const deleteData = {};
    if (modifiedby) {
      deleteData.modifiedby = modifiedby;
    }
    
    return apiRequest(`/asset-details/${id}/`, {
      method: 'DELETE',
      body: Object.keys(deleteData).length > 0 ? JSON.stringify(deleteData) : undefined,
    });
  },

  // Search asset details
  search: async (searchTerm, params = {}) => {
    const searchParams = { 
      ...params, 
      search: searchTerm,
      q: searchTerm,           // Alternative search parameter
      query: searchTerm,       // Another alternative
      keyword: searchTerm,     // Yet another alternative
      // Add specific field searches for comprehensive search
      assetnumber: searchTerm,
      model: searchTerm,
      serialnumber: searchTerm,
      assettype_name: searchTerm,
      manufacturer_name: searchTerm,
      vendor_name: searchTerm,
      assigned_employee_name: searchTerm,
      storedlocation: searchTerm
    };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `/asset-details/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },
};

// ========================================
// UTILITY FUNCTIONS
// (Developer-only test helpers for API connectivity were removed because they
// are not used by the running app. Reintroduce them if you need manual tests.)

// DROPDOWN API ENDPOINTS (NEW STANDARDIZED SYSTEM)
export const dropdownAPI = {
  // Asset Dropdowns
  getAssetStatus: async () => {
    // Mocked
    return [
      { codeid: 481, codename: 'In Stock' },
      { codeid: 482, codename: 'In Repair' },
      { codeid: 483, codename: 'Retired' },
      { codeid: 484, codename: 'Assigned' },
      { codeid: 485, codename: 'Scrapped' },
    ];
  },

  getAssetCondition: async () => {
    // Mocked - codes aligned with AssetDetailsModal condition color mapping
    return [
      { codeid: 1, codename: 'Excellent' },
      { codeid: 2, codename: 'Good' },
      { codeid: 3, codename: 'Fair' },
      { codeid: 4, codename: 'Poor' },
      { codeid: 5, codename: 'Critical' },
    ];
  },

  getBranches: async (orgId) => {
    // Mocked
    return [
      { branchid: 1, branchname: 'Head Office', orgid: orgId },
      { branchid: 2, branchname: 'Branch A', orgid: orgId },
      { branchid: 3, branchname: 'Branch B', orgid: orgId },
    ];
  },

  getDepartments: async (orgId) => {
    // Mocked
    return [
      { departmentid: 11, departmentname: 'IT', orgid: orgId },
      { departmentid: 12, departmentname: 'Finance', orgid: orgId },
      { departmentid: 13, departmentname: 'HR', orgid: orgId },
    ];
  },

  // Employee Dropdown (authentication required)
  getActiveEmployees: async () => {
    // Mocked
    return [
      { id: 201, name: 'Alice Smith', employeeid: 201 },
      { id: 202, name: 'Bob Lee', employeeid: 202 },
      { id: 203, name: 'Charlie Kim', employeeid: 203 },
      { id: 204, name: 'Dana Fox', employeeid: 204 },
    ];
  },

  // CRM Dropdowns (MOCKED)
  getCrmDealStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { codeid: 101, codename: 'New' },
      { codeid: 102, codename: 'Qualified' },
      { codeid: 103, codename: 'Proposal' },
      { codeid: 104, codename: 'Negotiation' },
      { codeid: 105, codename: 'Won' },
      { codeid: 106, codename: 'Lost' },
    ];
  },

  getCrmLeadStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { codeid: 201, codename: 'New' },
      { codeid: 202, codename: 'Contacted' },
      { codeid: 203, codename: 'Qualified' },
      { codeid: 204, codename: 'Converted' },
      { codeid: 205, codename: 'Lost' },
    ];
  },

  getCrmLeadSource: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { codeid: 301, codename: 'Website' },
      { codeid: 302, codename: 'Referral' },
      { codeid: 303, codename: 'Social Media' },
      { codeid: 304, codename: 'Email Campaign' },
      { codeid: 305, codename: 'Cold Call' },
    ];
  },

  // Organization Dropdowns
  getClientType: async () => {
    // Mocked
    return [
      { codeid: 901, codename: 'Enterprise' },
      { codeid: 902, codename: 'SMB' },
      { codeid: 903, codename: 'Government' },
    ];
  },

  getPaymentStatus: async () => {
    // Mocked
    return [
      { codeid: 921, codename: 'Paid' },
      { codeid: 922, codename: 'Pending' },
      { codeid: 923, codename: 'Overdue' },
    ];
  },

  getIndustryType: async () => {
    // Mocked
    return [
      { codeid: 911, codename: 'Technology' },
      { codeid: 912, codename: 'Finance' },
      { codeid: 913, codename: 'Manufacturing' },
    ];
  },

  // Compliance & Task Dropdowns
  getComplianceStatus: async () => {
    // Mocked
    return [
      { codeid: 931, codename: 'Open' },
      { codeid: 932, codename: 'In Progress' },
      { codeid: 933, codename: 'Closed' },
    ];
  },

  getComplianceType: async () => {
    // Mocked
    return [
      { codeid: 941, codename: 'Policy' },
      { codeid: 942, codename: 'Legal' },
      { codeid: 943, codename: 'Safety' },
    ];
  },

  getTaskStatus: async () => {
    // Mocked
    return [
      { codeid: 951, codename: 'Open' },
      { codeid: 952, codename: 'In Progress' },
      { codeid: 953, codename: 'Done' },
    ];
  },

  getTaskPriority: async () => {
    // Mocked
    return [
      { codeid: 961, codename: 'Low' },
      { codeid: 962, codename: 'Medium' },
      { codeid: 963, codename: 'High' },
    ];
  },


  // General Utility Dropdowns (MOCKED)
  getGender: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { codeid: 1, codename: 'Male' },
      { codeid: 2, codename: 'Female' },
      { codeid: 3, codename: 'Other' },
    ];
  },

  getPaymentMode: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { codeid: 1, codename: 'Cash' },
      { codeid: 2, codename: 'Credit Card' },
      { codeid: 3, codename: 'Bank Transfer' },
      { codeid: 4, codename: 'Cheque' },
      { codeid: 5, codename: 'UPI' },
    ];
  },

  // Developer Tools (MOCKED)
  getCodesByGroup: async (codeGroup) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  },

  getAllDropdownGroups: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  },

  // Financial Year API - Updated to match new backend parameters
  getFinancialYears: async (orgId, params = {}) => {
    // Mocked list with fields matching UI expectations
    const allYears = [
      { id: 0, financialyearid: 0, fyname: 'All Financial Year', isclosed: 0, isdefault: 0, orgid: orgId },
      { id: 1, financialyearid: 1, fyname: 'FY 2024-25',        isclosed: 0, isdefault: 1, orgid: orgId },
      { id: 2, financialyearid: 2, fyname: 'FY 2023-24',        isclosed: 1, isdefault: 0, orgid: orgId },
    ];
    // Apply simple filters if provided
    let filtered = [...allYears];
    if (params.isclosed !== undefined) {
      filtered = filtered.filter(y => Number(y.isclosed) === Number(params.isclosed));
    }
    return filtered;
  },

  getCurrentFinancialYear: async (orgId) => {
    // Mocked default/open FY
    return { id: 1, financialyearid: 1, fyname: 'FY 2024-25', isclosed: 0, isdefault: 1, orgid: orgId };
  },

  // Get active financial years (open years)
  getActiveFinancialYears: async (orgId, params = {}) => {
    const years = await dropdownAPI.getFinancialYears(orgId, { ...params, isclosed: 0 });
    return years;
  },

  // Get closed financial years
  getClosedFinancialYears: async (orgId, params = {}) => {
    const years = await dropdownAPI.getFinancialYears(orgId, { ...params, isclosed: 1 });
    return years;
  }
};

// ========================================
// BUSINESS UNIT API (MOCKED)
// ========================================
const MOCK_BUSINESS_UNITS = [
  { id: 1, buid: 1, buname: 'IT Services', bucode: 'IT', isactive: 1, orgid: 962834 },
  { id: 2, buid: 2, buname: 'Finance', bucode: 'FIN', isactive: 1, orgid: 962834 },
  { id: 3, buid: 3, buname: 'HR', bucode: 'HR', isactive: 1, orgid: 962834 },
  { id: 4, buid: 4, buname: 'Operations', bucode: 'OPS', isactive: 1, orgid: 962834 },
];

export const businessUnitAPI = {
  // Get all business units with pagination and filtering (MOCKED)
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let results = [...MOCK_BUSINESS_UNITS];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      results = results.filter(bu => 
        bu.buname.toLowerCase().includes(search) || 
        bu.bucode.toLowerCase().includes(search)
      );
    }
    
    return { results, count: results.length };
  },

  // Get active business units only (MOCKED)
  getActive: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let results = MOCK_BUSINESS_UNITS.filter(bu => bu.isactive === 1);
    
    if (params.search) {
      const search = params.search.toLowerCase();
      results = results.filter(bu => 
        bu.buname.toLowerCase().includes(search) || 
        bu.bucode.toLowerCase().includes(search)
      );
    }
    
    return { results, count: results.length };
  },

  // Get single business unit by ID (MOCKED)
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_BUSINESS_UNITS.find(bu => bu.id === id || bu.buid === id) || null;
  },

  // Create new business unit (MOCKED)
  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...MOCK_BUSINESS_UNITS.map(bu => bu.id)) + 1;
    const newBU = {
      id: newId,
      buid: newId,
      ...data,
      isactive: data.isactive !== undefined ? data.isactive : 1,
    };
    MOCK_BUSINESS_UNITS.push(newBU);
    return newBU;
  },

  // Update business unit completely (MOCKED)
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = MOCK_BUSINESS_UNITS.findIndex(bu => bu.id === id || bu.buid === id);
    if (index !== -1) {
      MOCK_BUSINESS_UNITS[index] = { ...MOCK_BUSINESS_UNITS[index], ...data };
      return MOCK_BUSINESS_UNITS[index];
    }
    throw new Error('Business unit not found');
  },

  // Partial update business unit (MOCKED)
  partialUpdate: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = MOCK_BUSINESS_UNITS.findIndex(bu => bu.id === id || bu.buid === id);
    if (index !== -1) {
      MOCK_BUSINESS_UNITS[index] = { ...MOCK_BUSINESS_UNITS[index], ...data };
      return MOCK_BUSINESS_UNITS[index];
    }
    throw new Error('Business unit not found');
  },

  // Delete business unit (soft delete) (MOCKED)
  delete: async (id, modifiedby = null) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = MOCK_BUSINESS_UNITS.findIndex(bu => bu.id === id || bu.buid === id);
    if (index !== -1) {
      MOCK_BUSINESS_UNITS[index].isactive = 0;
      return { success: true };
    }
    throw new Error('Business unit not found');
  },

  // Search business units (MOCKED)
  search: async (searchTerm, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const search = searchTerm.toLowerCase();
    const results = MOCK_BUSINESS_UNITS.filter(bu => 
      bu.buname.toLowerCase().includes(search) || 
      bu.bucode.toLowerCase().includes(search) ||
      (bu.description && bu.description.toLowerCase().includes(search))
    );
    return { results, count: results.length };
  },
};

// EXPORTS
// ========================================
// Export the main API instance
export { api };

// Export default
export default api; 