import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  FolderTree,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  X
} from 'lucide-react';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Card from '../../components/ui/card';
import AssetCategoryForm from '../../components/forms/AssetCategoryForm';
import { useAssetCategories } from '../../hooks/useAssetCategories';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-toastify';
import { exportToPDF } from '../../utils/pdfExport';

const AssetCategory = () => {
  const {
    assetCategories,
    loading,
    error,
    pagination,
    searchAssetCategories,
    createAssetCategory,
    updateAssetCategory,
    deleteAssetCategory,
    updateOrdering,
    changePage,
    changePageSize,
    refresh,
    shouldShowPagination,
  } = useAssetCategories();

  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'addeddate', direction: 'desc' });
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedColumns, setSelectedColumns] = useState(['checkbox', 'srno', 'categoryname', 'description', 'actions']);
  const [selectedAssetCategories, setSelectedAssetCategories] = useState([]);
  
  // Update search and ordering when they change
  useEffect(() => {
    const ordering = sortConfig.key ? (sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key) : '-addeddate';
    searchAssetCategories(debouncedSearchTerm);
    updateOrdering(ordering);
  }, [debouncedSearchTerm, sortConfig, searchAssetCategories, updateOrdering]);
  
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [editingAssetCategory, setEditingAssetCategory] = useState(null);
  const [showAssetCategoryForm, setShowAssetCategoryForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle sorting
  const handleSort = (sortConfig) => {
    setSortConfig(sortConfig);
  };

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
    console.log('🗑️ AssetCategory: handleDelete called with ID:', id);
    if (window.confirm('Are you sure you want to delete this asset category?')) {
      console.log('✅ User confirmed deletion');
      setDeletingId(id);
      try {
        console.log('🔄 Calling deleteAssetCategory...');
        await deleteAssetCategory(id);
        console.log('✅ Delete completed successfully');
      } catch (error) {
        console.error('❌ Delete failed:', error);
      } finally {
        setDeletingId(null);
        console.log('🧹 Cleaned up deletingId state');
      }
    } else {
      console.log('❌ User cancelled deletion');
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingAssetCategory) {
        // Update existing asset category
        await updateAssetCategory(editingAssetCategory.assetcategoryid, formData);
      } else {
        // Create new asset category
        await createAssetCategory(formData);
      }
      
      // Close form and reset state
      setShowAssetCategoryForm(false);
      setEditingAssetCategory(null);
      setFormLoading(false);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Don't show error toast for duplicate asset categories (already shown in useAssetCategories)
      if (error.message !== 'DUPLICATE_ASSET_CATEGORY') {
        toast.error('Failed to save asset category. Please try again.');
      }
      
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowAssetCategoryForm(false);
    setEditingAssetCategory(null);
    setFormLoading(false);
  };

  // Handle add new asset category
  const handleAddAssetCategory = () => {
    setEditingAssetCategory(null);
    setShowAssetCategoryForm(true);
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const currentData = searchTerm ? filteredAssetCategories : assetCategories;
    if (selectedAssetCategories.length === currentData.length) {
      setSelectedAssetCategories([]);
    } else {
      setSelectedAssetCategories(currentData.map(a => a.assetcategoryid));
    }
  };

  // Handle individual checkbox selection
  const handleSelectAssetCategory = (assetCategoryId) => {
    setSelectedAssetCategories(prev => 
      prev.includes(assetCategoryId)
        ? prev.filter(id => id !== assetCategoryId)
        : [...prev, assetCategoryId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedAssetCategories.length === 0) return;
    
    const confirmMessage = selectedAssetCategories.length === 1 
      ? 'Are you sure you want to delete this asset category?'
      : `Are you sure you want to delete ${selectedAssetCategories.length} asset categories?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Store count before deletion for toast message
        const deletedCount = selectedAssetCategories.length;
        
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
          // Delete each selected asset category
          await Promise.all(
            selectedAssetCategories.map(id => deleteAssetCategory(id))
          );
          
          // Restore original toast functions
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          
          // Clear selection after successful deletion
          setSelectedAssetCategories([]);
          
          // Show single toast with count
          toast.success(`${deletedCount} asset categor${deletedCount !== 1 ? 'ies' : 'y'} deleted successfully!`);
        } catch (deleteError) {
          // Restore original toast functions in case of error
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          throw deleteError;
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete selected asset categories');
      }
    }
  };

  // Client-side search fallback for comprehensive search
  const [filteredAssetCategories, setFilteredAssetCategories] = useState([]);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAssetCategories(assetCategories);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = assetCategories.filter(assetCategory => {
      // Search across all relevant fields
      const searchableFields = [
        assetCategory.categoryname,
        assetCategory.description,
        assetCategory.addeddate
      ];

      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredAssetCategories(filtered);
  }, [assetCategories, searchTerm]);

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    // Don't allow toggling required columns
    if (columnKey === 'checkbox' || columnKey === 'srno' || columnKey === 'categoryname') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Handle export to Excel or PDF
  const handleExport = (type) => {
    if (!assetCategories || assetCategories.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      if (type === 'excel') {
        exportToExcel();
      } else if (type === 'pdf') {
        handleExportToPDF();
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
        categoryname: 'Asset Category Name',
        description: 'Description',
        addeddate: 'Added Date'
      };

      const headers = selectedColumns
        .filter(col => col !== 'actions' && col !== 'checkbox')
        .map(col => columnMap[col] || col);

      const csvContent = [
        headers.join(','),
        ...assetCategories.map((assetCategory, index) => {
          const row = [];
          selectedColumns.forEach(col => {
            if (col === 'srno') {
              row.push(index + 1);
            } else if (col === 'categoryname') {
              row.push(`"${assetCategory.categoryname || ''}"`);
            } else if (col === 'description') {
              row.push(`"${assetCategory.description || ''}"`);
            } else if (col === 'addeddate') {
              row.push(assetCategory.addeddate ? formatDate(assetCategory.addeddate) : 'N/A');
            }
          });
          return row.join(',');
        })
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `asset_categories_${new Date().toISOString().split('T')[0]}.csv`);
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
  const handleExportToPDF = () => {
    try {
      // Check if we have data to export
      if (!assetCategories || assetCategories.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Define columns for PDF export
      const columns = [
        { key: 'srno', header: 'Sr No' },
        { key: 'categoryname', header: 'Category Name' },
        { key: 'description', header: 'Description' },
        { key: 'addeddate', header: 'Added Date' }
      ];

      // Prepare data with proper rendering
      const exportData = assetCategories.map((assetCategory, index) => {
        return {
          srno: index + 1,
          categoryname: assetCategory.categoryname || 'N/A',
          description: assetCategory.description || 'No description',
          addeddate: assetCategory.addeddate ? formatDate(assetCategory.addeddate) : 'N/A'
        };
      });

      // Call the imported exportToPDF function with correct parameters
      const result = exportToPDF({
        data: exportData,
        columns: columns,
        title: 'Asset Categories Report',
        filename: `asset_categories_report_${new Date().toISOString().split('T')[0]}.pdf`,
        onSuccess: (filename) => {
          toast.success('PDF export completed successfully!');
        },
        onError: (error) => {
          console.error('PDF export error:', error);
          toast.error(`Failed to export to PDF: ${error}`);
        }
      });

      // Handle the result if needed
      if (!result.success) {
        console.error('PDF export failed:', result.error);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export to PDF');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  // Get action buttons
  const getActionButtons = (assetCategory) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setEditingAssetCategory(assetCategory);
          setShowAssetCategoryForm(true);
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
        onClick={() => handleDelete(assetCategory.assetcategoryid)}
        disabled={loading || deletingId === assetCategory.assetcategoryid}
        className="p-2"
        title="Delete"
      >
        {deletingId === assetCategory.assetcategoryid ? (
          <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 text-red-600" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          icon={Plus}
          size="lg"
          onClick={handleAddAssetCategory}
        >
          Add Asset Category
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
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
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Select</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sr No</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Category Name</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('description')}
                        onChange={() => toggleColumn('description')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Description</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('actions')}
                        onChange={() => toggleColumn('actions')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
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
              
              {showPageSizeMenu && (
                <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {[10, 20, 50, 1000].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          changePageSize(size);
                          setShowPageSizeMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                          pagination.pageSize === size ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{size === 1000 ? 'All' : `${size} per page`}</span>
                        {pagination.pageSize === size && <span className="text-blue-600">✓</span>}
                      </button>
                    ))}
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
              placeholder="Search asset categories..."
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
      {selectedAssetCategories.length > 0 && (
        <div className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {selectedAssetCategories.length} asset categor{selectedAssetCategories.length !== 1 ? 'ies' : 'y'} selected
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
              onClick={() => setSelectedAssetCategories([])}
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

      {/* Asset Categories Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading asset categories...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 text-red-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Asset Categories
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button variant="primary" onClick={refresh}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (searchTerm ? filteredAssetCategories : assetCategories).length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Asset Categories Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first asset category'
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
                        checked={selectedAssetCategories.length > 0 && selectedAssetCategories.length === (searchTerm ? filteredAssetCategories : assetCategories).length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                    </th>
                  )}
                  {selectedColumns.includes('srno') && (
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300">Sr No</th>
                  )}
                  {selectedColumns.includes('categoryname') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'categoryname', direction: sortConfig.key === 'categoryname' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Category Name</span>
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
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300">Description</th>
                  )}
                  {selectedColumns.includes('actions') && (
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {(searchTerm ? filteredAssetCategories : assetCategories).map((assetCategory, index) => (
                    <motion.tr
                      key={assetCategory.assetcategoryid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      {selectedColumns.includes('checkbox') && (
                        <td className="py-4 px-2">
                          <input
                            type="checkbox"
                            checked={selectedAssetCategories.includes(assetCategory.assetcategoryid)}
                            onChange={() => handleSelectAssetCategory(assetCategory.assetcategoryid)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                          />
                        </td>
                      )}
                      {selectedColumns.includes('srno') && (
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {((pagination.currentPage - 1) * pagination.pageSize) + index + 1}
                        </td>
                      )}
                      {selectedColumns.includes('categoryname') && (
                        <td className="py-4 px-2 text-sm font-medium text-gray-900 dark:text-white">
                          {assetCategory.categoryname}
                        </td>
                      )}
                      {selectedColumns.includes('description') && (
                        <td className="py-4 px-2 max-w-xs">
                          <div className="truncate text-sm text-gray-900 dark:text-white" title={assetCategory.description}>
                            {assetCategory.description || 'No description'}
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('actions') && (
                        <td className="py-4 px-2">
                          {getActionButtons(assetCategory)}
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

      {/* Asset Category Form Modal */}
      <AnimatePresence>
        {showAssetCategoryForm && (
          <AssetCategoryForm
            assetCategory={editingAssetCategory}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetCategory;

