import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Static mock vendors to avoid hitting the real API
const MOCK_VENDORS = [
  {
    vendorid: 1,
    vendorname: 'Acme Supplies',
    contactperson: 'John Doe',
    gstno: '27ABCDE1234F1Z5',
    email: 'contact@acme.com',
    mobilenumber: '9876543210',
    addeddate: '2024-10-01',
    addedby: 'Admin',
    addedby_firstname: 'Admin',
    addedby_lastname: 'User',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 2,
    vendorname: 'Northwind Traders',
    contactperson: 'Nancy Davolio',
    gstno: '27FGHIJ5678K2Z6',
    email: 'nancy@northwind.com',
    mobilenumber: '9123456780',
    addeddate: '2024-09-21',
    addedby: 'Admin',
    addedby_firstname: 'Nancy',
    addedby_lastname: 'Davolio',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 3,
    vendorname: 'Globex Supplies',
    contactperson: 'Hank Scorpio',
    gstno: '27LMNOP9012Q3Z7',
    email: 'hank@globex.com',
    mobilenumber: '9988776655',
    addeddate: '2024-09-15',
    addedby: 'Ops',
    addedby_firstname: 'Hank',
    addedby_lastname: 'Scorpio',
    isactive: 0,
    isdeleted: 0,
  },
  {
    vendorid: 4,
    vendorname: 'Innotech Vendors',
    contactperson: 'Peter Gibbons',
    gstno: '27QRSTU3456V4Z8',
    email: 'peter@innotech.com',
    mobilenumber: '9090909090',
    addeddate: '2024-08-30',
    addedby: 'Ops',
    addedby_firstname: 'Peter',
    addedby_lastname: 'Gibbons',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 5,
    vendorname: 'Wayne Logistics',
    contactperson: 'Lucius Fox',
    gstno: '27WXYZ7890A5Z9',
    email: 'lucius@wayne.com',
    mobilenumber: '9812345678',
    addeddate: '2024-08-10',
    addedby: 'Admin',
    addedby_firstname: 'Lucius',
    addedby_lastname: 'Fox',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 6,
    vendorname: 'Stark Procurement',
    contactperson: 'Pepper Potts',
    gstno: '27BCDEF1234G6Z1',
    email: 'pepper@stark.com',
    mobilenumber: '9876501234',
    addeddate: '2024-07-25',
    addedby: 'Tony',
    addedby_firstname: 'Pepper',
    addedby_lastname: 'Potts',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 7,
    vendorname: 'Umbrella Supplies',
    contactperson: 'Albert Wesker',
    gstno: '27HIJKL5678M7Z2',
    email: 'wesker@umbrella.com',
    mobilenumber: '9900112233',
    addeddate: '2024-07-12',
    addedby: 'Ops',
    addedby_firstname: 'Albert',
    addedby_lastname: 'Wesker',
    isactive: 0,
    isdeleted: 0,
  },
  {
    vendorid: 8,
    vendorname: 'Wonka Imports',
    contactperson: 'Willy Wonka',
    gstno: '27NOPQR9012S8Z3',
    email: 'willy@wonka.com',
    mobilenumber: '9008007006',
    addeddate: '2024-06-28',
    addedby: 'Admin',
    addedby_firstname: 'Willy',
    addedby_lastname: 'Wonka',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 9,
    vendorname: 'Soylent Distribution',
    contactperson: 'Detective Thorn',
    gstno: '27TUVWX3456Y9Z4',
    email: 'thorn@soylent.com',
    mobilenumber: '9123001122',
    addeddate: '2024-06-12',
    addedby: 'Ops',
    addedby_firstname: 'Detective',
    addedby_lastname: 'Thorn',
    isactive: 1,
    isdeleted: 0,
  },
  {
    vendorid: 10,
    vendorname: 'Cyberdyne Partners',
    contactperson: 'Miles Dyson',
    gstno: '27ZABCD7890E1Z5',
    email: 'miles@cyberdyne.com',
    mobilenumber: '9998887776',
    addeddate: '2024-06-01',
    addedby: 'R&D',
    addedby_firstname: 'Miles',
    addedby_lastname: 'Dyson',
    isactive: 0,
    isdeleted: 0,
  },
];

