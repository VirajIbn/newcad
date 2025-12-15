import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  Tag,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  X
} from 'lucide-react';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table } from '../../components/ui/table';
import { SortableTable, SortableTableHead } from '../../components/ui/sortable-table';
import Card from '../../components/ui/card';
import AssetTypeForm from '../../components/forms/AssetTypeForm';
import { useAssetTypes } from '../../hooks/useAssetTypes';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-toastify';
import { exportAssetTypesToPDF } from '../../utils/pdfExport';

const AssetTypes = () => {
  const {
    assetTypes,
    loading,
    error,
    pagination,
    searchAssetTypes,
    createAssetType,
    updateAssetType,
    deleteAssetType,
    updateOrdering,
    changePage,
    changePageSize,
    refresh,
    shouldShowPagination,
  } = useAssetTypes();

  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'addeddate', direction: 'desc' });
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedColumns, setSelectedColumns] = useState(['checkbox', 'srno', 'assettypename', 'categoryname', 'assettypeprefix', 'description', 'assetdepreciationrate', 'actions']);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);
  
  // Update search and ordering when they change
  useEffect(() => {
    const ordering = sortConfig.key ? (sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key) : '-addeddate';
    searchAssetTypes(debouncedSearchTerm);
    updateOrdering(ordering);
  }, [debouncedSearchTerm, sortConfig, searchAssetTypes, updateOrdering]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState(null);
  const [showAssetTypeForm, setShowAssetTypeForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const columnSelectorRef = useRef(null);

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
    { key: 'srno', label: 'Sr No', required: true },
    { key: 'assettypename', label: 'Asset Type Name', required: true },
    { key: 'categoryname', label: 'Asset Category', required: false },
    { key: 'assettypeprefix', label: 'Prefix', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'assetdepreciationrate', label: 'Depreciation Rate', required: false },
    { key: 'addeddate', label: 'Added Date', required: false },
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

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset type?')) {
      setDeletingId(id);
      try {
        await deleteAssetType(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingAssetType) {
        // Update existing asset type
        await updateAssetType(editingAssetType.assettypeid, formData);
      } else {
        // Create new asset type
        await createAssetType(formData);
      }
      
      // Close form and reset state
      setShowAssetTypeForm(false);
      setEditingAssetType(null);
      setFormLoading(false);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Don't show error toast for duplicate asset types (already shown in useAssetTypes)
      if (error.message !== 'DUPLICATE_ASSET_TYPE') {
        toast.error('Failed to save asset type. Please try again.');
      }
      
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowAssetTypeForm(false);
    setEditingAssetType(null);
    setFormLoading(false);
  };

  // Handle add new asset type
  const handleAddAssetType = () => {
    setEditingAssetType(null);
    setShowAssetTypeForm(true);
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const currentData = searchTerm ? filteredAssetTypes : assetTypes;
    if (selectedAssetTypes.length === currentData.length) {
      setSelectedAssetTypes([]);
    } else {
      setSelectedAssetTypes(currentData.map(a => a.assettypeid));
    }
  };

  // Handle individual checkbox selection
  const handleSelectAssetType = (assetTypeId) => {
    setSelectedAssetTypes(prev => 
      prev.includes(assetTypeId)
        ? prev.filter(id => id !== assetTypeId)
        : [...prev, assetTypeId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedAssetTypes.length === 0) return;
    
    const confirmMessage = selectedAssetTypes.length === 1 
      ? 'Are you sure you want to delete this asset type?'
      : `Are you sure you want to delete ${selectedAssetTypes.length} asset types?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Store count before deletion for toast message
        const deletedCount = selectedAssetTypes.length;
        
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
          // Delete each selected asset type
          await Promise.all(
            selectedAssetTypes.map(id => deleteAssetType(id))
          );
          
          // Restore original toast functions
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          
          // Clear selection after successful deletion
          setSelectedAssetTypes([]);
          
          // Show single toast with count
          toast.success(`${deletedCount} asset type${deletedCount !== 1 ? 's' : ''} deleted successfully!`);
        } catch (deleteError) {
          // Restore original toast functions in case of error
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          throw deleteError;
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete selected asset types');
      }
    }
  };

  // Client-side search fallback for comprehensive search
  const [filteredAssetTypes, setFilteredAssetTypes] = useState([]);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAssetTypes(assetTypes);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = assetTypes.filter(assetType => {
      // Search across all relevant fields
      const searchableFields = [
        assetType.assettypename,
        assetType.categoryname,
        assetType.assetcategory_name,
        assetType.description,
        assetType.assettypeprefix,
        assetType.assetdepreciationrate?.toString(),
        assetType.addeddate
      ];

      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredAssetTypes(filtered);
  }, [assetTypes, searchTerm]);

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    // Don't allow toggling required columns
    if (columnKey === 'checkbox' || columnKey === 'srno' || columnKey === 'assettypename' || columnKey === 'assettypeprefix') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow removing the last non-required column
        const nonRequiredColumns = prev.filter(col => col !== 'srno' && col !== 'assettypename' && col !== 'assettypeprefix');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev;
        }
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Handle export to Excel or PDF
  const handleExport = (type) => {
    if (!assetTypes || assetTypes.length === 0) {
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
        assettypename: 'Asset Type Name',
        categoryname: 'Asset Category',
        description: 'Description',
        assettypeprefix: 'Prefix',
        assetdepreciationrate: 'Depreciation Rate',
        addeddate: 'Added Date'
      };

      const headers = selectedColumns
        .filter(col => col !== 'actions') // Don't export actions column
        .map(col => columnMap[col] || col);

      const csvContent = [
        headers.join(','),
        ...assetTypes.map((assetType, index) => {
          const row = [];
          selectedColumns.forEach(col => {
            if (col === 'srno') {
              row.push(index + 1);
            } else if (col === 'assettypename') {
              row.push(`"${assetType.assettypename || ''}"`);
            } else if (col === 'categoryname') {
              row.push(`"${assetType.categoryname || 'N/A'}"`);
            } else if (col === 'description') {
              row.push(`"${assetType.description || ''}"`);
            } else if (col === 'assettypeprefix') {
              row.push(`"${assetType.assettypeprefix || ''}"`);
            } else if (col === 'assetdepreciationrate') {
              row.push(assetType.assetdepreciationrate || 'N/A');
            } else if (col === 'addeddate') {
              row.push(assetType.addeddate ? formatDate(assetType.addeddate) : 'N/A');
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
      link.setAttribute('download', `asset_types_${new Date().toISOString().split('T')[0]}.csv`);
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
    exportAssetTypesToPDF({
      assetTypes,
      selectedColumns,
      pagination: { currentPage: pagination.currentPage, pageSize: pagination.pageSize },
      formatDate,
      onSuccess: (filename) => {
        toast.success('PDF export completed successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to export to PDF: ${error}`);
      }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    return `${day}-${month}-${year}`;
  };



  // Get action buttons
  const getActionButtons = (assetType) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setEditingAssetType(assetType);
          setShowAssetTypeForm(true);
        }}
        disabled={loading}
        className="p-2"
        title="Edit"
      >
        <Edit className="w-4 h-4 text-green-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(assetType.assettypeid)}
        disabled={loading || deletingId === assetType.assettypeid}
        className="p-2"
        title="Delete"
      >
        {deletingId === assetType.assettypeid ? (
          <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 text-red-600" />
        )}
      </Button>
    </div>
  );



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
          onClick={handleAddAssetType}
        >
          Add Asset Type
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
                      <span className="text-sm text-gray-700 dark:text-gray-300">Asset Type Name</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('categoryname')}
                        onChange={() => toggleColumn('categoryname')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Asset Category</span>
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
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Prefix</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('assetdepreciationrate')}
                        onChange={() => toggleColumn('assetdepreciationrate')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Depreciation Rate</span>
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
            placeholder="Search asset types by name, category, description, prefix..."
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
      {selectedAssetTypes.length > 0 && (
        <div className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {selectedAssetTypes.length} asset type{selectedAssetTypes.length !== 1 ? 's' : ''} selected
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
              onClick={() => setSelectedAssetTypes([])}
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

      {/* Asset Types Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading asset types...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 text-red-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Asset Types
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button variant="primary" onClick={refresh}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (searchTerm ? filteredAssetTypes : assetTypes).length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Asset Types Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first asset type'
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
                        checked={selectedAssetTypes.length > 0 && selectedAssetTypes.length === (searchTerm ? filteredAssetTypes : assetTypes).length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                  )}
                  {selectedColumns.includes('srno') && (
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300">Sr No</th>
                  )}
                  {selectedColumns.includes('assettypename') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'assettypename', direction: sortConfig.key === 'assettypename' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Asset Type Name</span>
                        {sortConfig.key === 'assettypename' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('categoryname') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'categoryname', direction: sortConfig.key === 'categoryname' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Asset Category</span>
                        {sortConfig.key === 'categoryname' ? (
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
                  {selectedColumns.includes('assettypeprefix') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'assettypeprefix', direction: sortConfig.key === 'assettypeprefix' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Prefix</span>
                        {sortConfig.key === 'assettypeprefix' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('assetdepreciationrate') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'assetdepreciationrate', direction: sortConfig.key === 'assetdepreciationrate' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Depreciation Rate</span>
                        {sortConfig.key === 'assetdepreciationrate' ? (
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
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'addeddate', direction: sortConfig.key === 'addeddate' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
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
                  {(searchTerm ? filteredAssetTypes : assetTypes).map((assetType, index) => (
                    <motion.tr
                      key={assetType.assettypeid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      {selectedColumns.includes('checkbox') && (
                        <td className="py-4 px-2">
                          <input
                            type="checkbox"
                            checked={selectedAssetTypes.includes(assetType.assettypeid)}
                            onChange={() => handleSelectAssetType(assetType.assettypeid)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                      )}
                      {selectedColumns.includes('srno') && (
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {((pagination.currentPage - 1) * pagination.pageSize) + index + 1}
                        </td>
                      )}
                      {selectedColumns.includes('assettypename') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white">
                          {assetType.assettypename}
                        </td>
                      )}
                      {selectedColumns.includes('categoryname') && (
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {assetType.categoryname || 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('description') && (
                        <td className="py-4 px-2 max-w-xs">
                          <div className="truncate text-sm text-gray-900 dark:text-white" title={assetType.description}>
                            {assetType.description || 'No description'}
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('assettypeprefix') && (
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {assetType.assettypeprefix || 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('assetdepreciationrate') && (
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {assetType.assetdepreciationrate ? `${assetType.assetdepreciationrate}%` : 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('addeddate') && (
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(assetType.addeddate)}
                        </td>
                      )}
                      {selectedColumns.includes('actions') && (
                        <td className="py-4 px-2">
                          {getActionButtons(assetType)}
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

      {/* Asset Type Form Modal */}
      <AnimatePresence>
        {showAssetTypeForm && (
          <AssetTypeForm
            assetType={editingAssetType}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetTypes; 