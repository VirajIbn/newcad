import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useFinancialYears from '../hooks/useFinancialYears';

const FinancialYearContext = createContext();

export const useFinancialYearContext = () => {
  const context = useContext(FinancialYearContext);
  if (!context) {
    throw new Error('useFinancialYearContext must be used within a FinancialYearProvider');
  }
  return context;
};

const STORAGE_KEY = 'selected_financial_year';
const DEFAULT_ORG_ID = 962834;

export const FinancialYearProvider = ({ children, orgId }) => {
  // Use provided orgId or fallback to default
  const effectiveOrgId = orgId || DEFAULT_ORG_ID;
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
  const { 
    financialYears, 
    loading, 
    error, 
    getCurrentFinancialYear,
    searchFinancialYears,
    getClosedFinancialYears,
    getDefaultFinancialYear,
    getFinancialYearsByDateRange,
    getAllFinancialYears
  } = useFinancialYears(effectiveOrgId);

  // Set financial year when data loads - prioritize localStorage, then default from database
  useEffect(() => {
    if (financialYears.length > 0) {
      
      // First priority: Check localStorage for user's previous selection
      const savedYear = localStorage.getItem(STORAGE_KEY);
      if (savedYear) {
        try {
          const parsedYear = JSON.parse(savedYear);
          
          // Special handling for "All Financial Year" option (id: 0)
          if (parsedYear.id === 0) {
            setSelectedFinancialYear(parsedYear);
            return; // Exit early for All Financial Year
          }
          
          // Verify the saved year still exists in the current financial years list
          const yearExists = financialYears.find(year => year.id === parsedYear.id);
          if (yearExists) {
            setSelectedFinancialYear(parsedYear);
            return; // Exit early if we found a valid saved year
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error('Error parsing saved financial year:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      
      // Second priority: Find financial year with isdefault = 1 (always set this on fresh login)
      const defaultYear = financialYears.find(year => year.isdefault === 1 || year.isdefault === "1");
      
      if (defaultYear) {
        setSelectedFinancialYear(defaultYear);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultYear));
      } else {
        // Fallback to current active or first year
        const currentYear = getCurrentFinancialYear();
        if (currentYear) {
          setSelectedFinancialYear(currentYear);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentYear));
        } else {
          const firstYear = financialYears[0];
          setSelectedFinancialYear(firstYear);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(firstYear));
        }
      }
    } else if (financialYears.length === 0 && !loading) {
      // If no financial years are available and we're not loading, 
      // create a default "All Financial Year" option to allow the app to function
      const defaultAllYear = {
        id: 0,
        year: 'All Financial Year',
        displayName: 'All Financial Year',
        shortName: 'All Financial Year',
        fullYear: 'All Financial Year',
        isActive: true,
        isClosed: false,
        isdefault: 0
      };
      setSelectedFinancialYear(defaultAllYear);
    }
  }, [financialYears, getCurrentFinancialYear, loading]);

  // Update selected financial year and save to localStorage
  const updateSelectedFinancialYear = (year) => {
    setSelectedFinancialYear(year);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(year));
  };

  // Clear selected financial year from localStorage
  const clearSelectedFinancialYear = () => {
    setSelectedFinancialYear(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Force reset to default financial year
  const resetToDefaultFinancialYear = () => {
    if (financialYears.length > 0) {
      const defaultYear = financialYears.find(year => year.isdefault === 1 || year.isdefault === "1");
      if (defaultYear) {
        setSelectedFinancialYear(defaultYear);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultYear));
      }
    }
  };

  // Clear localStorage and reset to default (useful for logout simulation)
  const clearAndResetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (financialYears.length > 0) {
      const defaultYear = financialYears.find(year => year.isdefault === 1 || year.isdefault === "1");
      if (defaultYear) {
        setSelectedFinancialYear(defaultYear);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultYear));
      }
    }
  };

  // Get saved financial year from localStorage
  const getSavedFinancialYear = useCallback(() => {
    const savedYear = localStorage.getItem(STORAGE_KEY);
    if (savedYear) {
      try {
        return JSON.parse(savedYear);
      } catch (error) {
        console.error('Error parsing saved financial year:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Check if there's a saved financial year in localStorage
  const hasSavedFinancialYear = () => {
    const savedYear = localStorage.getItem(STORAGE_KEY);
    return savedYear !== null;
  };

  // Force refresh from localStorage (useful when navigating between pages)
  const refreshFromLocalStorage = useCallback(() => {
    const savedYear = getSavedFinancialYear();
    if (savedYear) {
      // Special handling for "All Financial Year" option (id: 0)
      if (savedYear.id === 0) {
        setSelectedFinancialYear(savedYear);
        return true;
      }
      
      // For regular financial years, check if they exist in the current list
      if (financialYears.length > 0) {
        const yearExists = financialYears.find(year => year.id === savedYear.id);
        if (yearExists) {
          setSelectedFinancialYear(savedYear);
          return true;
        }
      }
    }
    return false;
  }, [financialYears, getSavedFinancialYear]);

  // Clear all financial year data (for testing)
  const clearAllFinancialYearData = () => {
    setSelectedFinancialYear(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Get financial year ID for API calls
  const getSelectedFinancialYearId = () => {
    return selectedFinancialYear?.id || null;
  };

  // Get financial year name for display
  const getSelectedFinancialYearName = () => {
    return selectedFinancialYear?.shortName || selectedFinancialYear?.displayName || 'Select FY';
  };

  // Debug method to check current state
  const debugFinancialYearState = () => {
    return {
      totalYears: financialYears.length,
      allYears: financialYears,
      selectedYear: selectedFinancialYear,
      defaultYear: financialYears.find(year => year.isdefault === 1 || year.isdefault === "1"),
      hasSavedYear: hasSavedFinancialYear(),
      savedYear: getSavedFinancialYear()
    };
  };

  const value = {
    selectedFinancialYear,
    financialYears,
    loading,
    error,
    updateSelectedFinancialYear,
    clearSelectedFinancialYear,
    resetToDefaultFinancialYear,
    clearAndResetToDefault,
    refreshFromLocalStorage,
    clearAllFinancialYearData,
    getSelectedFinancialYearId,
    getSelectedFinancialYearName,
    hasSavedFinancialYear,
    getSavedFinancialYear,
    debugFinancialYearState,
    getCurrentFinancialYear,
    // New API methods
    searchFinancialYears,
    getClosedFinancialYears,
    getDefaultFinancialYear,
    getFinancialYearsByDateRange,
    getAllFinancialYears,
  };

  return (
    <FinancialYearContext.Provider value={value}>
      {children}
    </FinancialYearContext.Provider>
  );
};

export default FinancialYearContext;