export const useVendors = (initialParams = {}) => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
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
  const [params, setParams] = useState({
    page: 1,
    page_size: 10,
    search: '',
    ordering: '-addeddate',
    ...initialParams
  });
  const mockDataRef = useRef([...MOCK_VENDORS]);

  // Use ref to track latest params without causing dependency issues
  const paramsRef = useRef(params);
  const prevParamsRef = useRef(null);
  paramsRef.current = params;
  const normalizeAddedBy = useCallback((vendor) => {
    const first =
      vendor.addedby_firstname ||
      (vendor.addedby_name ? vendor.addedby_name.split(' ')[0] : null) ||
      (vendor.addedby ? vendor.addedby.split(' ')[0] : null) ||
      '';
    const last =
      vendor.addedby_lastname ||
      (vendor.addedby_name ? vendor.addedby_name.split(' ').slice(1).join(' ') : null) ||
      (vendor.addedby ? vendor.addedby.split(' ').slice(1).join(' ') : null) ||
      '';

    const addedby_display =
      [first, last].filter(Boolean).join(' ').trim() || vendor.addedby_name || vendor.addedby || 'N/A';

    return {
      ...vendor,
      addedby_firstname: first,
      addedby_lastname: last,
      addedby_display,
    };
  }, []);

  // Fetch vendors with current parameters
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { search, ordering, page, page_size } = paramsRef.current;

      // Filter
      let data = [...mockDataRef.current];
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        data = data.filter((vendor) =>
          [
            vendor.vendorname,
            vendor.contactperson,
            vendor.email,
            vendor.mobilenumber,
            vendor.gstno,
            vendor.addeddate,
          ]
            .filter(Boolean)
            .some((field) => field.toString().toLowerCase().includes(searchLower))
        );
      }

      // Sort (supports "-field" for desc)
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
      const pageSizeNum = page_size === 'all' ? data.length || 1 : page_size;
      const currentPage = page || 1;
      const startIndex = (currentPage - 1) * pageSizeNum;
      const pagedData =
        page_size === 'all' ? data : data.slice(startIndex, startIndex + pageSizeNum);
      const totalPages = Math.ceil(data.length / pageSizeNum) || 1;

      setVendors(pagedData.map(normalizeAddedBy));
      setPagination({
        count: data.length,
        next: currentPage < totalPages ? currentPage + 1 : null,
        previous: currentPage > 1 ? currentPage - 1 : null,
        currentPage,
        pageSize: pageSizeNum,
        totalPages,
      });
    } catch (err) {
      console.error('❌ Error fetching vendors (mock):', err);
      setError(err.message);
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  }, [normalizeAddedBy]);

  // Fetch active vendors only
  const fetchActiveVendors = useCallback(async (pageSize = 'all') => {
    setLoading(true);
    setError(null);

    try {
      const data = mockDataRef.current.filter((vendor) => vendor.isactive === 1);
      const pageSizeNum = pageSize === 'all' ? data.length || 1 : pageSize;
      const pagedData = pageSize === 'all' ? data : data.slice(0, pageSizeNum);
      const totalPages = Math.ceil(data.length / pageSizeNum) || 1;

      setVendors(pagedData.map(normalizeAddedBy));
      setPagination({
        count: data.length,
        next: null,
        previous: null,
        currentPage: 1,
        pageSize: pageSizeNum,
        totalPages,
      });
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch active vendors');
    } finally {
      setLoading(false);
    }
  }, [normalizeAddedBy]);

  // Search vendors
  const searchVendors = useCallback(async (searchTerm, pageSize = 20) => {
    setParams((prev) => ({
      ...prev,
      search: searchTerm,
      page_size: pageSize,
      page: 1,
      ordering: '-addeddate',
    }));
  }, []);

  // Create new vendor
  const createVendor = useCallback(async (vendorData) => {
    setError(null);
    setLoading(true);

    try {
      const enrichedVendorData = {
        ...vendorData,
        addedby: user?.id || vendorData.addedby || 'User',
        modifiedby: user?.id || vendorData.modifiedby,
        orgid: user?.orgId || vendorData.orgid,
      };

      // Duplicate check
      const nameLower = enrichedVendorData.vendorname?.toLowerCase();
      const duplicate = mockDataRef.current.find(
        (v) => v.vendorname.toLowerCase() === nameLower
      );
      if (duplicate) {
        const message = `Vendor "${duplicate.vendorname}" already exists`;
        toast.info(message, {
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
          },
          autoClose: 8000,
        });
        throw new Error('DUPLICATE_VENDOR');
      }

      const newVendor = {
        ...enrichedVendorData,
        vendorid: Date.now(),
        isactive: 1,
        isdeleted: 0,
        addeddate: enrichedVendorData.addeddate || new Date().toISOString().split('T')[0],
        addedby_firstname: enrichedVendorData.addedby_firstname || user?.firstName || 'Demo',
        addedby_lastname: enrichedVendorData.addedby_lastname || user?.lastName || 'User',
      };

      const normalizedVendor = normalizeAddedBy(newVendor);
      mockDataRef.current = [normalizedVendor, ...mockDataRef.current];
      toast.success('Vendor created successfully');
      await fetchVendors();

      return normalizedVendor;
    } catch (err) {
      console.error('❌ useVendors: createVendor error (mock):', err);
      if (err.message !== 'DUPLICATE_VENDOR') {
        setError(err.message);
        toast.error('Failed to create vendor');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchVendors, normalizeAddedBy, user]);

  // Update vendor
  const updateVendor = useCallback(async (id, vendorData) => {
    setLoading(true);
    setError(null);

    try {
      mockDataRef.current = mockDataRef.current.map((vendor) => {
        if (vendor.vendorid !== id) return vendor;
        const updated = {
          ...vendor,
          ...vendorData,
          modifiedby: user?.id || vendor.modifiedby,
        };
        return normalizeAddedBy(updated);
      });

      toast.success('Vendor updated successfully');
      await fetchVendors();

      return mockDataRef.current.find((vendor) => vendor.vendorid === id);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update vendor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchVendors, normalizeAddedBy, user]);

  // Delete vendor (soft delete)
  const deleteVendor = useCallback(async (id, _modifiedBy) => {
    setLoading(true);
    setError(null);

    try {
      mockDataRef.current = mockDataRef.current.filter((vendor) => vendor.vendorid !== id);
      toast.success('Vendor deleted successfully');
      await fetchVendors();

      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete vendor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchVendors]);

  // Get single vendor
  const getVendor = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const vendor = mockDataRef.current.find((item) => item.vendorid === id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return normalizeAddedBy(vendor);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch vendor details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [normalizeAddedBy]);

  // Update parameters and refetch
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  // Go to specific page
  const goToPage = useCallback((page) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((pageSize) => {
    setParams(prev => ({ ...prev, page_size: pageSize, page: 1 }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setParams(prev => ({ 
      ...prev, 
      search: '', 
      page: 1,
      ordering: '-addeddate'
    }));
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Refetch when params change (but only if they're actually different)
  useEffect(() => {
    // Only fetch if we have meaningful parameters and they've actually changed
    if (params.page && params.page_size) {
      const paramsString = JSON.stringify(params);
      const prevParamsString = prevParamsRef.current ? JSON.stringify(prevParamsRef.current) : null;
      
      if (paramsString !== prevParamsString) {
        prevParamsRef.current = { ...params };
        fetchVendors();
      }
    }
  }, [params, fetchVendors]);

  return {
    // State
    vendors,
    loading,
    error,
    pagination,
    params,
    
    // Actions
    fetchVendors,
    fetchActiveVendors,
    searchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    getVendor,
    
    // Parameter management
    updateParams,
    goToPage,
    changePageSize,
    clearSearch,
    refresh,
    
    // Utility
    hasNextPage: !!pagination.next,
    hasPreviousPage: !!pagination.previous,
    totalPages: pagination.totalPages,
    shouldShowPagination: pagination.totalPages > 1 && pagination.pageSize !== 1000,
  };
};
