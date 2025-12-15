import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

// Static mock asset types to avoid hitting the real API
const MOCK_ASSET_TYPES = [
  {
    assettypeid: 1,
    assettypename: 'Laptop',
    assettypeprefix: 'LPT',
    assetdepreciationrate: 20,
    description: 'Portable computers for staff',
    orgid: '1001',
    org_name: 'HQ',
    addedby_username: 'Alice Smith',
    modifieddate: '2024-10-05',
  },
  {
    assettypeid: 2,
    assettypename: 'Desktop',
    assettypeprefix: 'DST',
    assetdepreciationrate: 18,
    description: 'Office desktops',
    orgid: '1001',
    org_name: 'HQ',
    addedby_username: 'Bob Lee',
    modifieddate: '2024-09-28',
  },
  {
    assettypeid: 3,
    assettypename: 'Server',
    assettypeprefix: 'SRV',
    assetdepreciationrate: 25,
    description: 'Rack and tower servers',
    orgid: '1002',
    org_name: 'Data Center',
    addedby_username: 'Charlie Kim',
    modifieddate: '2024-09-12',
  },
  {
    assettypeid: 4,
    assettypename: 'Router',
    assettypeprefix: 'RTR',
    assetdepreciationrate: 15,
    description: 'Network routers',
    orgid: '1002',
    org_name: 'Data Center',
    addedby_username: 'Dana Fox',
    modifieddate: '2024-08-30',
  },
  {
    assettypeid: 5,
    assettypename: 'Switch',
    assettypeprefix: 'SWT',
    assetdepreciationrate: 15,
    description: 'Managed switches',
    orgid: '1003',
    org_name: 'Branch A',
    addedby_username: 'Evan Cole',
    modifieddate: '2024-08-15',
  },
  {
    assettypeid: 6,
    assettypename: 'Printer',
    assettypeprefix: 'PRN',
    assetdepreciationrate: 12,
    description: 'Laser and inkjet printers',
    orgid: '1003',
    org_name: 'Branch A',
    addedby_username: 'Fiona Diaz',
    modifieddate: '2024-08-02',
  },
  {
    assettypeid: 7,
    assettypename: 'Projector',
    assettypeprefix: 'PJT',
    assetdepreciationrate: 10,
    description: 'Meeting room projectors',
    orgid: '1004',
    org_name: 'Branch B',
    addedby_username: 'George Yang',
    modifieddate: '2024-07-25',
  },
  {
    assettypeid: 8,
    assettypename: 'UPS',
    assettypeprefix: 'UPS',
    assetdepreciationrate: 14,
    description: 'Uninterruptible power supplies',
    orgid: '1004',
    org_name: 'Branch B',
    addedby_username: 'Hannah Roe',
    modifieddate: '2024-07-10',
  },
  {
    assettypeid: 9,
    assettypename: 'CCTV',
    assettypeprefix: 'CCTV',
    assetdepreciationrate: 16,
    description: 'Security cameras',
    orgid: '1005',
    org_name: 'Security',
    addedby_username: 'Ian Shaw',
    modifieddate: '2024-06-28',
  },
  {
    assettypeid: 10,
    assettypename: 'Access Control',
    assettypeprefix: 'ACC',
    assetdepreciationrate: 16,
    description: 'Access control devices',
    orgid: '1005',
    org_name: 'Security',
    addedby_username: 'Jane Wu',
    modifieddate: '2024-06-12',
  },
];

