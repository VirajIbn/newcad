import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Static mock manufacturers to avoid hitting the real API
const MOCK_MANUFACTURERS = [
  {
    manufacturerid: 1,
    manufacturername: 'Acme Industries',
    description: 'Leading provider of industrial components',
    addeddate: '2024-10-01',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 2,
    manufacturername: 'Northwind Manufacturing',
    description: 'Precision equipment and tools',
    addeddate: '2024-09-21',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 3,
    manufacturername: 'Globex Corp',
    description: 'Global supplier of electronics',
    addeddate: '2024-09-10',
    isactive: 0,
    isdeleted: 0,
  },
  {
    manufacturerid: 4,
    manufacturername: 'Innotech',
    description: 'Innovative tech hardware',
    addeddate: '2024-08-15',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 5,
    manufacturername: 'Wayne Enterprises',
    description: 'Industrial and defense products',
    addeddate: '2024-08-05',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 6,
    manufacturername: 'Stark Industries',
    description: 'Advanced technology solutions',
    addeddate: '2024-07-22',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 7,
    manufacturername: 'Umbrella Corp',
    description: 'Biotech and pharmaceuticals',
    addeddate: '2024-07-12',
    isactive: 0,
    isdeleted: 0,
  },
  {
    manufacturerid: 8,
    manufacturername: 'Wonka Factory',
    description: 'Confectionery manufacturing',
    addeddate: '2024-06-30',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 9,
    manufacturername: 'Soylent Labs',
    description: 'Food science and nutrition',
    addeddate: '2024-06-15',
    isactive: 1,
    isdeleted: 0,
  },
  {
    manufacturerid: 10,
    manufacturername: 'Cyberdyne Systems',
    description: 'Robotics and AI systems',
    addeddate: '2024-06-01',
    isactive: 0,
    isdeleted: 0,
  },
];

