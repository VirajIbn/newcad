import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { citiesAPI } from '../services/api';

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities by state (for cascading dropdown)
  const fetchCitiesByState = useCallback(async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🏙️ Fetching cities for state:', stateId);
      const response = await citiesAPI.getCitiesByState(stateId);
      console.log('✅ Cities fetched successfully:', response);
      setCities(response || []);
    } catch (err) {
      console.error('❌ Error in fetchCitiesByState:', err);
      
      // Provide specific error messages
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot reach the backend server.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The backend server is not allowing requests from this origin';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout: The backend server is not responding';
      }
      
      setError(errorMessage);
      toast.error(`Failed to fetch cities: ${errorMessage}`);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all active cities
  const fetchAllCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏙️ Fetching all active cities...');
      const response = await citiesAPI.getActiveCities();
      console.log('✅ All cities fetched successfully:', response);
      setCities(response || []);
    } catch (err) {
      console.error('❌ Error in fetchAllCities:', err);
      
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot reach the backend server.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The backend server is not allowing requests from this origin';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout: The backend server is not responding';
      }
      
      setError(errorMessage);
      toast.error(`Failed to fetch cities: ${errorMessage}`);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get city by ID
  const getCityById = useCallback((cityId) => {
    return cities.find(city => city.cityid === parseInt(cityId));
  }, [cities]);

  // Clear cities (when state changes)
  const clearCities = useCallback(() => {
    setCities([]);
    setError(null);
  }, []);

  return {
    cities,
    loading,
    error,
    fetchCitiesByState,
    fetchAllCities,
    getCityById,
    clearCities,
  };
};
