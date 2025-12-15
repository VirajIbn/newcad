import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Download, Plus, Edit, Trash2, RefreshCw, ChevronDown, ChevronUp, ChevronsUpDown, X, FileText, Filter, SlidersHorizontal, Upload } from 'lucide-react';
import { useAssetDetails, useAssetTypes, useManufacturers, useVendors, useEmployees, useAssetStatus } from '../../hooks';
import { dropdownAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-toastify';
import { useFinancialYearContext } from '../../context/FinancialYearContext';
import { useAuth } from '../../context/AuthContext';
import { getBaseBackendUrl } from '../../config/backend';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { SortableTable, SortableTableHead } from '../../components/ui/sortable-table';
import AssetDetailsForm from '../../components/forms/AssetDetailsForm';
import { AssetDetailsModal } from '../../components/modals';
import { AssetLogsModal } from '../../components/assets';
import { AssetFilterForm } from '../../components/filters';
import { FinancialYearDropdown } from '../../components/common';
import { formatDate } from '../../utils/formatDate';
import { exportToPDF } from '../../utils/pdfExport';

const AssetDetails = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedAssetForLogs, setSelectedAssetForLogs] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [sortField, setSortField] = useState('addeddate');
  const [sortDirection, setSortDirection] = useState('desc');
  const sortConfig = { key: sortField, direction: sortDirection };
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState([
    'checkbox', 'srno', 'assetnumber', 'model', 'categoryname', 'assettype_name', 'manufacturer_name', 
    'serialnumber', 'assigned_employee_name', 'status', 'purchasedate', 'actions'
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [loadingDropdownData, setLoadingDropdownData] = useState(false);
  const [showBulkInsertMenu, setShowBulkInsertMenu] = useState(false);

  // Use asset status hook
  const { assetStatuses, loading: statusLoading, error: statusError, refetch: fetchAssetStatuses } = useAssetStatus();
  
  // Financial year context for validation
  const { selectedFinancialYear, loading: financialYearLoading } = useFinancialYearContext();
  
  // Auth context for organization ID
  const { user } = useAuth();
  
  const [assetConditions, setAssetConditions] = useState([]);
  const [conditionLoading, setConditionLoading] = useState(false);
  const [conditionError, setConditionError] = useState(null);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Hooks
  const {
    assets,
    loading,
    error,
    pagination,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    searchAssets,
    refresh,
    changePage,
    changePageSize,
    shouldShowPagination
  } = useAssetDetails();

  const {
    assetTypes,
    loading: assetTypesLoading,
    error: assetTypesError,
    refresh: refreshAssetTypes
  } = useAssetTypes();

  const {
    manufacturers,
    loading: manufacturersLoading,
    error: manufacturersError,
    refresh: refreshManufacturers
  } = useManufacturers();

  const {
    vendors,
    loading: vendorsLoading,
    error: vendorsError,
    fetchVendors
  } = useVendors();

  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
    fetchEmployees
  } = useEmployees();

  // Load initial data (assets) - wait for financial year to be loaded
  useEffect(() => {
    // Don't fetch assets until we have financial year context loaded
    if (selectedFinancialYear === null) {
      return;
    }

    const params = {
      ordering: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
      ...activeFilters
    };
    
    // Add financial year filter if specific year is selected (not "All Financial Year")
    if (selectedFinancialYear && selectedFinancialYear.id !== 0) {
      params.financialyearid = selectedFinancialYear.id;
    }
    // If selectedFinancialYear.id === 0, it means "All Financial Year" so no filter needed
    
    fetchAssets(params);
  }, [fetchAssets, sortField, sortDirection, activeFilters, selectedFinancialYear]);

  // Listen for financial year changes from MainLayout
  useEffect(() => {
    const handleFinancialYearChange = async (event) => {
      const { selectedYear } = event.detail;
      
      try {
        // Prepare API parameters
        const params = {
          ordering: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
          page: 1, // Reset to first page when FY changes
          page_size: pagination.pageSize,
          ...activeFilters
        };

        // Add financial year filter if specific year is selected
        if (selectedYear && selectedYear.id !== 0) {
          params.financialyearid = selectedYear.id;
        }

        
        // Fetch assets with the new financial year filter
        await fetchAssets(params);
        
      } catch (error) {
        console.error('❌ AssetDetails: Error fetching assets for FY:', error);
        toast.error('Failed to fetch assets for selected financial year');
      }
    };

    // Add event listener
    window.addEventListener('financialYearChanged', handleFinancialYearChange);

    // Cleanup
    return () => {
      window.removeEventListener('financialYearChanged', handleFinancialYearChange);
    };
  }, [fetchAssets, sortField, sortDirection, activeFilters, pagination.pageSize]);

  // Function to load dropdown data when Add Asset button is clicked
  const loadDropdownData = useCallback(async () => {
    setLoadingDropdownData(true);
    setConditionLoading(true);
    setConditionError(null);
    
    try {
      
      // Load asset condition data using authenticated API service
      const conditionData = await dropdownAPI.getAssetCondition();
      setAssetConditions(conditionData);
      
      // Load other dropdown data
      await Promise.all([
        refreshAssetTypes(),
        refreshManufacturers(),
        fetchVendors(),
        fetchEmployees()
      ]);
    } catch (error) {
      console.error('❌ Error loading dropdown data:', error);
      setConditionError(error.message);
      toast.error('Failed to load form data. Please try again.');
    } finally {
      setLoadingDropdownData(false);
      setConditionLoading(false);
    }
  }, [refreshAssetTypes, refreshManufacturers, fetchVendors, fetchEmployees]);

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
      if (!event.target.closest('.bulk-insert-button-container')) {
        setShowBulkInsertMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search - use client-side filtering for comprehensive search
  useEffect(() => {
    const params = {
      ordering: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
      ...activeFilters
    };
    
    // Add financial year filter if specific year is selected (not "All Financial Year")
    if (selectedFinancialYear && selectedFinancialYear.id !== 0) {
      params.financialyearid = selectedFinancialYear.id;
    }
    // If selectedFinancialYear.id === 0, it means "All Financial Year" so no filter needed
    
    // Always fetch all assets first, then filter client-side for comprehensive search
    fetchAssets(params);
  }, [fetchAssets, sortField, sortDirection, activeFilters, selectedFinancialYear]);

  // Client-side search fallback for comprehensive search
  const [filteredAssets, setFilteredAssets] = useState([]);
  
  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim() === '') {
      setFilteredAssets(assets);
      return;
    }

    const searchTerm = debouncedSearchTerm.toLowerCase().trim();
    const filtered = assets.filter(asset => {
      // Search across all relevant fields that are displayed in the grid
      const searchableFields = [
        asset.assetnumber,
        asset.model,
        asset.categoryname,
        asset.assettype_name,
        asset.manufacturer_name,
        asset.vendor_name,
        asset.serialnumber,
        asset.assigned_employee_name,
        asset.storedlocation,
        asset.purchasecost?.toString(),
        asset.currentvalue?.toString(),
        asset.purchasedate,
        asset.warrantyenddate,
        asset.addeddate,
        asset.description,
        asset.notes,
        asset.condition?.toString(),
        asset.warrantystartdate,
        asset.supplier,
        asset.category,
        asset.subcategory,
        // Additional common fields that might be in the data
        asset.assetname,
        asset.assetid,
        asset.tag,
        asset.barcode,
        asset.department,
        asset.division,
        asset.costcenter,
        asset.project,
        asset.room,
        asset.floor,
        asset.building,
        asset.site,
        asset.region,
        asset.country,
        asset.state,
        asset.city,
        asset.zipcode,
        asset.phone,
        asset.email,
        asset.website,
        asset.contactperson,
        asset.contactphone,
        asset.contactemail,
        asset.warrantynumber,
        asset.insurancenumber,
        asset.licensenumber,
        asset.registrationnumber,
        asset.vin,
        asset.enginenumber,
        asset.chassisnumber,
        asset.color,
        asset.size,
        asset.weight,
        asset.dimensions,
        asset.specifications,
        asset.features,
        asset.accessories,
        asset.attachments,
        asset.images,
        asset.documents,
        asset.manual
      ];

      // Also search in status text
      const statusData = assetStatuses.find(s => s.codeid === asset.status);
      if (statusData) {
        searchableFields.push(statusData.codename);
      }

      // Add condition text if available
      if (asset.condition) {
        const conditionText = getConditionText(asset.condition);
        if (conditionText) {
          searchableFields.push(conditionText);
        }
      }

      // Search in all fields
      return searchableFields.some(field => {
        if (!field) return false;
        return field.toString().toLowerCase().includes(searchTerm);
      });
    });

    setFilteredAssets(filtered);
  }, [assets, debouncedSearchTerm, assetStatuses]);

  // Column definitions
  const columnDefinitions = {
    checkbox: { label: '', sortable: false, required: true },
    srno: { label: 'Sr No', sortable: false, required: true },
    assetnumber: { label: 'Asset Number', sortable: true, required: true },
    model: { label: 'Model', sortable: true },
    categoryname: { label: 'Asset Category', sortable: true },
    assettype_name: { label: 'Asset Type', sortable: true },
    manufacturer_name: { label: 'Manufacturer', sortable: true },
    vendor_name: { label: 'Vendor', sortable: true },
    serialnumber: { label: 'Serial No', sortable: true },
    assigned_employee_name: { label: 'Employee/Location', sortable: true },
    storedlocation: { label: 'Location', sortable: true },
    status: { label: 'Status', sortable: true },
    purchasedate: { label: 'Purchase Date', sortable: true },
    warrantyenddate: { label: 'Warranty End', sortable: true },
    addeddate: { label: 'Added Date', sortable: true },
    actions: { label: 'Actions', sortable: false }
  };

  // Define the original column order
  const originalColumnOrder = [
    'checkbox', 'srno', 'assetnumber', 'model', 'categoryname', 'assettype_name', 'manufacturer_name', 
    'vendor_name', 'serialnumber', 'assigned_employee_name', 'status', 
    'purchasedate', 'addeddate', 'actions'
  ];

  // Event handlers
  const handleCreateAsset = useCallback(async (data) => {
    try {
      await createAsset(data);
      setShowForm(false);
    } catch (error) {
      console.error('❌ AssetDetails: handleCreateAsset error:', error);
      
      // Don't show error toast for duplicate assets (already shown in useAssetDetails)
      if (error.message !== 'DUPLICATE_ASSET') {
        toast.error('Failed to create asset. Please try again.');
      }
      
      throw error;
    }
  }, [createAsset]);

  const handleUpdateAsset = useCallback(async (data) => {
    try {
      await updateAsset(editingAsset.assetdetailsid, data);
      setShowForm(false);
      setEditingAsset(null);
    } catch (error) {
      toast.error('Failed to update asset. Please try again.');
      throw error;
    }
  }, [updateAsset, editingAsset]);

  const handleDeleteAsset = useCallback(async (assetId) => {
    // Validate asset ID before proceeding
    if (!assetId || assetId === 0 || assetId === '0') {
      toast.error('Invalid asset ID. Cannot delete this asset.');
      console.error('Invalid asset ID for deletion:', assetId);
      return;
    }

    if (window.confirm('Are you sure you want to delete this asset?')) {
      setDeletingId(assetId);
      try {
        await deleteAsset(assetId);
        // Toast notification is already handled in the deleteAsset hook
      } catch (error) {
        console.error('Delete asset error:', error);
        toast.error('Failed to delete asset. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  }, [deleteAsset]);

  // Handle checkbox selection
  const handleSelectAsset = useCallback((assetId, checked) => {
    if (checked) {
      setSelectedAssetIds(prev => [...prev, assetId]);
    } else {
      setSelectedAssetIds(prev => prev.filter(id => id !== assetId));
    }
  }, []);

  // Handle select all
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const currentAssets = debouncedSearchTerm ? filteredAssets : assets;
      const validAssetIds = currentAssets
        .filter(asset => asset.assetdetailsid && asset.assetdetailsid !== 0 && asset.assetdetailsid !== '0' && asset.isdeleted !== 1)
        .map(asset => asset.assetdetailsid);
      setSelectedAssetIds(validAssetIds);
    } else {
      setSelectedAssetIds([]);
    }
  }, [assets, filteredAssets, debouncedSearchTerm]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedAssetIds.length === 0) {
      toast.warning('Please select at least one asset to delete.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedAssetIds.length} selected asset(s)? This action cannot be undone.`;
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        let successCount = 0;
        let failCount = 0;
        
        // Delete assets one by one
        for (const assetId of selectedAssetIds) {
          try {
            await deleteAsset(assetId);
            successCount++;
          } catch (error) {
            console.error(`Failed to delete asset ${assetId}:`, error);
            failCount++;
          }
        }
        
        // Clear selection
        setSelectedAssetIds([]);
        
        // Show summary toast
        if (successCount > 0 && failCount === 0) {
          toast.success(`Successfully deleted ${successCount} asset(s).`);
        } else if (successCount > 0 && failCount > 0) {
          toast.warning(`Deleted ${successCount} asset(s). Failed to delete ${failCount} asset(s).`);
        } else {
          toast.error('Failed to delete selected assets.');
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('An error occurred during bulk delete.');
      } finally {
        setIsDeleting(false);
      }
    }
  }, [selectedAssetIds, deleteAsset]);

  const handleViewLogs = useCallback((asset) => {
    setSelectedAssetForLogs(asset);
    setShowLogsModal(true);
  }, []);

  const handleViewAsset = useCallback(async (asset) => {
    setSelectedAsset(asset);
    setShowDetailsModal(true);
    
    // Load dropdown data for the modal if conditions not already loaded
    if (assetConditions.length === 0) {
      await loadDropdownData();
    }
  }, [assetConditions.length, loadDropdownData]);

  const handleEditAsset = useCallback((asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingAsset(null);
  }, []);

  const handleSort = useCallback((sortConfig) => {
    setSortField(sortConfig.key);
    setSortDirection(sortConfig.direction);
  }, []);

  // Handle search on key press with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Debounce search - no need to call API, client-side filtering handles it
    window.searchTimeout = setTimeout(() => {
      // Client-side filtering will handle the search automatically
    }, 500);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Client-side filtering will handle the search automatically
    }
  };

  // Handle filter application
  const handleFilter = useCallback((filterParams) => {
    setActiveFilters(filterParams);
  }, []);

  // Handle filter clear
  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  // Handle bulk insert button click
  const handleBulkInsert = useCallback(async () => {
    // Check if "All Financial Year" is selected
    if (selectedFinancialYear && selectedFinancialYear.id === 0) {
      toast.info('Please select specific financial year instead of All.');
      return;
    }
    
    // Construct the bulk insert URL
    const baseUrl = getBaseBackendUrl();
    const bulkInsertUrl = `${baseUrl}/bulk-insert-assets`;
    
    // Open bulk insert page in a new tab
    window.open(bulkInsertUrl, '_blank', 'noopener,noreferrer');
  }, [selectedFinancialYear]);

  // Handle bulk insert menu toggle
  const handleBulkInsertMenuToggle = useCallback(() => {
    setShowBulkInsertMenu(!showBulkInsertMenu);
  }, [showBulkInsertMenu]);

  // Handle bulk insert option selection
  const handleBulkInsertOption = useCallback(async (option) => {
    setShowBulkInsertMenu(false);
    
    // Check if "All Financial Year" is selected
    if (selectedFinancialYear && selectedFinancialYear.id === 0) {
      toast.info('Please select specific financial year instead of All.');
      return;
    }
    
    // Construct the base URL
    const baseUrl = getBaseBackendUrl();
    
    switch (option) {
      case 'bulk-update':
        // Handle bulk update - open in new tab
        const bulkUpdateUrl = `${baseUrl}/bulk-update-assets`;
        window.open(bulkUpdateUrl, '_blank', 'noopener,noreferrer');
        break;
      default:
        // Handle bulk insert - open in new tab
        const bulkInsertUrl = `${baseUrl}/bulk-insert-assets`;
        window.open(bulkInsertUrl, '_blank', 'noopener,noreferrer');
    }
  }, [selectedFinancialYear]);


  // Override changePage to include active filters
  const handleChangePage = useCallback((page) => {
    const params = {
      page,
      page_size: pagination.pageSize,
      ordering: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
      ...activeFilters
    };
    
    // Add financial year filter if specific year is selected (not "All Financial Year")
    if (selectedFinancialYear && selectedFinancialYear.id !== 0) {
      params.financialyearid = selectedFinancialYear.id;
    }
    // If selectedFinancialYear.id === 0, it means "All Financial Year" so no filter needed
    
    fetchAssets(params);
  }, [fetchAssets, pagination.pageSize, sortField, sortDirection, activeFilters, selectedFinancialYear]);

  // Override changePageSize to include active filters
  const handleChangePageSize = useCallback((newPageSize) => {
    const params = {
      page: 1,
      page_size: newPageSize,
      ordering: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
      ...activeFilters
    };
    
    // Add financial year filter if specific year is selected (not "All Financial Year")
    if (selectedFinancialYear && selectedFinancialYear.id !== 0) {
      params.financialyearid = selectedFinancialYear.id;
    }
    // If selectedFinancialYear.id === 0, it means "All Financial Year" so no filter needed
    
    fetchAssets(params);
  }, [fetchAssets, sortField, sortDirection, activeFilters, selectedFinancialYear]);



  const toggleColumn = useCallback((columnKey) => {
    // Don't allow toggling required columns
    if (columnKey === 'checkbox' || columnKey === 'srno' || columnKey === 'assetnumber') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow removing the last non-required column
        const nonRequiredColumns = prev.filter(col => col !== 'checkbox' && col !== 'srno' && col !== 'assetnumber');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev;
        }
        return prev.filter(col => col !== columnKey);
      } else {
        // Add the column back in its original position
        const filteredPrev = prev.filter(col => col !== columnKey);
        const newColumns = [];
        
        // Add columns in their original order
        for (const col of originalColumnOrder) {
          if (filteredPrev.includes(col) || col === columnKey) {
            newColumns.push(col);
          }
        }
        
        return newColumns;
      }
    });
  }, []);

  // Export functionality
  const handleExport = (type) => {
    if (!assets || assets.length === 0) {
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
      // Create CSV content
      const headers = [
        'Sr No',
        'Asset Number',
        'Model',
        'Asset Category',
        'Asset Type',
        'Manufacturer',
        'Vendor',
        'Serial Number',
        'Purchase Cost',
        'Current Value',
        'Assigned To',
        'Location',
        'Status',
        'Purchase Date',
        'Warranty End Date',
        'Added Date'
      ];

      const csvContent = [
        headers.join(','),
        ...assets.map((asset, index) => [
          index + 1,
          asset.assetnumber || '',
          asset.model || '',
          asset.categoryname || '',
          asset.assettype_name || '',
          asset.manufacturer_name || '',
          asset.vendor_name || '',
          asset.serialnumber || '',
          asset.purchasecost || '',
          asset.currentvalue || '',
          asset.assigned_employee_name || '',
          asset.storedlocation || '',
          (() => {
            const statusData = assetStatuses.find(s => s.codeid === asset.status);
            return statusData ? statusData.codename : (asset.status === 1 ? 'Active' : 'Inactive');
          })(),
          asset.purchasedate ? formatDate(asset.purchasedate) : '',
          asset.warrantyenddate ? formatDate(asset.warrantyenddate) : '',
          asset.addeddate ? formatDate(asset.addeddate) : ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `assets_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      //toast.success('Assets exported to Excel successfully');
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
      if (!assets || assets.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Define columns for PDF export - reduced for better formatting
      const columns = [
        { key: 'srno', header: 'Sr No' },
        { key: 'assetnumber', header: 'Asset No' },
        { key: 'model', header: 'Model' },
        { key: 'categoryname', header: 'Category' },
        { key: 'assettype_name', header: 'Type' },
        { key: 'manufacturer_name', header: 'Manufacturer' },
        { key: 'serialnumber', header: 'Serial No' },
        { key: 'purchasecost', header: 'Cost' },
        { key: 'assigned_employee_name', header: 'Assigned To' },
        { key: 'status', header: 'Status' },
        { key: 'purchasedate', header: 'Purchase Date' }
      ];

      // Prepare data with proper rendering
      const exportData = assets.map((asset, index) => {
        // Get status text
        let statusText = 'Unknown';
        if (assetStatuses && assetStatuses.length > 0) {
          const statusData = assetStatuses.find(s => s.codeid === asset.status);
          statusText = statusData ? statusData.codename : (asset.status === 1 ? 'Active' : 'Inactive');
        } else {
          statusText = asset.status === 1 ? 'Active' : 'Inactive';
        }

        return {
          srno: index + 1,
          assetnumber: asset.assetnumber || 'N/A',
          model: asset.model || 'N/A',
          categoryname: asset.categoryname || 'N/A',
          assettype_name: asset.assettype_name || 'N/A',
          manufacturer_name: asset.manufacturer_name || 'N/A',
          serialnumber: asset.serialnumber || 'N/A',
          purchasecost: (() => {
            const cost = asset.purchasecost;
            
            if (!cost || cost === '0.00' || cost === 0 || cost === '0') {
              return 'N/A';
            }
            
            const numCost = parseFloat(cost);
            if (isNaN(numCost)) {
              return 'N/A';
            }
            
            return numCost.toLocaleString('en-IN');
          })(),
          assigned_employee_name: asset.assigned_employee_name || 'N/A',
          status: statusText,
          purchasedate: asset.purchasedate ? formatDate(asset.purchasedate) : 'N/A'
        };
      });


      // Call the imported exportToPDF function with correct parameters
      const result = exportToPDF({
        data: exportData,
        columns: columns,
        title: 'Assets Report',
        filename: `assets_report_${new Date().toISOString().split('T')[0]}.pdf`,
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
        toast.error(`Failed to export to PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(`Failed to export to PDF: ${error.message}`);
    }
  };

  const getStatusBadge = (status) => {
    // Find the status in the dropdown data
    const statusData = assetStatuses.find(s => s.codeid === status);
    const statusText = statusData ? statusData.codename : 'Unknown';
    
    // Handle unknown status
    if (statusText === 'Unknown') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{statusText}</Badge>;
    }
    
    // Color mapping for specific status codes
    const getStatusColor = (statusId) => {
      switch (statusId) {
        case 481: // In Stock
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700";
        case 482: // In Repair
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700";
        case 483: // Retired
          return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-700";
        case 484: // Assigned
          return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-700";
        case 485: // Scrapped
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
        case 486: // Record Deleted
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
        case 1: // Legacy Active
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700";
        case 0: // Legacy Inactive
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
      }
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${getStatusColor(status)} font-medium`}
      >
        {statusText}
      </Badge>
    );
  };

  // Helper function to get condition text for search
  const getConditionText = (conditionId) => {
    switch (conditionId) {
      case 1:
        return "Excellent";
      case 2:
        return "Good";
      case 3:
        return "Fair";
      case 4:
        return "Poor";
      case 5:
        return "Critical";
      case 6:
        return "Damaged";
      case 7:
        return "Out of Service";
      default:
        return "Unknown";
    }
  };

  const getConditionBadge = (condition) => {
    // Color mapping for specific condition codes
    const getConditionColor = (conditionId) => {
      switch (conditionId) {
        case 1: // Excellent
          return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700";
        case 2: // Good
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700";
        case 3: // Fair
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
        case 4: // Poor
          return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-700";
        case 5: // Critical
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
        case 6: // Damaged
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
        case 7: // Out of Service
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
      }
    };

    const conditionText = getConditionText(condition);
    
    return (
      <Badge 
        variant="outline" 
        className={`${getConditionColor(condition)} font-medium`}
      >
        {conditionText}
      </Badge>
    );
  };

  // Show loading state only while financial year is actually loading
  if (financialYearLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading financial year data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative bulk-insert-button-container">
            <div className="flex">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBulkInsert}
                disabled={loadingDropdownData}
                className="flex items-center space-x-2 rounded-r-none border-r-0 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
              >
                {loadingDropdownData ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Bulk Insert</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleBulkInsertMenuToggle}
                disabled={loadingDropdownData}
                className="px-4 rounded-l-none border-l-0 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 border-l border-l-gray-400 dark:border-l-gray-500"
                style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Bulk Insert Dropdown Menu */}
            {showBulkInsertMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleBulkInsertOption('bulk-update')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <span className="text-blue-600">🔄</span>
                    <span>Bulk Update</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            size="lg"
            onClick={async () => {
              // Check if "All Financial Year" is selected
              if (selectedFinancialYear && selectedFinancialYear.id === 0) {
                toast.info('Please select specific financial year instead of All.');
                return;
              }
              
              await loadDropdownData();
              setShowForm(true);
            }}
            disabled={loadingDropdownData}
            className="flex items-center space-x-2"
          >
            {loadingDropdownData ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Asset</span>
              </>
            )}
        </Button>
        </div>
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
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sr No</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Asset Number</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('model')}
                        onChange={() => toggleColumn('model')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Model</span>
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
                        checked={selectedColumns.includes('assettype_name')}
                        onChange={() => toggleColumn('assettype_name')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Asset Type</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('manufacturer_name')}
                        onChange={() => toggleColumn('manufacturer_name')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Manufacturer</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('serialnumber')}
                        onChange={() => toggleColumn('serialnumber')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Serial No</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('assigned_employee_name')}
                        onChange={() => toggleColumn('assigned_employee_name')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Assigned Employee</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('status')}
                        onChange={() => toggleColumn('status')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Status</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('purchasedate')}
                        onChange={() => toggleColumn('purchasedate')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Purchase Date</span>
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
                        handleChangePageSize(10);
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
                        handleChangePageSize(20);
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
                        handleChangePageSize(50);
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
                        handleChangePageSize(1000);
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

            <div className="relative export-button-container">
              <Button
                variant="outline"
                icon={Download}
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
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
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
              {Object.keys(activeFilters).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(activeFilters).length}
                </Badge>
              )}
            </Button>
      </div>

          {/* Right: Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search assets by number, model, category, type, manufacturer, vendor, serial number, employee, status, location..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="pl-10 pr-4 w-80"
            />
          </div>
        </div>

        {/* Filter Form */}
        {showFilters && (
          <AssetFilterForm
            onFilter={handleFilter}
            onClear={handleClearFilters}
            loading={loading}
            activeFilters={activeFilters}
          />
        )}
      </div>

      {/* Selection Banner */}
      <AnimatePresence>
        {selectedAssetIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {selectedAssetIds.length} asset{selectedAssetIds.length !== 1 ? 's' : ''} selected
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="text-white bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAssetIds([])}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear Selection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Pagination */}
      {shouldShowPagination && (
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {debouncedSearchTerm ? (
              `Showing ${filteredAssets.length} search results`
            ) : pagination.pageSize === 1000 ? (
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
                onClick={() => handleChangePage(pagination.currentPage - 1)}
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
                onClick={() => handleChangePage(pagination.currentPage + 1)}
                disabled={!pagination.next}
              >
                Next
            </Button>
          </div>
          )}
        </div>
      )}

      {/* Assets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-auto max-h-[70vh] pr-2 pb-2">
          <SortableTable onSort={handleSort} defaultSortKey="addeddate" defaultSortDirection="desc" sortConfig={sortConfig}>
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <tr>
                  {selectedColumns.map((columnKey) => {
                    const config = columnDefinitions[columnKey];
                    if (!config) return null;

                    // Special handling for checkbox column
                    if (columnKey === 'checkbox') {
                      const currentAssets = debouncedSearchTerm ? filteredAssets : assets;
                      const validAssets = currentAssets.filter(asset => 
                        asset.assetdetailsid && asset.assetdetailsid !== 0 && asset.assetdetailsid !== '0' && asset.isdeleted !== 1
                      );
                      const allSelected = validAssets.length > 0 && validAssets.every(asset => 
                        selectedAssetIds.includes(asset.assetdetailsid)
                      );
                      
                      return (
                        <th
                          key={columnKey}
                          className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={handleSelectAll}
                              disabled={validAssets.length === 0}
                            />
                          </div>
                        </th>
                      );
                    }

                    // Determine if column should be center-aligned (numeric and date columns)
                    const isCenterAlignColumn = ['srno', 'purchasecost', 'currentvalue', 'purchasedate', 'warrantyenddate', 'addeddate'].includes(columnKey);
                    const alignmentClass = isCenterAlignColumn ? 'text-center' : 'text-left';
                    
                    return (
                      <SortableTableHead
                        key={columnKey}
                        sortKey={config.sortable ? columnKey : null}
                        sortable={config.sortable}
                        className={`px-1 py-2 ${alignmentClass} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}
                      >
                        {config.label}
                      </SortableTableHead>
                    );
                  })}
                </tr>
              </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td colSpan={selectedColumns.length} className="px-1 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-600 dark:text-gray-400">Loading assets...</span>
                    </div>
                  </td>
                </tr>
              ) : (debouncedSearchTerm ? filteredAssets : assets).length === 0 ? (
                <tr>
                  <td colSpan={selectedColumns.length} className="px-1 py-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No assets found</p>
                      <p className="text-sm">Try adjusting your search criteria or add a new asset.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (debouncedSearchTerm ? filteredAssets : assets).map((asset, index) => (
                  <tr 
                    key={asset.assetdetailsid} 
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer group transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    onClick={() => handleViewAsset(asset)}
                    title="Click to view asset details"
                  >
                    {selectedColumns.map((columnKey) => {
                      let content;
                      switch (columnKey) {
                        case 'checkbox':
                          const isValidAsset = asset.assetdetailsid && asset.assetdetailsid !== 0 && asset.assetdetailsid !== '0' && asset.isdeleted !== 1;
                          content = (
                            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedAssetIds.includes(asset.assetdetailsid)}
                                onCheckedChange={(checked) => handleSelectAsset(asset.assetdetailsid, checked)}
                                disabled={!isValidAsset}
                              />
                            </div>
                          );
                          break;
                        case 'srno':
                          content = ((pagination.currentPage - 1) * pagination.pageSize) + index + 1;
                          break;
                        case 'assetnumber':
                          content = asset.assetnumber || 'N/A';
                          break;
                        case 'model':
                          content = asset.model || 'N/A';
                          break;
                        case 'categoryname':
                          content = asset.categoryname || 'N/A';
                          break;
                        case 'assettype_name':
                          content = asset.assettype_name || 'N/A';
                          break;
                        case 'manufacturer_name':
                          content = asset.manufacturer_name || 'N/A';
                          break;
                        case 'vendor_name':
                          content = asset.vendor_name || 'N/A';
                          break;
                        case 'serialnumber':
                          content = asset.serialnumber || 'N/A';
                          break;
                        case 'purchasecost':
                          content = (() => {
                            const cost = asset.purchasecost;
                            if (!cost || cost === '0.00' || cost === 0 || cost === '0') {
                              return 'N/A';
                            }
                            const numCost = parseFloat(cost);
                            return isNaN(numCost) ? 'N/A' : numCost.toLocaleString('en-IN');
                          })();
                          break;
                        case 'currentvalue':
                          content = (() => {
                            const cost = asset.currentvalue;
                            if (!cost || cost === '0.00' || cost === 0 || cost === '0') {
                              return 'N/A';
                            }
                            const numCost = parseFloat(cost);
                            return isNaN(numCost) ? 'N/A' : numCost.toLocaleString('en-IN');
                          })();
                          break;
                        case 'assigned_employee_name': {
                          // Show value based on status:
                          // - Assigned  -> employee name
                          // - In Stock  -> stored location
                          // - Others    -> '-'
                          let statusName = '';
                          if (assetStatuses && assetStatuses.length > 0) {
                            const statusData = assetStatuses.find(
                              (s) => s.codeid === asset.status
                            );
                            statusName = statusData?.codename || '';
                          }

                          if (statusName === 'Assigned') {
                            content = asset.assigned_employee_name || '-';
                          } else if (statusName === 'In Stock') {
                            content = asset.storedlocation || '-';
                          } else {
                            content = '-';
                          }
                          break;
                        }
                        case 'storedlocation':
                          content = asset.storedlocation || 'N/A';
                          break;
                        case 'status':
                          content = getStatusBadge(asset.status);
                          break;
                        case 'purchasedate':
                          content = asset.purchasedate ? formatDate(asset.purchasedate) : 'N/A';
                          break;
                        case 'warrantyenddate':
                          content = asset.warrantyenddate ? formatDate(asset.warrantyenddate) : 'N/A';
                          break;
                        case 'addeddate':
                          content = asset.addeddate ? formatDate(asset.addeddate) : 'N/A';
                          break;
                        case 'actions':
                          content = (
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                              {asset.isdeleted !== 1 && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewLogs(asset)}
                                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
                                    title="View logs"
                                  >
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditAsset(asset)}
                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900"
                                    title="Edit asset"
                                  >
                                    <Edit className="w-4 h-4 text-green-600" />
                                  </Button>
                                  {/* Only show delete button if asset has a valid ID */}
                                  {asset.assetdetailsid && asset.assetdetailsid !== 0 && asset.assetdetailsid !== '0' ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteAsset(asset.assetdetailsid)}
                                      disabled={deletingId === asset.assetdetailsid}
                                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-50"
                                      title="Delete asset"
                                    >
                                      {deletingId === asset.assetdetailsid ? (
                                        <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                                      ) : (
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      )}
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 italic px-2">
                                      Invalid ID
                                    </span>
                                  )}
                                </>
                              )}
                              {asset.isdeleted === 1 && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewLogs(asset)}
                                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
                                    title="View logs"
                                  >
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                                    Deleted
                                  </span>
                                </>
                              )}
                            </div>
                          );
                          break;
                        default:
                          content = asset[columnKey] || 'N/A';
                      }

                      // Determine if column should be center-aligned (numeric and date columns)
                      const isCenterAlignColumn = ['srno', 'purchasecost', 'currentvalue', 'purchasedate', 'warrantyenddate', 'addeddate'].includes(columnKey);
                      const alignmentClass = isCenterAlignColumn ? 'text-center' : '';
                      
                      return (
                        <td key={columnKey} className={`px-1 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${alignmentClass}`}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </SortableTable>
                  </div>


      </Card>

      {/* Bottom Pagination */}
      {shouldShowPagination && (
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {debouncedSearchTerm ? (
              `Showing ${filteredAssets.length} search results`
            ) : pagination.pageSize === 1000 ? (
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
              onClick={() => handleChangePage(pagination.currentPage - 1)}
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
              onClick={() => handleChangePage(pagination.currentPage + 1)}
              disabled={!pagination.next}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Asset Form Modal */}
      <AssetDetailsForm
        asset={editingAsset}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingAsset ? handleUpdateAsset : handleCreateAsset}
        loading={loading}
        assetTypes={assetTypes}
        manufacturers={manufacturers}
        vendors={vendors}
        employees={employees}
        assetTypesLoading={assetTypesLoading}
        assetTypesError={assetTypesError}
        manufacturersLoading={manufacturersLoading}
        manufacturersError={manufacturersError}
        vendorsLoading={vendorsLoading}
        vendorsError={vendorsError}
        employeesLoading={employeesLoading}
        employeesError={employeesError}
        loadDropdownData={loadDropdownData}
      />

      {/* Asset Details Modal */}
      <AssetDetailsModal
        asset={selectedAsset}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        assetStatuses={assetStatuses}
        assetConditions={assetConditions}
        orgId={user?.orgId}
      />

      {/* Asset Logs Modal */}
      <AssetLogsModal
        asset={selectedAssetForLogs}
        isOpen={showLogsModal}
        onClose={() => {
          setShowLogsModal(false);
          setSelectedAssetForLogs(null);
        }}
      />
    </div>
  );
};

export default AssetDetails; 