export const useManufacturers = () => {
  const { user } = useAuth();
  
  const [manufacturers, setManufacturers] = useState([]);
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
  });
  const mockDataRef = useRef([...MOCK_MANUFACTURERS]);

  // Use ref to track latest filters without causing dependency issues
  const filtersRef = useRef(filters);
  const prevFiltersRef = useRef(null);
  filtersRef.current = filters;

  // Fetch manufacturers with current filters and pagination
  const fetchManufacturers = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const { search, ordering } = filtersRef.current;

      // Apply search filter
      let data = [...mockDataRef.current];
      if (search) {
        const searchLower = search.toLowerCase();
        data = data.filter((m) =>
          [m.manufacturername, m.description, m.addeddate]
            .filter(Boolean)
            .some((field) => field.toString().toLowerCase().includes(searchLower))
        );
      }

      // Apply ordering (supports "-field" for desc)
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

      setManufacturers(pagedData);
      setPagination({
        count: data.length,
        next: page < totalPages ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
        currentPage: page,
        pageSize,
        totalPages,
      });
    } catch (err) {
      console.error('Error in fetchManufacturers (mock):', err);
      const errorMessage = err.message || 'Failed to load mock manufacturers';
      setError(errorMessage);
      toast.error(`Failed to fetch manufacturers: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search manufacturers
  const searchManufacturers = useCallback((searchTerm) => {

    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  // Filter manufacturers
  const filterManufacturers = useCallback((newFilters) => {

    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create new manufacturer
  const createManufacturer = async (manufacturerData) => {
    setError(null);
    setLoading(true);

    try {
      const enrichedManufacturerData = {
        ...manufacturerData,
        addedby: user?.id,
        modifiedby: user?.id,
        orgid: user?.orgId || manufacturerData.orgid,
      };

      // Duplicate check on mock data
      const nameLower = enrichedManufacturerData.manufacturername?.toLowerCase();
      const duplicate = mockDataRef.current.find(
        (m) => m.manufacturername.toLowerCase() === nameLower
      );
      if (duplicate) {
        const message = `Manufacturer "${duplicate.manufacturername}" already exists`;
        toast.info(message, {
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
          },
          autoClose: 8000,
        });
        throw new Error('DUPLICATE_MANUFACTURER');
      }

      const newManufacturer = {
        ...enrichedManufacturerData,
        manufacturerid: Date.now(),
        isactive: 1,
        isdeleted: 0,
        addeddate: enrichedManufacturerData.addeddate || new Date().toISOString().split('T')[0],
      };

      mockDataRef.current = [newManufacturer, ...mockDataRef.current];
      toast.success('Manufacturer created successfully!');
      await fetchManufacturers(1, pagination.pageSize);

      return newManufacturer;
    } catch (err) {
      console.error('Error in createManufacturer (mock):', err);
      if (err.message !== 'DUPLICATE_MANUFACTURER') {
        const errorMessage = err.message || 'Failed to create manufacturer';
        toast.error(`Failed to create manufacturer: ${errorMessage}`);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update manufacturer
  const updateManufacturer = async (id, manufacturerData) => {
    setLoading(true);
    try {
      mockDataRef.current = mockDataRef.current.map((item) =>
        item.manufacturerid === id
          ? { ...item, ...manufacturerData, modifiedby: user?.id, orgid: user?.orgId || item.orgid }
          : item
      );

      toast.success('Manufacturer updated successfully!');
      await fetchManufacturers(pagination.currentPage, pagination.pageSize);

      return mockDataRef.current.find((item) => item.manufacturerid === id);
    } catch (err) {
      console.error('Error in updateManufacturer (mock):', err);
      toast.error(`Failed to update manufacturer: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete manufacturer
  const deleteManufacturer = async (id) => {
    setLoading(true);
    try {
      mockDataRef.current = mockDataRef.current.filter(
        (manufacturer) => manufacturer.manufacturerid !== id
      );

      toast.success('Manufacturer deleted successfully!');
      await fetchManufacturers(pagination.currentPage, pagination.pageSize);
    } catch (err) {
      console.error('Error in deleteManufacturer (mock):', err);
      toast.error(`Failed to delete manufacturer: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleManufacturerStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      mockDataRef.current = mockDataRef.current.map((manufacturer) =>
        manufacturer.manufacturerid === id
          ? { ...manufacturer, isactive: currentStatus === 1 ? 0 : 1 }
          : manufacturer
      );
      await fetchManufacturers(pagination.currentPage, pagination.pageSize);
    } catch (err) {
      console.error('Error in toggleManufacturerStatus (mock):', err);
      toast.error(`Failed to toggle status: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Change page
  const changePage = useCallback((page) => {
    fetchManufacturers(page, pagination.pageSize);
  }, [fetchManufacturers, pagination.pageSize]);

  // Change page size
  const changePageSize = useCallback((newPageSize) => {

    // Reset to page 1 when changing page size
    fetchManufacturers(1, newPageSize);
  }, [fetchManufacturers]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchManufacturers(pagination.currentPage, pagination.pageSize);
  }, [fetchManufacturers, pagination.currentPage, pagination.pageSize]);

  // Refetch when filters change (but only if they're actually different)
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    const prevFiltersString = prevFiltersRef.current ? JSON.stringify(prevFiltersRef.current) : null;
    
    if (filtersString !== prevFiltersString) {
      prevFiltersRef.current = { ...filters };
      const currentPageSize = pagination.pageSize || 10;
      fetchManufacturers(1, currentPageSize);
    }
  }, [filters, fetchManufacturers, pagination.pageSize]);

  return {
    // State
    manufacturers,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchManufacturers,
    searchManufacturers,
    filterManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
    toggleManufacturerStatus,
    changePage,
    changePageSize,
    refresh,
    
    // Computed values
    hasManufacturers: manufacturers.length > 0,
    totalPages: Math.ceil(pagination.count / pagination.pageSize),
    shouldShowPagination: pagination.totalPages > 1 && pagination.pageSize !== 1000,
  };
};
