import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

// Static mock asset categories to avoid hitting the real API
const MOCK_ASSET_CATEGORIES = [
  {
    assetcategoryid: 1,
    categoryname: 'IT Hardware',
    description: 'Laptops, desktops, servers, peripherals',
    addeddate: '2024-10-01',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 2,
    categoryname: 'Networking',
    description: 'Routers, switches, firewalls, cables',
    addeddate: '2024-09-18',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 3,
    categoryname: 'Office Equipment',
    description: 'Printers, scanners, projectors',
    addeddate: '2024-09-05',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 4,
    categoryname: 'Furniture',
    description: 'Chairs, desks, cabinets',
    addeddate: '2024-08-22',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 5,
    categoryname: 'Vehicles',
    description: 'Cars, vans, trucks',
    addeddate: '2024-08-10',
    isactive: 0,
    isdeleted: 0,
  },
  {
    assetcategoryid: 6,
    categoryname: 'Software Licenses',
    description: 'Operating systems, productivity suites, design tools',
    addeddate: '2024-07-30',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 7,
    categoryname: 'Security',
    description: 'CCTV, access control, biometrics',
    addeddate: '2024-07-12',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 8,
    categoryname: 'Lab Equipment',
    description: 'Testing and measurement devices',
    addeddate: '2024-06-28',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 9,
    categoryname: 'HVAC',
    description: 'Heating, ventilation, and air conditioning',
    addeddate: '2024-06-15',
    isactive: 1,
    isdeleted: 0,
  },
  {
    assetcategoryid: 10,
    categoryname: 'Miscellaneous',
    description: 'Other assets not categorized elsewhere',
    addeddate: '2024-06-01',
    isactive: 1,
    isdeleted: 0,
  },
];

export const useAssetCategories = () => {
  const [assetCategories, setAssetCategories] = useState([]);
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
    isactive: 1,
    isdeleted: 0,
  });

  // Use ref to track latest filters without causing dependency issues
  const filtersRef = useRef(filters);
  const prevFiltersRef = useRef(null);
  filtersRef.current = filters;
  const mockDataRef = useRef([...MOCK_ASSET_CATEGORIES]);

  // Fetch asset categories with current filters and pagination
  const fetchAssetCategories = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const { search, ordering, isactive, isdeleted } = filtersRef.current;

      // Filter
      let data = [...mockDataRef.current];
      if (search) {
        const searchLower = search.toLowerCase();
        data = data.filter((item) =>
          [item.categoryname, item.description, item.addeddate]
            .filter(Boolean)
            .some((field) => field.toString().toLowerCase().includes(searchLower))
        );
      }
      if (typeof isactive !== 'undefined' && isactive !== '') {
        data = data.filter((item) => Number(item.isactive) === Number(isactive));
      }
      if (typeof isdeleted !== 'undefined' && isdeleted !== '') {
        data = data.filter((item) => Number(item.isdeleted) === Number(isdeleted));
      }

      // Sort
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

      setAssetCategories(pagedData);
      setPagination({
        count: data.length,
        next: page < totalPages ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
        currentPage: page,
        pageSize,
        totalPages,
      });
    } catch (err) {
      console.error('Error in fetchAssetCategories (mock):', err);
      const errorMessage = err.message || 'Failed to load asset categories';
      setError(errorMessage);
      toast.error(`Failed to fetch asset categories: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search asset categories
  const searchAssetCategories = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  // Filter asset categories
  const filterAssetCategories = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Update ordering
  const updateOrdering = useCallback((ordering) => {
    setFilters(prev => ({ ...prev, ordering }));
  }, []);

  // Create new asset category
  const createAssetCategory = async (assetCategoryData) => {
    setError(null);
    
    try {
      // Check for duplicate asset category before creating (mock)
      if (assetCategoryData.categoryname) {
        const nameLower = assetCategoryData.categoryname.toLowerCase();
        const duplicate = mockDataRef.current.find(
          (item) => item.categoryname.toLowerCase() === nameLower
        );
        if (duplicate) {
          const categoryName = duplicate.categoryname || 'N/A';
          const message = `Asset Category "${categoryName}" already exists`;
          
          toast.info(message, {
            style: {
              backgroundColor: '#3b82f6',
              color: 'white'
            },
            autoClose: 8000
          });
          
          throw new Error('DUPLICATE_ASSET_CATEGORY');
        }
      }
      
      const newAssetCategory = {
        ...assetCategoryData,
        assetcategoryid: Date.now(),
        addeddate: assetCategoryData.addeddate || new Date().toISOString().split('T')[0],
        isactive: assetCategoryData.isactive ?? 1,
        isdeleted: assetCategoryData.isdeleted ?? 0,
      };
      
      mockDataRef.current = [newAssetCategory, ...mockDataRef.current];
      
      toast.success('Asset category created successfully!');
      
      // Refresh the list
      await fetchAssetCategories(pagination.currentPage, pagination.pageSize);
      
      return newAssetCategory;
    } catch (error) {
      console.error('Error creating asset category:', error);
      
      // Don't show error toast for duplicate asset categories (already shown above)
      if (error.message !== 'DUPLICATE_ASSET_CATEGORY') {
        toast.error('Failed to create asset category');
      }
      
      throw error;
    }
  };

  // Update asset category
  const updateAssetCategory = async (id, assetCategoryData) => {
    try {
      mockDataRef.current = mockDataRef.current.map((item) =>
        item.assetcategoryid === id ? { ...item, ...assetCategoryData } : item
      );
      
      toast.success('Asset category updated successfully!');
      
      // Refresh the list
      await fetchAssetCategories(pagination.currentPage, pagination.pageSize);
      
      return mockDataRef.current.find((item) => item.assetcategoryid === id);
    } catch (error) {
      console.error('Error updating asset category:', error);
      toast.error('Failed to update asset category');
      throw error;
    }
  };

  // Delete asset category
  const deleteAssetCategory = async (id) => {
    try {
      mockDataRef.current = mockDataRef.current.filter((item) => item.assetcategoryid !== id);
      
      toast.success('Asset category deleted successfully!');
      
      // Refresh the list
      await fetchAssetCategories(pagination.currentPage, pagination.pageSize);
    } catch (error) {
      console.error('❌ Error deleting asset category:', error);
      toast.error('Failed to delete asset category');
      throw error;
    }
  };


  // Change page
  const changePage = useCallback((page) => {
    fetchAssetCategories(page, pagination.pageSize);
  }, [fetchAssetCategories, pagination.pageSize]);

  // Change page size
  const changePageSize = useCallback((pageSize) => {
    fetchAssetCategories(1, pageSize);
  }, [fetchAssetCategories]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAssetCategories(pagination.currentPage, pagination.pageSize);
  }, [fetchAssetCategories, pagination.currentPage, pagination.pageSize]);

  // Check if pagination should be shown
  const shouldShowPagination = pagination.totalPages > 1;

  // No need to initialize orgid filter - backend handles organization filtering automatically based on JWT token

  // Refetch when filters change (but only if they're actually different)
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    const prevFiltersString = prevFiltersRef.current ? JSON.stringify(prevFiltersRef.current) : null;
    
    if (filtersString !== prevFiltersString) {
      prevFiltersRef.current = { ...filters };
      fetchAssetCategories();
    }
  }, [filters, fetchAssetCategories]);

  return {
    assetCategories,
    loading,
    error,
    pagination,
    filters,
    searchAssetCategories,
    filterAssetCategories,
    updateOrdering,
    createAssetCategory,
    updateAssetCategory,
    deleteAssetCategory,
    changePage,
    changePageSize,
    refresh,
    shouldShowPagination,
  };
};

