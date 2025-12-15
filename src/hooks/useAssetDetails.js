import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Static mock assets to avoid hitting the real API
const MOCK_ASSETS = [
  {
    assetid: 1,
    assetdetailsid: 1,
    assetnumber: 'AST-0001',
    model: 'Latitude 7420',
    categoryname: 'IT Hardware',
    assettype_name: 'Laptop',
    manufacturer_name: 'Dell',
    vendor_name: 'Acme Supplies',
    serialnumber: 'SN-LAP-001',
    assigned_employee_name: 'Alice Smith',
    assignedondate: '2024-10-05',
    departmentid: 11, // IT
    conditionid: 2,   // Good
    status: 481, // In Stock
    purchasedate: '2024-01-15',
    addeddate: '2024-01-20',
    financialyearid: 1,
  },
  {
    assetid: 2,
    assetdetailsid: 2,
    assetnumber: 'AST-0002',
    model: 'ThinkPad X1',
    categoryname: 'IT Hardware',
    assettype_name: 'Laptop',
    manufacturer_name: 'Lenovo',
    vendor_name: 'Northwind Traders',
    serialnumber: 'SN-LAP-002',
    assigned_employee_name: 'Bob Lee',
    assignedondate: '2024-09-25',
    departmentid: 12, // Finance
    conditionid: 1,   // Excellent
    status: 484, // Assigned
    purchasedate: '2024-02-10',
    addeddate: '2024-02-12',
    financialyearid: 1,
  },
  {
    assetid: 3,
    assetdetailsid: 3,
    assetnumber: 'AST-0003',
    model: 'PowerEdge R740',
    categoryname: 'Servers',
    assettype_name: 'Server',
    manufacturer_name: 'Dell',
    vendor_name: 'Globex Supplies',
    serialnumber: 'SN-SRV-001',
    assigned_employee_name: 'Charlie Kim',
    assignedondate: '2023-12-10',
    departmentid: 11, // IT
    conditionid: 3,   // Fair
    status: 484, // Assigned
    purchasedate: '2023-12-05',
    addeddate: '2023-12-06',
    financialyearid: 1,
  },
  {
    assetid: 4,
    assetdetailsid: 4,
    assetnumber: 'AST-0004',
    model: 'Catalyst 9300',
    categoryname: 'Networking',
    assettype_name: 'Switch',
    manufacturer_name: 'Cisco',
    vendor_name: 'Stark Procurement',
    serialnumber: 'SN-SWT-001',
    assigned_employee_name: 'Dana Fox',
    assignedondate: '2023-11-05',
    departmentid: 11, // IT
    conditionid: 4,   // Poor
    warrantyenddate: '2025-11-01',
    status: 482, // In Repair
    purchasedate: '2023-11-01',
    addeddate: '2023-11-03',
    financialyearid: 1,
  },
  {
    assetid: 5,
    assetdetailsid: 5,
    assetnumber: 'AST-0005',
    model: 'ImageRunner 2425',
    categoryname: 'Office Equipment',
    assettype_name: 'Printer',
    manufacturer_name: 'Canon',
    vendor_name: 'Wayne Logistics',
    serialnumber: 'SN-PRN-001',
    assigned_employee_name: 'Evan Cole',
    assignedondate: '2024-03-10',
    departmentid: 13, // HR
    conditionid: 2,   // Good
    storedlocation: 'Head Office / Print Room',
    status: 481, // In Stock
    purchasedate: '2024-03-02',
    addeddate: '2024-03-04',
    financialyearid: 1,
  },
  {
    assetid: 6,
    assetdetailsid: 6,
    assetnumber: 'AST-0006',
    model: 'Desk Pro',
    categoryname: 'Furniture',
    assettype_name: 'Desk',
    manufacturer_name: 'IKEA',
    vendor_name: 'Umbrella Supplies',
    serialnumber: 'SN-DSK-001',
    assigned_employee_name: 'Fiona Diaz',
    assignedondate: '2024-04-15',
    departmentid: 11, // IT
    conditionid: 2,   // Good
    warrantyenddate: '2027-04-10',
    storedlocation: 'Head Office / Workstation Area',
    status: 481, // In Stock
    purchasedate: '2024-04-10',
    addeddate: '2024-04-12',
    financialyearid: 1,
  },
  {
    assetid: 7,
    assetdetailsid: 7,
    assetnumber: 'AST-0007',
    model: 'Ergo Chair',
    categoryname: 'Furniture',
    assettype_name: 'Chair',
    manufacturer_name: 'Herman Miller',
    vendor_name: 'Wonka Imports',
    serialnumber: 'SN-CHR-001',
    assigned_employee_name: 'George Yang',
    assignedondate: '2022-07-18',
    departmentid: 13, // HR
    conditionid: 5,   // Critical
    warrantyenddate: '2025-07-15',
    status: 483, // Retired
    purchasedate: '2022-07-15',
    addeddate: '2022-07-20',
    financialyearid: 0,
  },
  {
    assetid: 8,
    assetdetailsid: 8,
    assetnumber: 'AST-0008',
    model: 'Galaxy Tab',
    categoryname: 'Mobility',
    assettype_name: 'Tablet',
    manufacturer_name: 'Samsung',
    vendor_name: 'Soylent Distribution',
    serialnumber: 'SN-TAB-001',
    assigned_employee_name: 'Hannah Roe',
    assignedondate: '2024-05-08',
    departmentid: 12, // Finance
    conditionid: 2,   // Good
    warrantyenddate: '2026-05-05',
    storedlocation: 'Branch A / Sales Office',
    status: 481, // In Stock
    purchasedate: '2024-05-05',
    addeddate: '2024-05-06',
    financialyearid: 1,
  },
  {
    assetid: 9,
    assetdetailsid: 9,
    assetnumber: 'AST-0009',
    model: 'iPhone 14',
    categoryname: 'Mobility',
    assettype_name: 'Phone',
    manufacturer_name: 'Apple',
    vendor_name: 'Cyberdyne Partners',
    serialnumber: 'SN-PHN-001',
    assigned_employee_name: 'Ian Shaw',
    assignedondate: '2024-05-22',
    departmentid: 11, // IT
    conditionid: 1,   // Excellent
    warrantyenddate: '2026-05-20',
    storedlocation: 'Branch B / Field Team',
    status: 481, // In Stock
    purchasedate: '2024-05-20',
    addeddate: '2024-05-21',
    financialyearid: 1,
  },
  {
    assetid: 10,
    assetdetailsid: 10,
    assetnumber: 'AST-0010',
    model: 'Logitech Rally',
    categoryname: 'Collaboration',
    assettype_name: 'Video Conferencing',
    manufacturer_name: 'Logitech',
    vendor_name: 'Acme Supplies',
    serialnumber: 'SN-VC-001',
    assigned_employee_name: 'Jane Wu',
    assignedondate: '2024-06-05',
    departmentid: 11, // IT
    conditionid: 2,   // Good
    warrantyenddate: '2027-06-01',
    storedlocation: 'Head Office / Meeting Room 1',
    status: 481, // In Stock
    purchasedate: '2024-06-01',
    addeddate: '2024-06-02',
    financialyearid: 1,
  },
];

