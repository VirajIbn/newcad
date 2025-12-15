import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { businessUnitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useBusinessUnits = () => {
  const { user } = useAuth();
  
  const [businessUnits, setBusinessUnits] = useState([]);
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

  // Use ref to track latest filters without causing dependency issues
  const filtersRef = useRef(filters);
  const prevFiltersRef = useRef(null);
  filtersRef.current = filters;

  // Fetch business units with current filters and pagination
  const fetchBusinessUnits = useCallback(async (page = 1, pageSize = 10) => {
    // Check if JWT token is available
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Token available, proceed with API call
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filtersRef.current,
      };

      // Call real API - using business unit endpoint
      const response = await businessUnitAPI.getAll(params);
      
      setBusinessUnits(response.results || []);
      
      // Calculate total pages
      const totalPages = Math.ceil((response.count || 0) / pageSize);
      
      setPagination({
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
        currentPage: page,
        pageSize,
        totalPages,
      });

    } catch (err) {
      console.error('Error in fetchBusinessUnits:', err);
      
      // Provide more specific error messages
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot reach the backend server. Please check if the server is running.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The backend server is not allowing requests from this origin';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout: The backend server is not responding';
      }
      
      setError(errorMessage);
      toast.error(`Failed to fetch business units: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search business units
  const searchBusinessUnits = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  // Filter business units
  const filterBusinessUnits = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create new business unit
  const createBusinessUnit = async (businessUnitData) => {
    setLoading(true);
    try {
      // Call real API
      const newBusinessUnit = await businessUnitAPI.create(businessUnitData);
      
      toast.success('Business unit created successfully!');
      
      // Refresh the list
      await fetchBusinessUnits(1, pagination.pageSize);
      
      return newBusinessUnit;
    } catch (err) {
      console.error('Error in createBusinessUnit:', err);
      const errorMessage = err.message || 'Failed to create business unit';
      toast.error(`Failed to create business unit: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update business unit
  const updateBusinessUnit = async (id, businessUnitData) => {
    setLoading(true);
    try {
      // Call real API
      const updatedBusinessUnit = await businessUnitAPI.update(id, businessUnitData);
      
      toast.success('Business unit updated successfully!');
      
      // Refresh the list
      await fetchBusinessUnits(pagination.currentPage, pagination.pageSize);
      
      return updatedBusinessUnit;
    } catch (err) {
      toast.error(`Failed to update business unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete business unit
  const deleteBusinessUnit = async (id) => {
    setLoading(true);
    try {
      // Get the current logged-in user's ID for modifiedby field
      const modifiedby = user?.id;
      
      // Call real API with modifiedby parameter (only if user ID is available)
      await businessUnitAPI.delete(id, modifiedby);
      
      toast.success('Business unit deleted successfully!');
      
      // Refresh the list
      await fetchBusinessUnits(pagination.currentPage, pagination.pageSize);
    } catch (err) {
      toast.error(`Failed to delete business unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle business unit status
  const toggleBusinessUnitStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await businessUnitAPI.update(id, { isactive: newStatus });
      
      toast.success(`Business unit ${newStatus === 1 ? 'activated' : 'deactivated'} successfully!`);
      
      // Refresh the list
      await fetchBusinessUnits(pagination.currentPage, pagination.pageSize);
    } catch (err) {
      toast.error(`Failed to toggle business unit status: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change page
  const changePage = useCallback((page) => {
    fetchBusinessUnits(page, pagination.pageSize);
  }, [fetchBusinessUnits, pagination.pageSize]);

  // Change page size
  const changePageSize = useCallback((newPageSize) => {
    // Reset to page 1 when changing page size
    fetchBusinessUnits(1, newPageSize);
  }, [fetchBusinessUnits]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchBusinessUnits(pagination.currentPage, pagination.pageSize);
  }, [fetchBusinessUnits, pagination.currentPage, pagination.pageSize]);

  // Refetch when filters change (but only if they're actually different)
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    const prevFiltersString = prevFiltersRef.current ? JSON.stringify(prevFiltersRef.current) : null;
    
    if (filtersString !== prevFiltersString) {
      prevFiltersRef.current = { ...filters };
      const currentPageSize = pagination.pageSize || 10;
      fetchBusinessUnits(1, currentPageSize);
    }
  }, [filters, fetchBusinessUnits, pagination.pageSize]);

  return {
    // State
    businessUnits,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchBusinessUnits,
    searchBusinessUnits,
    filterBusinessUnits,
    createBusinessUnit,
    updateBusinessUnit,
    deleteBusinessUnit,
    toggleBusinessUnitStatus,
    changePage,
    changePageSize,
    refresh,
    
    // Computed values
    hasBusinessUnits: businessUnits.length > 0,
    totalPages: Math.ceil(pagination.count / pagination.pageSize),
    shouldShowPagination: pagination.totalPages > 1 && pagination.pageSize !== 1000,
  };
};
