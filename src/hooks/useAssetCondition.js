import { useState, useEffect } from 'react';
import { dropdownAPI } from '../services/api';

/**
 * Custom hook for fetching asset condition dropdown data
 * Uses the new standardized dropdown API system
 */
export const useAssetCondition = () => {
  const [assetConditions, setAssetConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssetConditions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dropdownAPI.getAssetCondition();
      
      // Transform data to match expected format
      const transformedData = data.map(item => ({
        codeid: item.codeid,
        codename: item.codename,
        // For backward compatibility, also include old format
        id: item.codeid,
        name: item.codename,
        value: item.codeid,
        label: item.codename
      }));
      
      setAssetConditions(transformedData);
    } catch (err) {
      console.error('❌ Error fetching asset conditions:', err);
      setError(err.message || 'Failed to fetch asset conditions');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load conditions (safe now that dropdownAPI is mocked)
  useEffect(() => {
    fetchAssetConditions();
  }, []);

  return {
    assetConditions,
    loading,
    error,
    refetch: fetchAssetConditions
  };
};

export default useAssetCondition;
