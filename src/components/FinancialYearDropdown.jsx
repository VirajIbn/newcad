import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinancialYearContext } from '../context/FinancialYearContext';
import { Input } from './ui/input';

const FinancialYearDropdown = ({ 
  className = "",
  placeholder = "Select FY",
  showLabel = false,
  label = "Financial Year",
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const { 
    selectedFinancialYear, 
    financialYears, 
    loading, 
    error, 
    updateSelectedFinancialYear
  } = useFinancialYearContext();


  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(''); // Clear search when closing
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Create "All Financial Year" option
  const allFinancialYearOption = {
    id: 0,
    shortName: "All Financial Year",
    displayName: "All Financial Year",
    isActive: false
  };

  // Filter financial years based on search term
  const filteredFinancialYears = useMemo(() => {
    if (!searchTerm) return financialYears;
    return financialYears.filter(year => 
      year.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [financialYears, searchTerm]);

  const handleYearSelect = (year) => {
    updateSelectedFinancialYear(year);
    setIsOpen(false);
    setSearchTerm(''); // Clear search when selection is made
    
    // Call the onChange prop if provided
    if (onChange) {
      onChange(year);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 h-8 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        <span>Loading FY...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 h-8 text-xs text-red-500 ${className}`}>
        <span>Error loading FY</span>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 h-8 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-200 w-[200px]"
      >
        <span className="flex-1 text-left truncate">
          {selectedFinancialYear ? selectedFinancialYear.shortName : placeholder}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search financial years..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="py-2 max-h-60 overflow-y-auto">
              {/* All Financial Year Option */}
              <button
                onClick={() => handleYearSelect(allFinancialYearOption)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedFinancialYear?.id === 0 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">All Financial Year</span>
                </div>
              </button>
              
              {/* Financial Years List */}
              {filteredFinancialYears.length > 0 ? (
                filteredFinancialYears.map((year) => (
                  <button
                    key={year.id}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      selectedFinancialYear?.id === year.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{year.shortName}</span>
                    </div>
                    {year.isActive && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  {searchTerm ? 'No matching financial years found' : 'No financial years available'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialYearDropdown;
