import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  Building2,
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
import { useDebounce } from '../../hooks/useDebounce';
import BusinessUnitForm from '../../components/forms/BusinessUnitForm';
import { toast } from 'react-toastify';
import { exportBusinessUnitsToPDF } from '../../utils/pdfExport';

const BusinessUnits = () => {
  // Mock data instead of API calls
  const [businessUnits, setBusinessUnits] = useState([
    {
      buid: 1,
      buname: 'Cloud Services',
      bucode: 'CLD01',
      description: 'Cloud infrastructure and platform services',
      deliveryheadid: 1,
      deliveryheadname: 'John Smith',
      salesheadid: 2,
      salesheadname: 'Jane Doe',
      services: 'Cloud Computing, AWS, Azure, DevOps',
      isactive: 1,
      isdeleted: 0,
      regionid: 1,
      regionname: 'North America',
      statusreason: '',
      addeddate: '2024-01-15T10:30:00Z',
      orgid: 1,
      addedby: 1,
      modifiedby: 1
    },
    {
      buid: 2,
      buname: 'KPO Services',
      bucode: 'KPO02',
      description: 'Knowledge Process Outsourcing services',
      deliveryheadid: 3,
      deliveryheadname: 'Mike Johnson',
      salesheadid: 4,
      salesheadname: 'Sarah Wilson',
      services: 'Data Analytics, Research, Consulting',
      isactive: 1,
      isdeleted: 0,
      regionid: 2,
      regionname: 'Europe',
      statusreason: '',
      addeddate: '2024-01-20T14:15:00Z',
      orgid: 1,
      addedby: 1,
      modifiedby: 1
    },
    {
      buid: 3,
      buname: 'BPO Services',
      bucode: 'BPO03',
      description: 'Business Process Outsourcing services',
      deliveryheadid: 5,
      deliveryheadname: 'David Brown',
      salesheadid: 6,
      salesheadname: 'Lisa Davis',
      services: 'Customer Support, Back Office, Finance',
      isactive: 0,
      isdeleted: 0,
      regionid: 3,
      regionname: 'Asia Pacific',
      statusreason: 'Temporarily suspended due to restructuring',
      addeddate: '2024-02-01T09:45:00Z',
      orgid: 1,
      addedby: 1,
      modifiedby: 1
    },
    {
      buid: 4,
      buname: 'Digital Marketing',
      bucode: 'DIG04',
      description: 'Digital marketing and advertising services',
      deliveryheadid: 7,
      deliveryheadname: 'Alex Thompson',
      salesheadid: 8,
      salesheadname: 'Emma Garcia',
      services: 'SEO, Social Media, PPC, Content Marketing',
      isactive: 1,
      isdeleted: 0,
      regionid: 1,
      regionname: 'North America',
      statusreason: '',
      addeddate: '2024-02-10T16:20:00Z',
      orgid: 1,
      addedby: 1,
      modifiedby: 1
    },
    {
      buid: 5,
      buname: 'Software Development',
      bucode: 'DEV05',
      description: 'Custom software development and solutions',
      deliveryheadid: 9,
      deliveryheadname: 'Chris Lee',
      salesheadid: 10,
      salesheadname: 'Maria Rodriguez',
      services: 'Web Development, Mobile Apps, API Development',
      isactive: 1,
      isdeleted: 0,
      regionid: 4,
      regionname: 'Middle East',
      statusreason: '',
      addeddate: '2024-02-15T11:30:00Z',
      orgid: 1,
      addedby: 1,
      modifiedby: 1
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 5,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: '',
    ordering: '-addeddate',
  });

  // Mock functions instead of API calls
  const searchBusinessUnits = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const filterBusinessUnits = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createBusinessUnit = async (businessUnitData) => {
    setLoading(true);
    try {
      const newBusinessUnit = {
        ...businessUnitData,
        buid: businessUnits.length + 1,
        addeddate: new Date().toISOString(),
        deliveryheadname: 'New User',
        salesheadname: 'New User',
        regionname: 'Default Region'
      };
      setBusinessUnits(prev => [newBusinessUnit, ...prev]);
      toast.success('Business unit created successfully!');
    } catch (err) {
      toast.error('Failed to create business unit');
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessUnit = async (id, businessUnitData) => {
    setLoading(true);
    try {
      setBusinessUnits(prev => prev.map(bu => 
        bu.buid === id ? { ...bu, ...businessUnitData } : bu
      ));
      toast.success('Business unit updated successfully!');
    } catch (err) {
      toast.error('Failed to update business unit');
    } finally {
      setLoading(false);
    }
  };

  const deleteBusinessUnit = async (id) => {
    setLoading(true);
    try {
      setBusinessUnits(prev => prev.filter(bu => bu.buid !== id));
      toast.success('Business unit deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete business unit');
    } finally {
      setLoading(false);
    }
  };

  const toggleBusinessUnitStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      setBusinessUnits(prev => prev.map(bu => 
        bu.buid === id ? { ...bu, isactive: currentStatus === 1 ? 0 : 1 } : bu
      ));
      toast.success(`Business unit ${currentStatus === 1 ? 'deactivated' : 'activated'} successfully!`);
    } catch (err) {
      toast.error('Failed to toggle business unit status');
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const changePageSize = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
  };

  const refresh = () => {
    // Mock refresh - just show loading briefly
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const shouldShowPagination = pagination.totalPages > 1 && pagination.pageSize !== 1000;

  const [showForm, setShowForm] = useState(false);
  const [editingBusinessUnit, setEditingBusinessUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'addeddate', direction: 'desc' });
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedColumns, setSelectedColumns] = useState(['checkbox', 'buname', 'bucode', 'description', 'deliveryhead', 'saleshead', 'services', 'activestatus', 'addeddate', 'actions']);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([]);
  
  // Update search and ordering when they change
  useEffect(() => {
    const ordering = sortConfig.key ? (sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key) : '-addeddate';
    searchBusinessUnits(debouncedSearchTerm);
    filterBusinessUnits({ ordering });
  }, [debouncedSearchTerm, sortConfig, searchBusinessUnits, filterBusinessUnits]);
  
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
    { key: 'buname', label: 'BU Name', required: true },
    { key: 'bucode', label: 'BU Code', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'deliveryhead', label: 'Delivery Head', required: false },
    { key: 'saleshead', label: 'Sales Head', required: false },
    { key: 'services', label: 'Services/Products', required: false },
    { key: 'activestatus', label: 'Active Status', required: false },
    { key: 'region', label: 'BU Region', required: false },
    { key: 'statusreason', label: 'Status Reason', required: false },
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

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (editingBusinessUnit) {
        await updateBusinessUnit(editingBusinessUnit.buid, formData);
      } else {
        await createBusinessUnit(formData);
      }
      setShowForm(false);
      setEditingBusinessUnit(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle edit
  const handleEdit = (businessUnit) => {
    setEditingBusinessUnit(businessUnit);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this business unit?')) {
      setDeletingId(id);
      try {
        await deleteBusinessUnit(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await toggleBusinessUnitStatus(id, currentStatus);
    } catch (error) {
      console.error('Status toggle error:', error);
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const currentData = searchTerm ? filteredBusinessUnits : businessUnits;
    if (selectedBusinessUnits.length === currentData.length) {
      setSelectedBusinessUnits([]);
    } else {
      setSelectedBusinessUnits(currentData.map(bu => bu.buid));
    }
  };

  // Handle individual checkbox selection
  const handleSelectBusinessUnit = (businessUnitId) => {
    setSelectedBusinessUnits(prev => 
      prev.includes(businessUnitId)
        ? prev.filter(id => id !== businessUnitId)
        : [...prev, businessUnitId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedBusinessUnits.length === 0) return;
    
    const confirmMessage = selectedBusinessUnits.length === 1 
      ? 'Are you sure you want to delete this business unit?'
      : `Are you sure you want to delete ${selectedBusinessUnits.length} business units?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const deletedCount = selectedBusinessUnits.length;
        
        const originalToastSuccess = toast.success;
        const originalToastError = toast.error;
        
        toast.success = () => {};
        toast.error = (message) => {
          originalToastError(message);
        };
        
        try {
          await Promise.all(
            selectedBusinessUnits.map(id => deleteBusinessUnit(id))
          );
          
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          
          setSelectedBusinessUnits([]);
          toast.success(`${deletedCount} business unit${deletedCount !== 1 ? 's' : ''} deleted successfully!`);
        } catch (deleteError) {
          toast.success = originalToastSuccess;
          toast.error = originalToastError;
          throw deleteError;
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete selected business units');
      }
    }
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    if (columnKey === 'checkbox' || columnKey === 'buname') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        const nonRequiredColumns = prev.filter(col => col !== 'buname');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev;
        }
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Client-side search fallback
  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState([]);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBusinessUnits(businessUnits);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = businessUnits.filter(businessUnit => {
      const searchableFields = [
        businessUnit.buname,
        businessUnit.bucode,
        businessUnit.description,
        businessUnit.deliveryheadname,
        businessUnit.salesheadname,
        businessUnit.addeddate
      ];

      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredBusinessUnits(filtered);
  }, [businessUnits, searchTerm]);

  // Handle export to Excel or PDF
  const handleExport = (type) => {
    if (!businessUnits || businessUnits.length === 0) {
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
      const columnMap = {
        buname: 'BU Name',
        bucode: 'BU Code',
        description: 'Description',
        deliveryhead: 'Delivery Head',
        saleshead: 'Sales Head',
        services: 'Services/Products',
        activestatus: 'Active Status',
        region: 'BU Region',
        statusreason: 'Status Reason',
        addeddate: 'Added Date'
      };

      const headers = selectedColumns
        .filter(col => col !== 'actions')
        .map(col => columnMap[col] || col);

      const csvContent = [
        headers.join(','),
        ...businessUnits.map((businessUnit, index) => {
          const row = [];
          selectedColumns.forEach(col => {
            if (col === 'buname') {
              row.push(`"${businessUnit.buname || ''}"`);
            } else if (col === 'bucode') {
              row.push(`"${businessUnit.bucode || ''}"`);
            } else if (col === 'description') {
              row.push(`"${businessUnit.description || ''}"`);
            } else if (col === 'deliveryhead') {
              row.push(`"${businessUnit.deliveryheadname || ''}"`);
            } else if (col === 'saleshead') {
              row.push(`"${businessUnit.salesheadname || ''}"`);
            } else if (col === 'services') {
              row.push(`"${businessUnit.services || ''}"`);
            } else if (col === 'activestatus') {
              row.push(businessUnit.isactive === 1 ? 'Active' : 'Inactive');
            } else if (col === 'region') {
              row.push(`"${businessUnit.regionname || ''}"`);
            } else if (col === 'statusreason') {
              row.push(`"${businessUnit.statusreason || ''}"`);
            } else if (col === 'addeddate') {
              row.push(businessUnit.addeddate ? formatDate(businessUnit.addeddate) : 'N/A');
            }
          });
          return row.join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `business_units_${new Date().toISOString().split('T')[0]}.csv`);
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
    exportBusinessUnitsToPDF({
      businessUnits,
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
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
  const getActionButtons = (businessUnit) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(businessUnit)}
        disabled={loading}
        className="p-2"
        title="Edit"
      >
        <Edit className="w-4 h-4 text-green-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(businessUnit.buid)}
        disabled={loading || deletingId === businessUnit.buid}
        className="p-2"
        title="Delete"
      >
        {deletingId === businessUnit.buid ? (
          <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 text-red-600" />
        )}
      </Button>
    </div>
  );

  if (!businessUnits && !loading && !error) {
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
            Debug info: businessUnits={JSON.stringify(businessUnits)}, loading={loading}, error={error}
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
          Add Business Unit
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
                    
                    {availableColumns.map((column) => (
                      <label key={column.key} className={`flex items-center px-3 py-2 ${column.required ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(column.key)}
                          onChange={() => column.required ? null : toggleColumn(column.key)}
                          disabled={column.required}
                          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{column.label}</span>
                      </label>
                    ))}
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
              placeholder="Search business units by name, code, description..."
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
      {selectedBusinessUnits.length > 0 && (
        <div className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              {selectedBusinessUnits.length} business unit{selectedBusinessUnits.length !== 1 ? 's' : ''} selected
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBusinessUnits([])}
              className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 px-3 py-1.5"
            >
              Clear Selection
            </Button>
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
              Move to Trash
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

      {/* Business Units Table */}
      <Card>
        {loading && businessUnits.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading business units...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 text-red-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Business Units
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button variant="primary" onClick={refresh}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (searchTerm ? filteredBusinessUnits : businessUnits).length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Business Units Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filters.search || filters.isactive !== '' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first business unit'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            <SortableTable
              data={businessUnits}
              onSort={handleSort}
              defaultSortKey="addeddate"
              defaultSortDirection="desc"
              sortConfig={sortConfig}
            >
              <Table>
                <Table.Header>
                  <Table.Row>
                    {selectedColumns.includes('checkbox') && (
                      <SortableTableHead sortable={false}>
                        <input
                          type="checkbox"
                          checked={selectedBusinessUnits.length > 0 && selectedBusinessUnits.length === (searchTerm ? filteredBusinessUnits : businessUnits).length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </SortableTableHead>
                    )}
                    {selectedColumns.includes('buname') && (
                      <SortableTableHead sortKey="buname">BU Name</SortableTableHead>
                    )}
                    {selectedColumns.includes('bucode') && (
                      <SortableTableHead sortKey="bucode">BU Code</SortableTableHead>
                    )}
                    {selectedColumns.includes('description') && (
                      <SortableTableHead sortKey="description">Description</SortableTableHead>
                    )}
                    {selectedColumns.includes('deliveryhead') && (
                      <SortableTableHead sortable={false}>Delivery Head</SortableTableHead>
                    )}
                    {selectedColumns.includes('saleshead') && (
                      <SortableTableHead sortable={false}>Sales Head</SortableTableHead>
                    )}
                    {selectedColumns.includes('services') && (
                      <SortableTableHead sortable={false}>Services/Products</SortableTableHead>
                    )}
                    {selectedColumns.includes('activestatus') && (
                      <SortableTableHead sortKey="isactive">Active Status</SortableTableHead>
                    )}
                    {selectedColumns.includes('region') && (
                      <SortableTableHead sortable={false}>BU Region</SortableTableHead>
                    )}
                    {selectedColumns.includes('statusreason') && (
                      <SortableTableHead sortable={false}>Status Reason</SortableTableHead>
                    )}
                    {selectedColumns.includes('addeddate') && (
                      <SortableTableHead sortKey="addeddate">Added Date</SortableTableHead>
                    )}
                    {selectedColumns.includes('actions') && (
                      <SortableTableHead sortable={false}>Actions</SortableTableHead>
                    )}
                  </Table.Row>
                </Table.Header>
               <Table.Body>
                 {(searchTerm ? filteredBusinessUnits : businessUnits).map((businessUnit, index) => (
                   <motion.tr
                     key={businessUnit.buid}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.05 }}
                   >
                     {selectedColumns.includes('checkbox') && (
                       <Table.Cell>
                         <input
                           type="checkbox"
                           checked={selectedBusinessUnits.includes(businessUnit.buid)}
                           onChange={() => handleSelectBusinessUnit(businessUnit.buid)}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                         />
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('buname') && (
                       <Table.Cell className="font-medium">
                         {businessUnit.buname}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('bucode') && (
                       <Table.Cell>
                         {businessUnit.bucode || 'N/A'}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('description') && (
                       <Table.Cell className="max-w-xs">
                         <div className="truncate" title={businessUnit.description}>
                           {businessUnit.description || 'No description'}
                         </div>
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('deliveryhead') && (
                       <Table.Cell>
                         {businessUnit.deliveryheadname || 'N/A'}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('saleshead') && (
                       <Table.Cell>
                         {businessUnit.salesheadname || 'N/A'}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('services') && (
                       <Table.Cell className="max-w-xs">
                         <div className="truncate" title={businessUnit.services}>
                           {businessUnit.services || 'N/A'}
                         </div>
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('activestatus') && (
                       <Table.Cell>
                         {getStatusBadge(businessUnit.isactive, businessUnit.isdeleted)}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('region') && (
                       <Table.Cell>
                         {businessUnit.regionname || 'N/A'}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('statusreason') && (
                       <Table.Cell className="max-w-xs">
                         <div className="truncate" title={businessUnit.statusreason}>
                           {businessUnit.statusreason || 'N/A'}
                         </div>
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('addeddate') && (
                       <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">
                         {formatDate(businessUnit.addeddate)}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('actions') && (
                       <Table.Cell>
                         {getActionButtons(businessUnit)}
                       </Table.Cell>
                     )}
                   </motion.tr>
                 ))}
               </Table.Body>
             </Table>
            </SortableTable>
          </>
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

      {/* Business Unit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BusinessUnitForm
            businessUnit={editingBusinessUnit}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBusinessUnit(null);
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessUnits;
