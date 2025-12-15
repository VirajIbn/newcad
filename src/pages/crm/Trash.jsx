import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Search, 
  Filter, 
  Edit, 
  RotateCcw, 
  Eye, 
  MoreVertical,
  RefreshCw,
  Download,
  ChevronDown,
  SlidersHorizontal,
  GripVertical,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table } from '../../components/ui/table';
import { SortableTable, SortableTableHead, sortData } from '../../components/ui/sortable-table';
import { Checkbox } from '../../components/ui/checkbox';
import { formatDate } from '../../utils/formatDate';

const Trash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'deletedDate', direction: 'desc' });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([
    'type', 'name', 'company', 'deletedBy', 'deletedDate', 'actions'
  ]);
  const [columnOrder, setColumnOrder] = useState([
    'type', 'name', 'company', 'deletedBy', 'deletedDate', 'actions'
  ]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Refs for dropdown containers
  const columnSelectorRef = useRef(null);
  const pageSizeMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Mock trash data
  const trashItems = [
    {
      id: 1,
      type: 'Lead',
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      email: 'john.smith@techsolutions.com',
      phone: '+1-555-0123',
      deletedBy: 'Alice Johnson',
      deletedDate: '2024-02-15',
      originalId: 'lead_001',
      reason: 'Duplicate entry'
    },
    {
      id: 2,
      type: 'Deal',
      name: 'Enterprise Software License',
      company: 'Global Enterprises',
      email: 'sarah.johnson@globalent.com',
      phone: '+1-555-0124',
      deletedBy: 'Bob Smith',
      deletedDate: '2024-02-14',
      originalId: 'deal_002',
      reason: 'Cancelled by client'
    },
    {
      id: 4,
      type: 'Lead',
      name: 'Mike Chen',
      company: 'StartupXYZ',
      email: 'mike.chen@startupxyz.com',
      phone: '+1-555-0126',
      deletedBy: 'David Wilson',
      deletedDate: '2024-02-12',
      originalId: 'lead_004',
      reason: 'Invalid contact information'
    },
    {
      id: 5,
      type: 'Deal',
      name: 'Custom Development',
      company: 'Manufacturing Ltd.',
      email: 'robert.taylor@manufacturing.com',
      phone: '+1-555-0127',
      deletedBy: 'Eva Brown',
      deletedDate: '2024-02-11',
      originalId: 'deal_005',
      reason: 'Project scope changed'
    }
  ];

  const typeOptions = ['All', 'Lead', 'Deal'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Deal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Lead':
        return User;
      case 'Deal':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const filteredItems = trashItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort the filtered items
  const sortedItems = sortData(filteredItems, sortConfig);

  // Handle sorting
  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Selection handlers
  const handleSelectAll = (checked) => {
    setIsAllSelected(checked);
    if (checked) {
      setSelectedItems(sortedItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => {
        const newSelected = [...prev, itemId];
        // Check if all items are now selected
        setIsAllSelected(newSelected.length === sortedItems.length);
        return newSelected;
      });
    } else {
      setSelectedItems(prev => {
        const newSelected = prev.filter(id => id !== itemId);
        setIsAllSelected(false);
        return newSelected;
      });
    }
  };

  // Action handlers
  const handleRestore = (item) => {
    console.log('Restore item:', item);
    // TODO: Implement restore functionality
  };

  const handlePermanentDelete = (itemId) => {
    console.log('Permanently delete item:', itemId);
    // TODO: Implement permanent delete functionality
  };

  const handleBulkRestore = () => {
    console.log('Bulk restore items:', selectedItems);
    // TODO: Implement bulk restore functionality
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete items:', selectedItems);
    // TODO: Implement bulk delete functionality
  };

  const handleEmptyTrash = () => {
    console.log('Empty trash');
    // TODO: Implement empty trash functionality
  };

  // Search bar container handlers
  const handleRefresh = () => {
    console.log('Refreshing trash...');
    // TODO: Implement refresh functionality
  };

  const handleExport = (format) => {
    console.log(`Exporting trash to ${format}...`);
    // TODO: Implement export functionality
  };

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize);
  };

  const toggleColumn = (columnKey) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Column drag and drop handlers
  const handleDragStart = (e, columnKey) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumn) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumn);

    // Remove dragged column and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Column configuration
  const columnConfig = {
    type: { label: 'Type', sortKey: 'type' },
    name: { label: 'Name', sortKey: 'name' },
    company: { label: 'Company', sortKey: 'company' },
    deletedBy: { label: 'Deleted By', sortKey: 'deletedBy' },
    deletedDate: { label: 'Deleted Date', sortKey: 'deletedDate' },
    actions: { label: 'Actions', sortable: false }
  };

  const totalItems = trashItems.length;
  const selectedCount = selectedItems.length;

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target)) {
        setShowColumnSelector(false);
      }
      if (pageSizeMenuRef.current && !pageSizeMenuRef.current.contains(event.target)) {
        setShowPageSizeMenu(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showColumnSelector || showPageSizeMenu || showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSelector, showPageSizeMenu, showExportMenu]);

  return (
    <div className="pt-3 px-6 pb-6 space-y-4">
      {/* Header with Stats Cards and Actions */}
      <div className="flex items-center justify-between">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 flex-1 mr-6">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Leads</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {trashItems.filter(item => item.type === 'Lead').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deals</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {trashItems.filter(item => item.type === 'Deal').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmptyTrash}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        {/* Bottom Row: Controls */}
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Left: Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="relative column-selector-button-container" ref={columnSelectorRef}>
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
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('type')}
                        onChange={() => toggleColumn('type')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Type</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('name')}
                        onChange={() => toggleColumn('name')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('company')}
                        onChange={() => toggleColumn('company')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Company</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('deletedBy')}
                        onChange={() => toggleColumn('deletedBy')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Deleted By</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('deletedDate')}
                        onChange={() => toggleColumn('deletedDate')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Deleted Date</span>
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
            <div className="relative page-size-button-container" ref={pageSizeMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPageSizeMenu(!showPageSizeMenu)}
                className="flex items-center space-x-2"
              >
                <span>{pageSize === 1000 ? 'All' : `${pageSize} per page`}</span>
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
                        pageSize === 10 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>10 per page</span>
                      {pageSize === 10 && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        handleChangePageSize(20);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pageSize === 20 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>20 per page</span>
                      {pageSize === 20 && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        handleChangePageSize(50);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pageSize === 50 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>50 per page</span>
                      {pageSize === 50 && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        handleChangePageSize(1000);
                        setShowPageSizeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        pageSize === 1000 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>All</span>
                      {pageSize === 1000 && <span className="text-blue-600">✓</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              icon={RefreshCw}
              size="sm"
              onClick={handleRefresh}
            >
              Refresh
            </Button>

            <div className="relative export-button-container" ref={exportMenuRef}>
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
            </Button>
          </div>

          {/* Right: Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search trash by name, company, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 w-80"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedItems([]);
                  setIsAllSelected(false);
                }}
                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 px-3 py-1.5"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkRestore}
                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 px-3 py-1.5"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2 text-white" />
                Delete Permanently
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trash Table */}
      <Card className="overflow-hidden">
        <div className="overflow-auto max-h-[70vh] pr-2 pb-2">
          <SortableTable data={sortedItems} onSort={handleSort} defaultSortKey="deletedDate" defaultSortDirection="desc">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  {columnOrder.map((columnKey) => {
                    const config = columnConfig[columnKey];
                    if (!config) return null;
                    
                    return (
                      <SortableTableHead
                        key={columnKey}
                        sortKey={config.sortKey}
                        sortable={config.sortable !== false}
                        draggable
                        onDragStart={(e) => handleDragStart(e, columnKey)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, columnKey)}
                        onDragEnd={handleDragEnd}
                        onMouseEnter={() => setHoveredColumn(columnKey)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        className={`select-none transition-all duration-200 ${
                          draggedColumn === columnKey ? 'opacity-50' : ''
                        } ${
                          hoveredColumn === columnKey ? 'cursor-move' : 'cursor-default'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {hoveredColumn === columnKey && (
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          )}
                          <span>{config.label}</span>
                        </div>
                      </SortableTableHead>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedItems.map((item, index) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const isSelected = selectedItems.includes(item.id);
                    
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                          />
                        </td>
                        {columnOrder.map((columnKey) => {
                          const config = columnConfig[columnKey];
                          if (!config) return null;

                          return (
                            <td key={columnKey} className="py-4 px-4">
                              {columnKey === 'type' && (
                                <div className="flex items-center space-x-2">
                                  <TypeIcon className="w-4 h-4 text-gray-500" />
                                  <Badge className={getTypeColor(item.type)}>
                                    {item.type}
                                  </Badge>
                                </div>
                              )}
                              {columnKey === 'name' && (
                                <div>
                                  <p className="text-sm text-gray-900 dark:text-white">{item.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>
                                </div>
                              )}
                              {columnKey === 'company' && (
                                <div>
                                  <p className="text-sm text-gray-900 dark:text-white">{item.company}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.phone}</p>
                                </div>
                              )}
                              {columnKey === 'deletedBy' && (
                                <p className="text-sm text-gray-900 dark:text-white">{item.deletedBy}</p>
                              )}
                              {columnKey === 'deletedDate' && (
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900 dark:text-white">{formatDate(item.deletedDate)}</span>
                                </div>
                              )}
                              {columnKey === 'actions' && (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRestore(item)}
                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900"
                                    title="Restore item"
                                  >
                                    <RotateCcw className="w-4 h-4 text-green-600" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </SortableTable>
        </div>
      </Card>

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <Card className="p-12 text-center">
          <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedType !== 'All' ? 'No items found' : 'Trash is empty'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || selectedType !== 'All' 
              ? 'Try adjusting your search or filter criteria'
              : 'Deleted items will appear here'
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default Trash;
