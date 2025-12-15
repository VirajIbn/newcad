import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, RefreshCw, Download, SlidersHorizontal, X } from 'lucide-react';
import Button from './ui/button';
import { Input } from './ui/input';
import Card from './ui/card';

const PageControls = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onExport,
  onFilters,
  searchPlaceholder = "Search...",
  showColumns = true,
  showPageSize = true,
  showRefresh = true,
  showExport = true,
  showFilters = true,
  showSearch = true,
  selectedColumns = 13,
  onColumnsChange,
  itemsPerPage = 10,
  onPageSizeChange,
  exportOptions = [
    { label: 'Export to CSV', value: 'csv' },
    { label: 'Export to Excel', value: 'excel' },
    { label: 'Export to PDF', value: 'pdf' }
  ]
}) => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const columnsMenuRef = useRef(null);
  const pageSizeMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
      if (pageSizeMenuRef.current && !pageSizeMenuRef.current.contains(event.target)) {
        setShowPageSizeMenu(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showColumnsMenu || showPageSizeMenu || showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnsMenu, showPageSizeMenu, showExportMenu]);

  const handleExportClick = (option) => {
    if (onExport) {
      onExport(option.value);
    }
    setShowExportMenu(false);
  };

  const clearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        {/* Left side controls */}
        <div className="flex items-center gap-3">
          {/* Columns dropdown */}
          {showColumns && (
            <div className="relative" ref={columnsMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                className="flex items-center gap-2"
              >
                {selectedColumns} Columns
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showColumnsMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {[5, 10, 13, 15, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          if (onColumnsChange) onColumnsChange(num);
                          setShowColumnsMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {num} Columns
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Per page dropdown */}
          {showPageSize && (
            <div className="relative" ref={pageSizeMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPageSizeMenu(!showPageSizeMenu)}
                className="flex items-center gap-2"
              >
                {itemsPerPage} per page
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showPageSizeMenu && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {[5, 10, 25, 50, 100].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          if (onPageSizeChange) onPageSizeChange(num);
                          setShowPageSizeMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {num} per page
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Refresh button */}
          {showRefresh && (
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRefresh}>
              Refresh
            </Button>
          )}

          {/* Export dropdown */}
          {showExport && (
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showExportMenu && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {exportOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleExportClick(option)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filters button */}
          {showFilters && (
            <Button variant="outline" size="sm" icon={SlidersHorizontal} onClick={onFilters}>
              Filters
            </Button>
          )}
        </div>

        {/* Right side - Search bar */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="pl-10 pr-4 w-80"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PageControls;
