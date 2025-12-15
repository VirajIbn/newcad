import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Download, RefreshCw, Truck, ChevronDown, ChevronUp, ChevronsUpDown, X } from 'lucide-react';
import { useVendors, useCountries, useStates, useCities } from '../../hooks';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table } from '../../components/ui/table';
import { SortableTable, SortableTableHead, debugDataFields } from '../../components/ui/sortable-table';
import VendorForm from '../../components/forms/VendorForm';
import { VendorDetailsModal } from '../../components/modals';
import { formatDate as formatDateUtil } from '../../utils/formatDate';

const AssetVendors = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(['checkbox', 'srno', 'vendorname', 'contactperson', 'gstno', 'email', 'mobilenumber', 'addeddate', 'addedby', 'actions']);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'addeddate', direction: 'desc' });

  // Custom hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { user } = useAuth();
  const { countries, loading: countriesLoading, error: countriesError, fetchActiveCountries } = useCountries();
  const { 
    states, 
    loading: statesLoading, 
    error: statesError, 
    fetchStatesByCountry, 
    clearStates 
  } = useStates();
  const { 
    cities, 
    loading: citiesLoading, 
    error: citiesError, 
    fetchCitiesByState, 
    clearCities 
  } = useCities();
  const {
    vendors,
    loading,
    pagination,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
    totalPages,
    updateParams,
    refresh
  } = useVendors({
    page: 1,
    page_size: 10,
    ordering: sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key
  });

  // Update parameters when sortConfig or search term changes
  useEffect(() => {
    const ordering = sortConfig.key ? (sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key) : '-addeddate';
    updateParams({ 
      ordering, 
      search: debouncedSearchTerm, 
      page: 1 
    });
  }, [sortConfig, debouncedSearchTerm, updateParams]);

  // Client-side search fallback for comprehensive search
  const [filteredVendors, setFilteredVendors] = useState([]);
  
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredVendors(vendors);
      return;
    }

    const searchTerm = debouncedSearchTerm.toLowerCase();
    const filtered = vendors.filter(vendor => {
      // Search across all relevant fields
      const searchableFields = [
        vendor.vendorname,
        vendor.contactperson,
        vendor.gstno,
        vendor.email,
        vendor.mobilenumber,
        vendor.address,
        vendor.cityname,
        vendor.statename,
        vendor.zip,
        vendor.description
      ];

      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTerm)
      );
    });

    setFilteredVendors(filtered);
  }, [vendors, debouncedSearchTerm]);

  // Debug: Log vendors data structure when it changes
  useEffect(() => {
    if (vendors && vendors.length > 0) {
      // Vendors data structure logging removed for production
    }
  }, [vendors]);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.export-button-container')) {
        setShowExportMenu(false);
      }
      if (!event.target.closest('.page-size-button-container')) {
        setShowPageSizeMenu(false);
      }
      if (!event.target.closest('.column-selector-button-container')) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handlers
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    updateParams({ search: value, page: 1 });
  }, [updateParams]);

  // Handle sorting from SortableTable
  const handleSort = useCallback((sortConfig) => {
    setSortConfig(sortConfig);
    
    // Debug: Check what fields are available in vendors data
    if (vendors && vendors.length > 0) {
      debugDataFields(vendors);
    }
  }, [vendors]);

  const handleCreateVendor = useCallback(async (data) => {
    try {
      await createVendor(data);
      setShowForm(false);
    } catch (error) {
      console.error('❌ AssetVendors: handleCreateVendor error:', error);
      
      // Don't show error toast for duplicate vendors (already shown in useVendors)
      if (error.message !== 'DUPLICATE_VENDOR') {
        toast.error('Failed to create vendor. Please try again.');
      }
      
      throw error;
    }
  }, [createVendor]);

  const handleUpdateVendor = useCallback(async (data) => {
    try {
      await updateVendor(editingVendor.assetvendorid, data);
      setShowForm(false);
      setEditingVendor(null);
    } catch (error) {
      toast.error('Failed to update vendor. Please try again.');
      throw error;
    }
  }, [updateVendor, editingVendor]);

  const handleDeleteVendor = useCallback(async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setDeletingId(vendorId);
      try {
        await deleteVendor(vendorId, user?.id);
        // Success toast is already handled in the useVendors hook
      } catch (error) {
        toast.error('Failed to delete vendor. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  }, [deleteVendor, user?.id]);

  const handleEditVendor = useCallback(async (vendor) => {
    await fetchActiveCountries();
    setEditingVendor(vendor);
    setShowForm(true);
  }, [fetchActiveCountries]);

  const handleViewVendor = useCallback((vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  }, []);

  const handleAddVendor = useCallback(async () => {
    await fetchActiveCountries();
    setEditingVendor(null);
    setShowForm(true);
  }, [fetchActiveCountries]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingVendor(null);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedVendor(null);
  }, []);

  // Handle select all/none
  const handleSelectAll = () => {
    const currentData = debouncedSearchTerm ? filteredVendors : vendors;
    if (selectedVendors.length === currentData.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(currentData.map(v => v.assetvendorid));
    }
  };

  // Handle individual checkbox selection
  const handleSelectVendor = (vendorId) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedVendors.length === 0) return;
    
    const confirmMessage = selectedVendors.length === 1 
      ? 'Are you sure you want to delete this vendor?'
      : `Are you sure you want to delete ${selectedVendors.length} vendors?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Store count before deletion for toast message
        const deletedCount = selectedVendors.length;
        
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
          // Delete each selected vendor
          await Promise.all(
            selectedVendors.map(id => deleteVendor(id, user?.id))
          );
          
          // Restore original toast functions
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          
          // Clear selection after successful deletion
          setSelectedVendors([]);
          
          // Show single toast with count
          toast.success(`${deletedCount} vendor${deletedCount !== 1 ? 's' : ''} deleted successfully!`);
        } catch (deleteError) {
          // Restore original toast functions in case of error
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          throw deleteError;
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete selected vendors');
      }
    }
  };


  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    // Don't allow toggling required columns
    if (columnKey === 'checkbox' || columnKey === 'srno' || columnKey === 'vendorname') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow removing the last non-required column
        const nonRequiredColumns = prev.filter(col => col !== 'srno' && col !== 'vendorname');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev;
        }
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Export functionality
  const handleExport = (type) => {
    if (!vendors || vendors.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      if (type === 'excel') {
        exportToExcel();
      } else if (type === 'pdf') {
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
      // Create CSV content
      const headers = [
        'Sr No',
        'Vendor Name',
        'Contact Person',
        'GST Number',
        'Email',
        'Mobile Number',
        'Address',
        'City',
        'State',
        'ZIP Code',
        'Added Date',
        'Added By',
        'Organization ID',
        'Description'
      ];

      const csvContent = [
        headers.join(','),
        ...vendors.map((vendor, index) => {
          const addedBy = vendor.addedby_display ||
            [vendor.addedby_firstname, vendor.addedby_lastname].filter(Boolean).join(' ').trim() ||
            vendor.addedby_name ||
            vendor.addedby ||
            'N/A';

          const row = [
            ((pagination.currentPage - 1) * (pagination.pageSize === 1000 ? 0 : pagination.pageSize)) + index + 1,
            `"${vendor.vendorname || ''}"`,
            `"${vendor.contactperson || ''}"`,
            `"${vendor.gstno || ''}"`,
            `"${vendor.email || ''}"`,
            `"${vendor.mobilenumber || ''}"`,
            `"${vendor.address || ''}"`,
            `"${vendor.cityname || ''}"`,
            `"${vendor.statename || ''}"`,
            `"${vendor.zip || ''}"`,
            vendor.addeddate ? formatDate(vendor.addeddate) : 'N/A',
            `"${addedBy}"`,
            `"${vendor.orgid || 'N/A'}"`,
            `"${vendor.description || ''}"`
          ];
          return row.join(',');
        })
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `vendors_${new Date().toISOString().split('T')[0]}.csv`);
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
    try {
      // Import the PDF export utility dynamically
      import('../../utils/pdfExport').then(({ exportToPDF: exportToPDFUtil }) => {
        const columns = [
          { key: 'srno', header: 'Sr No' },
          { key: 'vendorname', header: 'Vendor Name' },
          { key: 'contactperson', header: 'Contact Person' },
          { key: 'gstno', header: 'GST Number' },
          { key: 'email', header: 'Email' },
          { key: 'mobilenumber', header: 'Mobile' },
          { key: 'addeddate', header: 'Added Date' },
          { key: 'addedby', header: 'Added By' },
          { key: 'orgid', header: 'Org ID' }
        ];

        const data = vendors.map((vendor, index) => ({
          srno: ((pagination.currentPage - 1) * (pagination.pageSize === 1000 ? 0 : pagination.pageSize)) + index + 1,
          vendorname: vendor.vendorname || 'N/A',
          contactperson: vendor.contactperson || 'N/A',
          gstno: vendor.gstno || 'N/A',
          email: vendor.email || 'N/A',
          mobilenumber: vendor.mobilenumber || 'N/A',
          addeddate: vendor.addeddate ? formatDate(vendor.addeddate) : 'N/A',
          addedby: vendor.addedby_name || `User ID: ${vendor.addedby || 'N/A'}`,
          orgid: vendor.orgid || 'N/A'
        }));

        exportToPDFUtil({
          data,
          columns,
          title: 'Asset Vendors Report',
          filename: `vendors_${new Date().toISOString().split('T')[0]}.pdf`,
          onSuccess: (filename) => {
            toast.success('PDF export completed successfully!');
          },
          onError: (error) => {
            toast.error(`Failed to export to PDF: ${error}`);
          }
        });
      }).catch(error => {
        console.error('PDF export error:', error);
        toast.error('Failed to export to PDF');
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export to PDF');
    }
  };



  // Format date using centralized utility
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDateUtil(dateString);
  };

  // Get action buttons
  const getActionButtons = (vendor) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditVendor(vendor)}
        disabled={loading}
        className="p-2"
        title="Edit"
      >
        <Edit className="w-4 h-4 text-green-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteVendor(vendor.assetvendorid)}
        disabled={loading || deletingId === vendor.assetvendorid}
        className="p-2"
        title="Delete"
      >
        {deletingId === vendor.assetvendorid ? (
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
          size="lg"
          onClick={handleAddVendor}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
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
                      <span className="text-sm text-gray-700 dark:text-gray-300">Vendor Name</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('contactperson')}
                        onChange={() => toggleColumn('contactperson')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Contact Person</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('gstno')}
                        onChange={() => toggleColumn('gstno')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">GST Number</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('email')}
                        onChange={() => toggleColumn('email')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('mobilenumber')}
                        onChange={() => toggleColumn('mobilenumber')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mobile Number</span>
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
                        checked={selectedColumns.includes('addedby')}
                        onChange={() => toggleColumn('addedby')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Added By</span>
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
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="relative export-button-container flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-4 h-4 ml-2" />
              
              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
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



            {/* Removed Clear Sort button */}
          </div>

          {/* Right: Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search vendors by name, contact person, GST number, email, mobile, address, city, state..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 w-80"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selected Items Indicator */}
      {selectedVendors.length > 0 && (
        <div className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''} selected
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
              onClick={() => setSelectedVendors([])}
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Top Pagination */}
      {pagination.totalPages > 1 && (
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
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={!hasPreviousPage}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={!hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Vendors Table */}
      <Card className="overflow-hidden">
        {loading && vendors.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading vendors...</span>
          </div>
        ) : (debouncedSearchTerm ? filteredVendors : vendors).length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Vendors Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Get started by adding your first vendor'
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
                        checked={selectedVendors.length > 0 && selectedVendors.length === (debouncedSearchTerm ? filteredVendors : vendors).length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                  )}
                  {selectedColumns.includes('srno') && (
                    <th className="h-10 px-2 text-center align-middle font-medium text-gray-700 dark:text-gray-300">Sr No</th>
                  )}
                  {selectedColumns.includes('vendorname') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'vendorname', direction: sortConfig.key === 'vendorname' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Vendor Name</span>
                        {sortConfig.key === 'vendorname' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('contactperson') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'contactperson', direction: sortConfig.key === 'contactperson' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Contact Person</span>
                        {sortConfig.key === 'contactperson' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('gstno') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'gstno', direction: sortConfig.key === 'gstno' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>GST Number</span>
                        {sortConfig.key === 'gstno' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('email') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'email', direction: sortConfig.key === 'email' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        {sortConfig.key === 'email' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 text-blue-600" /> : 
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  )}
                  {selectedColumns.includes('mobilenumber') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'mobilenumber', direction: sortConfig.key === 'mobilenumber' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Mobile</span>
                        {sortConfig.key === 'mobilenumber' ? (
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
                  {selectedColumns.includes('addedby') && (
                    <th 
                      className="h-10 px-2 text-left align-middle font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort({ key: 'addedby', direction: sortConfig.key === 'addedby' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Added By</span>
                        {sortConfig.key === 'addedby' ? (
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
                  {(debouncedSearchTerm ? filteredVendors : vendors).map((vendor, index) => (
                    <motion.tr
                      key={vendor.assetvendorid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer group transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                      onClick={() => handleViewVendor(vendor)}
                      title="Click to view vendor details"
                    >
                      {selectedColumns.includes('checkbox') && (
                        <td className="py-4 px-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedVendors.includes(vendor.assetvendorid)}
                            onChange={() => handleSelectVendor(vendor.assetvendorid)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                      )}
                      {selectedColumns.includes('srno') && (
                        <td className="py-4 px-2 text-sm text-center text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {((pagination.currentPage - 1) * (pagination.pageSize === 1000 ? 0 : pagination.pageSize)) + index + 1}
                        </td>
                      )}
                      {selectedColumns.includes('vendorname') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          <span>{vendor.vendorname}</span>
                        </td>
                      )}
                      {selectedColumns.includes('contactperson') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {vendor.contactperson || 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('gstno') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {vendor.gstno || 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('email') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {vendor.email || 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('mobilenumber') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {vendor.mobilenumber || 'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('addeddate') && (
                        <td className="py-4 px-2 text-sm text-center text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {formatDate(vendor.addeddate)}
                        </td>
                      )}
                      {selectedColumns.includes('addedby') && (
                        <td className="py-4 px-2 text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {vendor.addedby_display ||
                        [vendor.addedby_firstname, vendor.addedby_lastname].filter(Boolean).join(' ').trim() ||
                        vendor.addedby_name ||
                        vendor.addedby ||
                        'N/A'}
                        </td>
                      )}
                      {selectedColumns.includes('actions') && (
                        <td className="py-4 px-2" onClick={(e) => e.stopPropagation()}>
                          {getActionButtons(vendor)}
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
      {pagination.totalPages > 1 && (
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
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={!hasPreviousPage}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={!hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Vendor Form Modal */}
      <VendorForm
        vendor={editingVendor}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingVendor ? handleUpdateVendor : handleCreateVendor}
        loading={loading}
        countries={countries}
        states={states}
        cities={cities}
        countriesLoading={countriesLoading}
        countriesError={countriesError}
        statesLoading={statesLoading}
        statesError={statesError}
        citiesLoading={citiesLoading}
        citiesError={citiesError}
        onCountryChange={fetchStatesByCountry}
        onStateChange={fetchCitiesByState}
        clearStates={clearStates}
        clearCities={clearCities}
      />

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
      />
    </div>
  );
};

export default AssetVendors; 