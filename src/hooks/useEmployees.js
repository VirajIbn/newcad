import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { dropdownAPI } from '../services/api';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active employees for dropdown
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await dropdownAPI.getActiveEmployees();
      setEmployees(response);
    } catch (err) {
      console.error('❌ Error fetching active employees:', err);
      
      // Provide more specific error messages
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot reach the backend server. Please check if the server is running.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The backend server is not allowing requests from this origin';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout: The backend server is not responding';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed: Please login again';
      }
      
      setError(errorMessage);
      toast.error(`Failed to fetch employees: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh employees data
  const refresh = useCallback(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Comment out auto-loading to prevent 404 errors on page load
  // useEffect(() => {
  //   fetchEmployees();
  // }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    refresh,
    hasEmployees: employees.length > 0,
  };
};
