import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { dropdownAPI } from '../services/api';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, return mock data since we don't have a services API
      // In a real implementation, you would call the actual API
      const mockServices = [
        { id: 1, name: 'Cloud Services' },
        { id: 2, name: 'Data Analytics' },
        { id: 3, name: 'Software Development' },
        { id: 4, name: 'IT Consulting' },
        { id: 5, name: 'Digital Marketing' },
        { id: 6, name: 'Cybersecurity' },
        { id: 7, name: 'AI/ML Solutions' },
        { id: 8, name: 'Mobile App Development' },
        { id: 9, name: 'Web Development' },
        { id: 10, name: 'DevOps Services' },
      ];
      
      setServices(mockServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
};