export const useAssetTypes = () => {
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    ordering: '-addeddate',
    orgid: '',
  });

  // Use ref to track latest filters without causing dependency issues
  const filtersRef = useRef(filters);
  const prevFiltersRef = useRef(null);
  filtersRef.current = filters;
  const mockDataRef = useRef([...MOCK_ASSET_TYPES]);

  // Fetch asset types with current filters and pagination
  const fetchAssetTypes = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const { search, ordering, orgid } = filtersRef.current;

      let data = [...mockDataRef.current];

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        data = data.filter((item) =>
          [
            item.assettypename,
            item.assettypeprefix,
            item.description,
            item.org_name,
            item.addedby_username,
          ]
            .filter(Boolean)
            .some((field) => field.toString().toLowerCase().includes(searchLower))
        );
      }

      // Filter by orgid if provided
      if (orgid !== undefined && orgid !== null && orgid !== '') {
        data = data.filter((item) => (item.orgid ?? '').toString() === orgid.toString());
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
      const startIndex = (page - 1) * pageSize;
      const pagedData = data.slice(startIndex, startIndex + pageSize);
      const totalPages = Math.ceil(data.length / pageSize) || 1;

      setAssetTypes(pagedData);
      setPagination({
        count: data.length,
        next: page < totalPages ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
        currentPage: page,
        pageSize,
        totalPages,
      });
    } catch (err) {
      console.error('Error in fetchAssetTypes (mock):', err);
      const errorMessage = err.message || 'Failed to load asset types';
      setError(errorMessage);
      toast.error(`Failed to fetch asset types: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search asset types
  const searchAssetTypes = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  // Filter asset types
  const filterAssetTypes = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Update ordering
  const updateOrdering = useCallback((ordering) => {
    setFilters(prev => ({ ...prev, ordering }));
  }, []);

  // Create new asset type
  const createAssetType = async (assetTypeData) => {
    setError(null);
    
    try {
      const orgid = assetTypeData.orgid || '';
      
      // Check for duplicate asset type before creating (mock)
      if (assetTypeData.assettypename && assetTypeData.assettypeprefix && orgid) {
        const nameLower = assetTypeData.assettypename.toLowerCase();
        const prefixLower = assetTypeData.assettypeprefix.toLowerCase();
        const duplicate = mockDataRef.current.find(
          (item) =>
            item.orgid?.toString() === orgid.toString() &&
            (item.assettypename.toLowerCase() === nameLower ||
              item.assettypeprefix.toLowerCase() === prefixLower)
        );
        
        if (duplicate) {
          let message = '';
          if (duplicate.assettypename.toLowerCase() === nameLower) {
            message = `Asset Type with name "${duplicate.assettypename}" already exists`;
          } else {
            message = `Asset Type with prefix "${duplicate.assettypeprefix}" already exists`;
          }
          
          toast.info(message, {
            style: {
              backgroundColor: '#3b82f6',
              color: 'white'
            },
            autoClose: 8000
          });
          
          throw new Error('DUPLICATE_ASSET_TYPE');
        }
      }
      
      const newAssetType = {
        ...assetTypeData,
        assettypeid: Date.now(),
        modifieddate: assetTypeData.modifieddate || new Date().toISOString(),
        org_name: assetTypeData.org_name || 'Org',
        addedby_username: assetTypeData.addedby_username || 'User',
      };
      
      mockDataRef.current = [newAssetType, ...mockDataRef.current];
      
      toast.success('Asset type created successfully!');
      
      // Refresh the list
      await fetchAssetTypes(pagination.currentPage, pagination.pageSize);
      
      return newAssetType;
    } catch (error) {
      console.error('Error creating asset type:', error);
      
      // Don't show error toast for duplicate asset types (already shown above)
      if (error.message !== 'DUPLICATE_ASSET_TYPE') {
        toast.error('Failed to create asset type');
      }
      
      throw error;
    }
  };

  // Update asset type
  const updateAssetType = async (id, assetTypeData) => {
    try {
      mockDataRef.current = mockDataRef.current.map((item) =>
        item.assettypeid === id ? { ...item, ...assetTypeData } : item
      );
      
      toast.success('Asset type updated successfully!');
      
      // Refresh the list
      await fetchAssetTypes(pagination.currentPage, pagination.pageSize);
      
      return mockDataRef.current.find((item) => item.assettypeid === id);
    } catch (error) {
      console.error('Error updating asset type:', error);
      toast.error('Failed to update asset type');
      throw error;
    }
  };

  // Delete asset type
  const deleteAssetType = async (id) => {
    try {
      mockDataRef.current = mockDataRef.current.filter((item) => item.assettypeid !== id);
      
      toast.success('Asset type deleted successfully!');
      
      // Refresh the list
      await fetchAssetTypes(pagination.currentPage, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting asset type:', error);
      toast.error('Failed to delete asset type');
      throw error;
    }
  };


  // Change page
  const changePage = useCallback((page) => {
    fetchAssetTypes(page, pagination.pageSize);
  }, [fetchAssetTypes, pagination.pageSize]);

  // Change page size
  const changePageSize = useCallback((pageSize) => {
    fetchAssetTypes(1, pageSize);
  }, [fetchAssetTypes]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAssetTypes(pagination.currentPage, pagination.pageSize);
  }, [fetchAssetTypes, pagination.currentPage, pagination.pageSize]);

  // Check if pagination should be shown
  const shouldShowPagination = pagination.totalPages > 1;

  // Refetch when filters change (but only if they're actually different)
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    const prevFiltersString = prevFiltersRef.current ? JSON.stringify(prevFiltersRef.current) : null;
    
    if (filtersString !== prevFiltersString) {
      prevFiltersRef.current = { ...filters };
      fetchAssetTypes();
    }
  }, [filters, fetchAssetTypes]);

  return {
    assetTypes,
    loading,
    error,
    pagination,
    filters,
    searchAssetTypes,
    filterAssetTypes,
    updateOrdering,
    createAssetType,
    updateAssetType,
    deleteAssetType,
    changePage,
    changePageSize,
    refresh,
    shouldShowPagination,
  };
};
