import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { countriesAPI } from '../services/api';

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all active countries for dropdown
  const fetchActiveCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🌍 Fetching active countries from API...');
      // Use the recommended endpoint for dropdowns
      const response = await countriesAPI.getActiveCountries();
      console.log('✅ Countries fetched successfully:', response);
      setCountries(response || []);
    } catch (err) {
      console.error('❌ Error in fetchActiveCountries:', err);
      
      // Provide specific error messages
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot reach the backend server. Please check if the server is running.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The backend server is not allowing requests from this origin';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout: The backend server is not responding';
      }
      
      setError(errorMessage);
      toast.error(`Failed to fetch countries: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search countries by name or code
  const searchCountries = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }
    
    try {
      const response = await countriesAPI.searchCountries(searchTerm);
      return response || [];
    } catch (err) {
      console.error('Error in searchCountries:', err);
      return [];
    }
  }, []);

  // Get country by ID
  const getCountryById = useCallback((countryId) => {
    return countries.find(country => country.countryid === parseInt(countryId));
  }, [countries]);

  // Note: Countries are now fetched manually when forms are opened
  // useEffect(() => {
  //   fetchActiveCountries();
  // }, [fetchActiveCountries]);

  return {
    countries,
    loading,
    error,
    fetchActiveCountries,
    searchCountries,
    getCountryById,
  };
};
