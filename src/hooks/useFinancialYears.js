import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
const DEBUG = true;
import { dropdownAPI } from '../services/api';

const useFinancialYears = (orgId) => {
  // Use provided orgId or fallback to default
  const effectiveOrgId = orgId || 962834;
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFinancialYears = useCallback(async (params = {}) => {
    if (!effectiveOrgId) {
      console.warn('No organization ID provided for financial years');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use the updated API with new parameters
      const data = await dropdownAPI.getFinancialYears(effectiveOrgId, {
        isclosed: 0, // Get open years by default
        ordering: '-startdate', // Order by start date descending (newest first)
        ...params
      });
      
      // Handle the new API response structure with pagination
      const results = data.results || data;
      
      // Transform the data to match the expected format
      const transformedData = Array.isArray(results) ? results.map(year => ({
        id: year.financialyearid || year.id,
        year: year.fyname || year.year,
        displayName: year.fyname || year.displayName, // Use the fyname directly (e.g., "FY 2024-25")
        shortName: (year.fyname || year.shortName || '').split(' ')[1] || year.fyname || year.shortName, // Extract year without FY prefix (e.g., "2024-25")
        fullYear: year.fyname || year.fullYear,
        startDate: year.startdate || year.startDate,
        endDate: year.enddate || year.endDate,
        isdefault: year.isdefault, // Preserve the isdefault flag as-is
        isActive: year.isdefault === 1 || year.isActive === true,
        isClosed: year.isclosed === 1 || year.isClosed === true,
        // Additional fields from new API
        orgid: year.orgid,
        addedby: year.addedby,
        addeddate: year.addeddate,
        modifiedby: year.modifiedby,
        modifieddate: year.modifieddate
      })) : [];

      setFinancialYears(transformedData);
      
      // Always log for debugging default year issue
      const defaultYear = transformedData.find(year => year.isdefault === 1);
      
      if (DEBUG) {
      }
    } catch (err) {
      console.error('❌ Error fetching financial years:', err);
      setError(err.message);
      
      // Fallback: Generate current and next few years
      const currentYear = new Date().getFullYear();
      const fallbackYears = [
        { 
          id: currentYear - 1, 
          year: `FY ${currentYear - 1}-${String(currentYear).slice(-2)}`, 
          displayName: `FY ${currentYear - 1}-${String(currentYear).slice(-2)}`,
          shortName: `${currentYear - 1}-${String(currentYear).slice(-2)}`,
          fullYear: `FY ${currentYear - 1}-${String(currentYear).slice(-2)}`,
          isActive: false,
          isClosed: false
        },
        { 
          id: currentYear, 
          year: `FY ${currentYear}-${String(currentYear + 1).slice(-2)}`, 
          displayName: `FY ${currentYear}-${String(currentYear + 1).slice(-2)}`,
          shortName: `${currentYear}-${String(currentYear + 1).slice(-2)}`,
          fullYear: `FY ${currentYear}-${String(currentYear + 1).slice(-2)}`,
          isActive: true,
          isClosed: false
        },
        { 
          id: currentYear + 1, 
          year: `FY ${currentYear + 1}-${String(currentYear + 2).slice(-2)}`, 
          displayName: `FY ${currentYear + 1}-${String(currentYear + 2).slice(-2)}`,
          shortName: `${currentYear + 1}-${String(currentYear + 2).slice(-2)}`,
          fullYear: `FY ${currentYear + 1}-${String(currentYear + 2).slice(-2)}`,
          isActive: false,
          isClosed: false
        }
      ];
      
      setFinancialYears(fallbackYears);
      toast.warning('Using fallback financial years data');
    } finally {
      setLoading(false);
    }
  }, [effectiveOrgId]);

  useEffect(() => {
    fetchFinancialYears();
  }, [fetchFinancialYears]);

  const getCurrentFinancialYear = useCallback(() => {
    return financialYears.find(year => year.isActive) || financialYears[0] || null;
  }, [financialYears]);

  // Search financial years by name
  const searchFinancialYears = useCallback(async (searchTerm) => {
    return fetchFinancialYears({ search: searchTerm });
  }, [fetchFinancialYears]);

  // Get closed financial years
  const getClosedFinancialYears = useCallback(async () => {
    return fetchFinancialYears({ isclosed: 1 });
  }, [fetchFinancialYears]);

  // Get default financial year
  const getDefaultFinancialYear = useCallback(async () => {
    return fetchFinancialYears({ isdefault: 1 });
  }, [fetchFinancialYears]);

  // Filter by date range
  const getFinancialYearsByDateRange = useCallback(async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startdate__gte = startDate;
    if (endDate) params.enddate__lte = endDate;
    return fetchFinancialYears(params);
  }, [fetchFinancialYears]);

  // Get all financial years (including closed)
  const getAllFinancialYears = useCallback(async () => {
    return fetchFinancialYears({}); // No filters
  }, [fetchFinancialYears]);

  return {
    financialYears,
    loading,
    error,
    refetch: fetchFinancialYears,
    getCurrentFinancialYear,
    searchFinancialYears,
    getClosedFinancialYears,
    getDefaultFinancialYear,
    getFinancialYearsByDateRange,
    getAllFinancialYears
  };
};

export default useFinancialYears;
