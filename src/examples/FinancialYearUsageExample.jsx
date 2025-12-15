import React from 'react';
import { useSelectedFinancialYear } from '../hooks/useSelectedFinancialYear';

/**
 * Example component showing how to use the financial year context
 * This demonstrates how to access the selected financial year in any component
 */
const FinancialYearUsageExample = () => {
  const {
    selectedFinancialYear,
    selectedFinancialYearId,
    selectedFinancialYearName,
    updateSelectedFinancialYear,
    clearSelectedFinancialYear,
    resetToDefaultFinancialYear,
    clearAllFinancialYearData
  } = useSelectedFinancialYear();

  const handleClearSelection = () => {
    clearSelectedFinancialYear();
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Financial Year Context Usage Example</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Current Selection:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ID: {selectedFinancialYearId || 'None'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Name: {selectedFinancialYearName}
          </p>
        </div>

        {selectedFinancialYear && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Full Details:</h4>
            <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {JSON.stringify(selectedFinancialYear, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleClearSelection}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Clear Selection
          </button>
          <button
            onClick={resetToDefaultFinancialYear}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Reset to Default
          </button>
          <button
            onClick={clearAllFinancialYearData}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialYearUsageExample;
