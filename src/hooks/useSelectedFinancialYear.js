import { useFinancialYearContext } from '../context/FinancialYearContext';

/**
 * Custom hook to access the selected financial year and related functions
 * This provides a simple interface for components that need financial year data
 */
const useSelectedFinancialYear = () => {
  const {
    selectedFinancialYear,
    getSelectedFinancialYearId,
    getSelectedFinancialYearName,
    updateSelectedFinancialYear,
    clearSelectedFinancialYear,
    resetToDefaultFinancialYear,
    getCurrentFinancialYear
  } = useFinancialYearContext();

  return {
    selectedFinancialYear,
    selectedFinancialYearId: getSelectedFinancialYearId(),
    selectedFinancialYearName: getSelectedFinancialYearName(),
    updateSelectedFinancialYear,
    clearSelectedFinancialYear,
    resetToDefaultFinancialYear,
    getCurrentFinancialYear
  };
};

export default useSelectedFinancialYear;