export const useAssetDetails = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 0,
    pageSize: 10
  });
  
  // Store current fetch parameters to maintain state after CRUD operations
  const [currentParams, setCurrentParams] = useState({});
  const mockDataRef = useRef([...MOCK_ASSETS]);

  // Fetch all asset details (mock)
  const fetchAssets = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    // Store current parameters for future use
    setCurrentParams(params);
    
    try {
      const {
        search = '',
        ordering = '-addeddate',
        page = 1,
        page_size = 10,
        // financialyearid intentionally ignored for mocks to always show data
        financialyearid,
        ...restFilters
      } = params;

      let data = [...mockDataRef.current];

      // Apply additional filters (simple equality)
      Object.entries(restFilters || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          data = data.filter((item) => (item[key] ?? '').toString() === value.toString());
        }
      });

      // Apply search
      if (search) {
        const searchLower = search.toLowerCase();
        data = data.filter((item) =>
          [
            item.assetnumber,
            item.model,
            item.categoryname,
            item.assettype_name,
            item.manufacturer_name,
            item.vendor_name,
            item.serialnumber,
            item.assigned_employee_name,
            item.status,
          ]
            .filter(Boolean)
            .some((field) => field.toString().toLowerCase().includes(searchLower))
        );
      }

      // Sorting
      if (ordering) {
        const isDesc = ordering.startsWith('-');
        const key = isDesc ? ordering.slice(1) : ordering;
        data.sort((a, b) => {
          const first = a[key] ?? '';
          const second = b[key] ?? '';
          if (first < second) return isDesc ? 1 : -1;
          if (first > second) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // Pagination
      const startIndex = (page - 1) * page_size;
      const pagedData = data.slice(startIndex, startIndex + page_size);
      const totalPages = Math.ceil(data.length / page_size) || 1;

      setAssets(pagedData);
      setPagination({
        count: data.length,
        next: page < totalPages ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
        currentPage: page,
        totalPages,
        pageSize: page_size
      });
    } catch (err) {
      console.error('❌ useAssetDetails: fetchAssets error (mock):', err);
      setError(err.message || 'Failed to fetch assets');
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch active assets only (mock)
  const fetchActiveAssets = useCallback(async (params = {}) => {
    await fetchAssets({ ...params, status: 'Active' });
  }, [fetchAssets]);

  // Fetch high value assets
  const fetchHighValueAssets = useCallback(async (threshold = 10000, params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await assetDetailsAPI.getHighValue(threshold, params);
      
      if (response.results) {
        setAssets(response.results);
        setPagination({
          count: response.count || 0,
          next: response.next,
          previous: response.previous,
          currentPage: params.page || 1,
          totalPages: Math.ceil((response.count || 0) / (params.page_size || 10)),
          pageSize: params.page_size || 10
        });
      } else if (Array.isArray(response)) {
        setAssets(response);
        setPagination({
          count: response.length,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1,
          pageSize: response.length
        });
      }
    } catch (err) {
      console.error('❌ useAssetDetails: fetchHighValueAssets error:', err);
      setError(err.message);
      toast.error('Failed to fetch high value assets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch warranty expiring soon assets
  const fetchWarrantyExpiringSoon = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await assetDetailsAPI.getWarrantyExpiringSoon(params);
      
      if (response.results) {
        setAssets(response.results);
        setPagination({
          count: response.count || 0,
          next: response.next,
          previous: response.previous,
          currentPage: params.page || 1,
          totalPages: Math.ceil((response.count || 0) / (params.page_size || 10)),
          pageSize: params.page_size || 10
        });
      } else if (Array.isArray(response)) {
        setAssets(response);
        setPagination({
          count: response.length,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1,
          pageSize: response.length
        });
      }
    } catch (err) {
      console.error('❌ useAssetDetails: fetchWarrantyExpiringSoon error:', err);
      setError(err.message);
      toast.error('Failed to fetch warranty expiring assets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new asset (mock)
  const createAsset = useCallback(async (assetData) => {
    setError(null);
    setLoading(true);
    
    try {
      // Duplicate check (model + serial)
      if (assetData.model && assetData.serialnumber) {
        const duplicate = mockDataRef.current.find(
          (item) =>
            item.model?.toLowerCase() === assetData.model.toLowerCase() &&
            item.serialnumber?.toLowerCase() === assetData.serialnumber.toLowerCase()
        );
        if (duplicate) {
          const message = `Asset with Model "${duplicate.model}" and Serial "${duplicate.serialnumber}" already exists (Asset #${duplicate.assetnumber})`;
          toast.info(message, {
            style: { backgroundColor: '#3b82f6', color: 'white' },
            autoClose: 8000,
          });
          throw new Error('DUPLICATE_ASSET');
        }
      }

      const id = Date.now();
      const enrichedAssetData = {
        ...assetData,
        assetid: id,
        assetdetailsid: id,
        addeddate: assetData.addeddate || new Date().toISOString().split('T')[0],
        assetnumber: assetData.assetnumber || `AST-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: assetData.status ?? 481, // default In Stock
      };

      mockDataRef.current = [enrichedAssetData, ...mockDataRef.current];
      toast.success('Asset created successfully');

      await fetchAssets(currentParams);

      return enrichedAssetData;
    } catch (err) {
      console.error('❌ useAssetDetails: createAsset error (mock):', err);
      setError(err.message);
      if (err.message !== 'DUPLICATE_ASSET') {
        toast.error('Failed to create asset');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAssets, currentParams]);

  // Update asset (mock)
  const updateAsset = useCallback(async (id, assetData) => {
    setError(null);
    setLoading(true);
    
    try {
      mockDataRef.current = mockDataRef.current.map((item) =>
        item.assetid === id || item.assetdetailsid === id
          ? { ...item, ...assetData, assetdetailsid: item.assetdetailsid || item.assetid }
          : item
      );

      toast.success('Asset updated successfully');

      await fetchAssets(currentParams);

      return mockDataRef.current.find((item) => item.assetid === id || item.assetdetailsid === id);
    } catch (err) {
      console.error('❌ useAssetDetails: updateAsset error (mock):', err);
      setError(err.message);
      toast.error('Failed to update asset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAssets, currentParams]);

  // Delete asset (mock)
  const deleteAsset = useCallback(async (id) => {
    setError(null);
    setLoading(true);
    
    if (!id) {
      const errorMsg = 'Invalid asset ID.';
      setError(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      mockDataRef.current = mockDataRef.current.filter(
        (item) => item.assetid !== id && item.assetdetailsid !== id
      );
      toast.success('Asset deleted successfully');
      await fetchAssets(currentParams);
      return true;
    } catch (err) {
      console.error('❌ useAssetDetails: deleteAsset error (mock):', err);
      setError(err.message);
      toast.error('Failed to delete asset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAssets, currentParams]);

  // Search assets (mock)
  const searchAssets = useCallback(async (searchTerm, params = {}) => {
    await fetchAssets({ ...currentParams, ...params, search: searchTerm });
  }, [fetchAssets, currentParams]);

  // Get asset by ID (mock)
  const getAssetById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const asset = mockDataRef.current.find((item) => item.assetid === id);
      if (!asset) {
        throw new Error('Asset not found');
      }
      return asset;
    } catch (err) {
      console.error('❌ useAssetDetails: getAssetById error (mock):', err);
      setError(err.message);
      toast.error('Failed to fetch asset details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAssets(currentParams);
  }, [fetchAssets, currentParams]);

  // Change page
  const changePage = useCallback((page) => {
    fetchAssets({ page, page_size: pagination.pageSize });
  }, [fetchAssets, pagination.pageSize]);

  // Change page size
  const changePageSize = useCallback((newPageSize) => {
    fetchAssets({ page: 1, page_size: newPageSize });
  }, [fetchAssets]);

  // Check if pagination should be shown
  const shouldShowPagination = pagination.totalPages > 1 && pagination.pageSize !== 1000;

  return {
    // State
    assets,
    loading,
    error,
    pagination,
    
    // Actions
    fetchAssets,
    fetchActiveAssets,
    fetchHighValueAssets,
    fetchWarrantyExpiringSoon,
    createAsset,
    updateAsset,
    deleteAsset,
    searchAssets,
    getAssetById,
    clearError,
    refresh,
    changePage,
    changePageSize,
    shouldShowPagination
  };
};
