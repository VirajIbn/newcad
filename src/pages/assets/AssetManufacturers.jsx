import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  Factory,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X
} from 'lucide-react';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table } from '../../components/ui/table';
import { SortableTable, SortableTableHead } from '../../components/ui/sortable-table';
import { Badge } from '../../components/ui/badge';
import Card from '../../components/ui/card';
import { useManufacturers } from '../../hooks/useManufacturers';
import { useDebounce } from '../../hooks/useDebounce';
import ManufacturerForm from '../../components/forms/ManufacturerForm';
import { toast } from 'react-toastify';
import { exportManufacturersToPDF } from '../../utils/pdfExport';
import { formatDate as formatDateUtil } from '../../utils/formatDate';

const AssetManufacturers = () => {

  
  const {
    manufacturers,
    loading,
    error,
    pagination,
    filters,
    searchManufacturers,
    filterManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
    toggleManufacturerStatus,
    changePage,
    changePageSize,
    refresh,
    shouldShowPagination,
  } = useManufacturers();



  const [showForm, setShowForm] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'addeddate', direction: 'desc' });
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedColumns, setSelectedColumns] = useState(['checkbox', 'srno', 'name', 'description', 'addeddate', 'actions']);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  
  // Update search and ordering when they change
  useEffect(() => {
    const ordering = sortConfig.key ? (sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key) : '-addeddate';
    searchManufacturers(debouncedSearchTerm);
    filterManufacturers({ ordering });
  }, [debouncedSearchTerm, sortConfig, searchManufacturers, filterManufacturers]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const columnSelectorRef = useRef(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle sorting from SortableTable
  const handleSort = (sortConfig) => {
    setSortConfig(sortConfig);
  };



  // Handle column selection
  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  // Get available columns
  const availableColumns = [
    { key: 'checkbox', label: 'Select', required: true },
    { key: 'srno', label: 'Sr No', required: true },
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', required: true },
    { key: 'addeddate', label: 'Added Date', required: true },
    { key: 'actions', label: 'Actions', required: true }
  ];

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.column-selector-button-container')) {
        setShowColumnSelector(false);
      }
      if (!event.target.closest('.page-size-button-container')) {
        setShowPageSizeMenu(false);
      }
      if (!event.target.closest('.export-button-container')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside export menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.export-button-container')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside page size menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.page-size-button-container')) {
        setShowPageSizeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    
    try {
      if (editingManufacturer) {
        
        await updateManufacturer(editingManufacturer.manufacturerid, formData);
      } else {
        
        await createManufacturer(formData);
      }
      setShowForm(false);
      setEditingManufacturer(null);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Don't show error toast for duplicate manufacturers (already shown in useManufacturers)
      if (error.message !== 'DUPLICATE_MANUFACTURER') {
        toast.error('Failed to save manufacturer. Please try again.');
      }
      
      // Don't close the form on error, let user see the error and try again
    }
  };

  // Handle edit
  const handleEdit = (manufacturer) => {
    setEditingManufacturer(manufacturer);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      setDeletingId(id);
      try {
        await deleteManufacturer(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await toggleManufacturerStatus(id, currentStatus);
    } catch (error) {
      console.error('Status toggle error:', error);
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const currentData = searchTerm ? filteredManufacturers : manufacturers;
    if (selectedManufacturers.length === currentData.length) {
      setSelectedManufacturers([]);
    } else {
      setSelectedManufacturers(currentData.map(m => m.manufacturerid));
    }
  };

  // Handle individual checkbox selection
  const handleSelectManufacturer = (manufacturerId) => {
    setSelectedManufacturers(prev => 
      prev.includes(manufacturerId)
        ? prev.filter(id => id !== manufacturerId)
        : [...prev, manufacturerId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedManufacturers.length === 0) return;
    
    const confirmMessage = selectedManufacturers.length === 1 
      ? 'Are you sure you want to delete this manufacturer?'
      : `Are you sure you want to delete ${selectedManufacturers.length} manufacturers?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Store count before deletion for toast message
        const deletedCount = selectedManufacturers.length;
        
        // Temporarily disable toast notifications for bulk delete
        const originalToastSuccess = toast.success;
        const originalToastError = toast.error;
        
        // Override toast functions to suppress individual notifications
        toast.success = () => {}; // Suppress individual success toasts
        toast.error = (message) => {
          // Only show error toasts for actual errors
          originalToastError(message);
        };
        
        try {
          // Delete each selected manufacturer
          await Promise.all(
            selectedManufacturers.map(id => deleteManufacturer(id))
          );
          
          // Restore original toast functions
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          
          // Clear selection after successful deletion
          setSelectedManufacturers([]);
          
          // Show single toast with count
          toast.success(`${deletedCount} manufacturer${deletedCount !== 1 ? 's' : ''} deleted successfully!`);
        } catch (deleteError) {
          // Restore original toast functions in case of error
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          throw deleteError;
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete selected manufacturers');
      }
    }
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    // Don't allow toggling required columns
    if (columnKey === 'checkbox' || columnKey === 'srno' || columnKey === 'name') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow removing the last non-required column
        const nonRequiredColumns = prev.filter(col => col !== 'srno' && col !== 'name');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev;
        }
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Client-side search fallback for comprehensive search
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredManufacturers(manufacturers);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = manufacturers.filter(manufacturer => {
      // Search across all relevant fields
      const searchableFields = [
        manufacturer.manufacturername,
        manufacturer.description,
        manufacturer.addeddate
      ];

      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredManufacturers(filtered);
  }, [manufacturers, searchTerm]);

  // Handle export to Excel or PDF
  const handleExport = (type) => {
    if (!manufacturers || manufacturers.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      if (type === 'excel') {
        // Export to Excel (CSV format)
        exportToExcel();
      } else if (type === 'pdf') {
        // Export to PDF
        exportToPDF();
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export data to ${type.toUpperCase()}`);
    }
  };

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    try {
      // Create CSV content based on selected columns
      const columnMap = {
        srno: 'Sr No',
        name: 'Name',
        description: 'Description',
        addeddate: 'Added Date'
      };

      const headers = selectedColumns
        .filter(col => col !== 'actions') // Don't export actions column
        .map(col => columnMap[col] || col);

      const csvContent = [
        headers.join(','),
        ...manufacturers.map((manufacturer, index) => {
          const row = [];
          selectedColumns.forEach(col => {
            if (col === 'srno') {
              row.push(((pagination.currentPage - 1) * pagination.pageSize) + index + 1);
            } else if (col === 'name') {
              row.push(`"${manufacturer.manufacturername || ''}"`);
            } else if (col === 'description') {
              row.push(`"${manufacturer.description || ''}"`);
            } else if (col === 'addeddate') {
              row.push(manufacturer.addeddate ? formatDate(manufacturer.addeddate) : 'N/A');
            }
            // Skip actions column
          });
          return row.join(',');
        })
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `manufacturers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Excel export completed successfully!');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export to Excel');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    exportManufacturersToPDF({
      manufacturers,
      selectedColumns,
      pagination,
      formatDate,
      onSuccess: (filename) => {
        toast.success('PDF export completed successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to export to PDF: ${error}`);
      }
    });
  };

  // Format date using centralized utility
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDateUtil(dateString);
  };

  // Get status badge
  const getStatusBadge = (isactive, isdeleted) => {
    if (isdeleted === 1) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    return isactive === 1 ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  // Get action buttons
  const getActionButtons = (manufacturer) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(manufacturer)}
        disabled={loading}
        className="p-2"
        title="Edit"
      >
        <Edit className="w-4 h-4 text-green-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(manufacturer.manufacturerid)}
        disabled={loading || deletingId === manufacturer.manufacturerid}
        className="p-2"
        title="Delete"
      >
        {deletingId === manufacturer.manufacturerid ? (
          <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 text-red-600" />
        )}
      </Button>
    </div>
  );

  // Simple fallback to test if component renders
  if (!manufacturers && !loading && !error) {
    return (
      <div className="p-6">
        <div className="mb-4">
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Component is rendering, waiting for data...
        </p>
        <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            If you can see this, the component is working but data is not loading.
          </p>
        </div>
        <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            Debug info: manufacturers={JSON.stringify(manufacturers)}, loading={loading}, error={error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          size="lg"
          onClick={() => setShowForm(true)}
        >
          Add Manufacturer
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        {/* Bottom Row: Controls */}
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Left: Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="relative column-selector-button-container">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="flex items-center space-x-2"
              >
                <span>{selectedColumns.length} Columns</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {/* Column Selector Dropdown Menu */}
              {showColumnSelector && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Select Columns
                    </div>
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Select</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sr No</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Manufacturer Name</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('description')}
                        onChange={() => toggleColumn('description')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Description</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('addeddate')}
                        onChange={() => toggleColumn('addeddate')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Added Date</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('actions')}
                        onChange={() => toggleColumn('actions')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Actions</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Page Size Dropdown */}
            <div className="relative page-size-button-container">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPageSizeMenu(!showPageSizeMenu)}
                className="flex items-center space-x-2"
              >
                <span>{pagination.pageSize === 1000 ? 'All' : `${pagination.pageSize} per page`}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {/* Page Size Dropdown Menu */}
              {showPageSizeMenu && (
                <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        changePageSize(10);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pagination.pageSize === 10 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>10 per page</span>
                      {pagination.pageSize === 10 && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        changePageSize(20);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pagination.pageSize === 20 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>20 per page</span>
                      {pagination.pageSize === 20 && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        changePageSize(50);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pagination.pageSize === 50 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>50 per page</span>
                      {pagination.pageSize === 50 && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        changePageSize(1000);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pagination.pageSize === 1000 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>All</span>
                      {pagination.pageSize === 1000 && <span className="text-blue-600">✓</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              icon={RefreshCw}
              size="sm"
              onClick={refresh}
              disabled={loading}
            >
              Refresh
            </Button>

            <Button
              variant="outline"
              icon={Download}
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="relative export-button-container"
            >
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
              
              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleExport('excel');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <span className="text-green-600">📊</span>
                      <span>Export to Excel</span>
                    </button>
                    <button
                      onClick={() => {
                        handleExport('pdf');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <span className="text-red-600">📄</span>
                      <span>Export to PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </Button>
          </div>

          {/* Right: Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search manufacturers by name, description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10 w-80"
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
        </div>
      </div>

      {/* Selected Items Indicator */}
      {selectedManufacturers.length > 0 && (
        <div className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {selectedManufacturers.length} manufacturer{selectedManufacturers.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={loading}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedManufacturers([])}
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Top Pagination */}
      {shouldShowPagination && (
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {pagination.pageSize === 1000 ? (
              `Showing all ${pagination.count} results`
            ) : (
              <>
                Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.count)} of{' '}
                {pagination.count} results
              </>
            )}
          </div>
          
          {pagination.pageSize !== 1000 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={!pagination.previous}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={!pagination.next}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Manufacturers Table */}
      <Card className="overflow-hidden">
        {loading && manufacturers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading manufacturers...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 text-red-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Manufacturers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button variant="primary" onClick={refresh}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (searchTerm ? filteredManufacturers : manufacturers).length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Manufacturers Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filters.search || filters.isactive !== '' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first manufacturer'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-auto max-h-[70vh] pr-2 pb-2">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {selectedColumns.includes('checkbox') && (
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedManufacturers.length > 0 && selectedManufacturers.length === (searchTerm ? filteredManufacturers : manufacturers).length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                  )}
                  {selectedColumns.includes('srno') && (
                    <th className="h-10 px-2 text-center align-middle font-medium text-gray-700 dark:text-gray-300">Sr No</th>
                  )}
                  {selectedColumns.includes('name') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'manufacturername', direction: sortConfig.key === 'manufacturername' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {sortConfig.key === 'manufacturername' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('description') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'description', direction: sortConfig.key === 'description' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Description</span>
                        {sortConfig.key === 'description' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('addeddate') && (
                    <th 
                      className="h-10 px-2 text-center align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'addeddate', direction: sortConfig.key === 'addeddate' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>Added Date</span>
                        {sortConfig.key === 'addeddate' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('actions') && (
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {(searchTerm ? filteredManufacturers : manufacturers).map((manufacturer, index) => (
                    <motion.tr
                      key={manufacturer.manufacturerid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {selectedColumns.includes('checkbox') && (
                        <td className="py-4 px-2">
                          <input
                            type="checkbox"
                            checked={selectedManufacturers.includes(manufacturer.manufacturerid)}
                            onChange={() => handleSelectManufacturer(manufacturer.manufacturerid)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                      )}
                      {selectedColumns.includes('srno') && (
                        <td className="py-4 px-2 text-sm text-center text-gray-600 dark:text-gray-400">
                          {((pagination.currentPage - 1) * pagination.pageSize) + index + 1}
                        </td>
                      )}
                      {selectedColumns.includes('name') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">
                          {manufacturer.manufacturername}
                        </td>
                      )}
                      {selectedColumns.includes('description') && (
                        <td className="py-4 px-2 max-w-xs">
                          <div className="truncate text-sm text-gray-900 dark:text-white" title={manufacturer.description}>
                            {manufacturer.description || 'No description'}
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('addeddate') && (
                        <td className="py-4 px-2 text-sm text-center text-gray-600 dark:text-gray-400">
                          {formatDate(manufacturer.addeddate)}
                        </td>
                      )}
                      {selectedColumns.includes('actions') && (
                        <td className="py-4 px-2">
                          {getActionButtons(manufacturer)}
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Bottom Pagination */}
      {shouldShowPagination && (
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {pagination.pageSize === 1000 ? (
              `Showing all ${pagination.count} results`
            ) : (
              <>
                Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.count)} of{' '}
                {pagination.count} results
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={!pagination.previous}
            >
              Previous
            </Button>
            
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={!pagination.next}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Debug Info - Only show in development */}
      {/* Removed as per edit hint */}

      {/* Manufacturer Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ManufacturerForm
            manufacturer={editingManufacturer}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingManufacturer(null);
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetManufacturers; 