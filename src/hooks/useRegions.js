import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { dropdownAPI } from '../services/api';

export const useRegions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, return mock data since we don't have a regions API
      // In a real implementation, you would call the actual API
      const mockRegions = [
        { id: 1, name: 'North America' },
        { id: 2, name: 'Europe' },
        { id: 3, name: 'Asia Pacific' },
        { id: 4, name: 'Middle East' },
        { id: 5, name: 'Africa' },
        { id: 6, name: 'South America' },
      ];
      
      setRegions(mockRegions);
    } catch (err) {
      console.error('Error fetching regions:', err);
      setError(err.message);
      toast.error('Failed to fetch regions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return {
    regions,
    loading,
    error,
    refetch: fetchRegions,
  };
};
