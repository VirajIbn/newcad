import { useState, useEffect, useCallback } from 'react';
import { dropdownAPI } from '../services/api';

/**
 * Custom hook for fetching departments dropdown data
 * Uses the organization-specific API endpoint
 */
export const useDepartments = (orgId) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async (organizationId) => {
    if (!organizationId) {
      console.warn('⚠️ No organization ID provided for departments');
      setDepartments([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await dropdownAPI.getDepartments(organizationId);
      
      // Transform data to match expected format
      const transformedData = data.map(item => ({
        departmentid: item.departmentid || item.id,
        departmentname: item.departmentname || item.name,
        // For backward compatibility, also include old format
        id: item.departmentid || item.id,
        name: item.departmentname || item.name,
        value: item.departmentid || item.id,
        label: item.departmentname || item.name
      }));
      
      setDepartments(transformedData);
    } catch (err) {
      console.error('❌ Error fetching departments:', err);
      setError(err.message || 'Failed to fetch departments');
      setDepartments([]); // Set empty array instead of fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load departments data when hook is used
  useEffect(() => {
    if (orgId) {
      fetchDepartments(orgId);
    }
  }, [fetchDepartments, orgId]);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments
  };
};

export default useDepartments;
