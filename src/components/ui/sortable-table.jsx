import React, { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// SortableTable component that wraps your existing Table components
const SortableTable = ({ 
  children, 
  data, 
  onSort, 
  defaultSortKey = null, 
  defaultSortDirection = 'asc',
  sortConfig: externalSortConfig = null, // Accept external sort config
  className = ''
}) => {
  const [internalSortConfig, setInternalSortConfig] = useState({
    key: defaultSortKey,
    direction: defaultSortDirection
  });

  // Use external sort config if provided, otherwise use internal
  const sortConfig = externalSortConfig || internalSortConfig;

  // Handle sorting when column header is clicked
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    
    // If clicking the same column, toggle direction
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const newSortConfig = { key, direction };
    
    // Only update internal state if no external config is provided
    if (!externalSortConfig) {
      setInternalSortConfig(newSortConfig);
    }
    
    // Call parent's onSort callback if provided
    if (onSort) {
      onSort(newSortConfig);
    }
  }, [sortConfig, onSort, externalSortConfig]);

  // Get sort icon for column header
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  // Create context value for child components
  const contextValue = {
    sortConfig,
    handleSort,
    getSortIcon
  };

  return (
    <SortableTableContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </SortableTableContext.Provider>
  );
};

// Context for sharing sorting state
const SortableTableContext = React.createContext();

// Hook to use sorting functionality in child components
export const useSortableTable = () => {
  const context = React.useContext(SortableTableContext);
  if (!context) {
    throw new Error('useSortableTable must be used within a SortableTable');
  }
  return context;
};

// SortableTableHead component - use this instead of regular Table.Head
const SortableTableHead = React.forwardRef(({ 
  sortKey, 
  children, 
  className = '', 
  sortable = true,
  ...props 
}, ref) => {
  const { handleSort, getSortIcon } = useSortableTable();

  if (!sortable || !sortKey) {
    return (
      <th
        ref={ref}
        className={cn("h-10 px-2 text-left align-middle font-semibold text-sm text-gray-700 dark:text-gray-300", className)}
        {...props}
      >
        {children}
      </th>
    );
  }

  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-2 text-left align-middle font-semibold text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
        className
      )}
      onClick={() => handleSort(sortKey)}
      {...props}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {getSortIcon(sortKey)}
      </div>
    </th>
  );
});

SortableTableHead.displayName = 'SortableTableHead';

// Utility function to sort data locally (if you don't want to use backend sorting)
export const sortData = (data, sortConfig) => {
  if (!sortConfig || !sortConfig.key) return data;

  return [...data].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle null/undefined values
    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';

    // Convert to strings for comparison
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();

    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
};

// Debug function to check available fields in data
export const debugDataFields = (data) => {
  if (!data || data.length === 0) return [];
  
  const firstItem = data[0];
  const fields = Object.keys(firstItem);
  
  return fields;
};

// Export the main component and utilities
export { SortableTable, SortableTableHead };
export default SortableTable;
