import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching asset status dropdown data
 * Uses the new standardized dropdown API system
 */
export const useAssetStatus = (excludeRecordDeleted = false) => {
  const [allAssetStatuses, setAllAssetStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Static mock statuses to avoid API calls
  const MOCK_STATUSES = [
    { codeid: 481, codename: 'In Stock' },
    { codeid: 482, codename: 'In Repair' },
    { codeid: 483, codename: 'Retired' },
    { codeid: 484, codename: 'Assigned' },
    { codeid: 485, codename: 'Scrapped' },
  ];

  const fetchAssetStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Directly use mock statuses, no API call
    const transformedData = MOCK_STATUSES.map(item => ({
      codeid: item.codeid,
      codename: item.codename,
      id: item.codeid,
      name: item.codename,
      value: item.codeid,
      label: item.codename
    }));
    setAllAssetStatuses(transformedData);
    setLoading(false);
  }, []);

  // Auto-load status data when hook is used
  useEffect(() => {
    fetchAssetStatuses();
  }, [fetchAssetStatuses]);

  // Filter out "Record Deleted" status if requested
  const assetStatuses = excludeRecordDeleted 
    ? allAssetStatuses.filter(status => status.codename !== 'Record Deleted')
    : allAssetStatuses;

  return {
    assetStatuses,
    allAssetStatuses, // Always return all statuses for reference
    loading,
    error,
    refetch: fetchAssetStatuses
  };
};

export default useAssetStatus;
