import { useState, useEffect, useCallback } from 'react';
import { dropdownAPI } from '../services/api';

/**
 * Custom hook for fetching branches dropdown data
 * Uses the organization-specific API endpoint
 */
export const useBranches = (orgId) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBranches = useCallback(async (organizationId) => {
    if (!organizationId) {
      console.warn('⚠️ No organization ID provided for branches');
      setBranches([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await dropdownAPI.getBranches(organizationId);
      
      // Transform data to match expected format
      const transformedData = data.map(item => ({
        branchid: item.branchid || item.id,
        branchname: item.branchname || item.name,
        // For backward compatibility, also include old format
        id: item.branchid || item.id,
        name: item.branchname || item.name,
        value: item.branchid || item.id,
        label: item.branchname || item.name
      }));
      
      setBranches(transformedData);
    } catch (err) {
      console.error('❌ Error fetching branches:', err);
      setError(err.message || 'Failed to fetch branches');
      setBranches([]); // Set empty array instead of fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load branches data when hook is used
  useEffect(() => {
    if (orgId) {
      fetchBranches(orgId);
    }
  }, [fetchBranches, orgId]);

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches
  };
};

export default useBranches;
