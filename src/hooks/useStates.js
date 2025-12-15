import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { statesAPI } from '../services/api';

export const useStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch states by country (for cascading dropdown)
  const fetchStatesByCountry = useCallback(async (countryId) => {
    if (!countryId) {
      setStates([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🏛️ Fetching states for country:', countryId);
      const response = await statesAPI.getStatesByCountry(countryId);
      console.log('✅ States fetched successfully:', response);
      setStates(response || []);
    } catch (err) {
      console.error('❌ Error in fetchStatesByCountry:', err);
      
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
      toast.error(`Failed to fetch states: ${errorMessage}`);
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all active states
  const fetchAllStates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏛️ Fetching all active states...');
      const response = await statesAPI.getActiveStates();
      console.log('✅ All states fetched successfully:', response);
      setStates(response || []);
    } catch (err) {
      console.error('❌ Error in fetchAllStates:', err);
      
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot reach the backend server.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The backend server is not allowing requests from this origin';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout: The backend server is not responding';
      }
      
      setError(errorMessage);
      toast.error(`Failed to fetch states: ${errorMessage}`);
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get state by ID
  const getStateById = useCallback((stateId) => {
    return states.find(state => state.stateid === parseInt(stateId));
  }, [states]);

  // Clear states (when country changes)
  const clearStates = useCallback(() => {
    setStates([]);
    setError(null);
  }, []);

  return {
    states,
    loading,
    error,
    fetchStatesByCountry,
    fetchAllStates,
    getStateById,
    clearStates,
  };
};
