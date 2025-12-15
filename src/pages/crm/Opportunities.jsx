import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Handshake, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar,
  Eye,
  MoreVertical,
  TrendingUp,
  Target,
  Phone,
  Mail,
  RefreshCw,
  Download,
  ChevronDown,
  SlidersHorizontal,
  GripVertical
} from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table } from '../../components/ui/table';
import { SortableTable, SortableTableHead, sortData } from '../../components/ui/sortable-table';
import OpportunityViewModal from '../../components/OpportunityViewModal';
import { OpportunityForm } from '../../components/forms';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([
    'title', 'company', 'stage', 'closeDate', 'expectedRevenue', 'actualCloseRevenue', 'contactPerson', 'owner', 'actions'
  ]);
  const [columnOrder, setColumnOrder] = useState([
    'checkbox', 'title', 'company', 'stage', 'closeDate', 'expectedRevenue', 'actualCloseRevenue', 'contactPerson', 'owner', 'actions'
  ]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);
  const [showBulkStageModal, setShowBulkStageModal] = useState(false);

  // Refs for dropdown containers
  const columnSelectorRef = useRef(null);
  const pageSizeMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Mock users data for the form
  const mockUsers = [
    { id: 1, fullname: 'Alice Johnson', name: 'Alice Johnson' },
    { id: 2, fullname: 'Bob Smith', name: 'Bob Smith' },
    { id: 3, fullname: 'Carol Davis', name: 'Carol Davis' },
    { id: 4, fullname: 'David Wilson', name: 'David Wilson' },
    { id: 5, fullname: 'Eva Brown', name: 'Eva Brown' },
    { id: 6, fullname: 'Frank Miller', name: 'Frank Miller' },
  ];

  // Mock opportunities data
  const opportunities = [
    {
      id: 1,
      title: 'Enterprise Software License',
      company: 'Tech Solutions Inc.',
      contact: 'John Smith',
      contactPhone: '+1-555-0123',
      contactEmail: 'john.smith@techsolutions.com',
      contactPerson: 'John Smith',
      expectedRevenue: 45000,
      actualCloseRevenue: null,
      stage: 'Proposal',
      closeDate: '2024-03-15',
      owner: 'Alice Johnson',
      createdDate: '2024-01-15',
      lastActivity: '2024-02-15'
    },
    {
      id: 2,
      title: 'Cloud Infrastructure Setup',
      company: 'Global Enterprises',
      contact: 'Sarah Johnson',
      contactPhone: '+1-555-0124',
      contactEmail: 'sarah.johnson@globalenterprises.com',
      contactPerson: 'Sarah Johnson',
      expectedRevenue: 32000,
      actualCloseRevenue: null,
      stage: 'Negotiation',
      closeDate: '2024-03-20',
      owner: 'Bob Smith',
      createdDate: '2024-01-20',
      lastActivity: '2024-02-16'
    },
    {
      id: 3,
      title: 'Custom Development',
      company: 'StartupXYZ',
      contact: 'Mike Chen',
      contactPhone: '+1-555-0125',
      contactEmail: 'mike.chen@startupxyz.com',
      contactPerson: 'Mike Chen',
      expectedRevenue: 18500,
      actualCloseRevenue: null,
      stage: 'Qualified',
      closeDate: '2024-04-01',
      owner: 'Carol Davis',
      createdDate: '2024-02-01',
      lastActivity: '2024-02-14'
    },
    {
      id: 4,
      title: 'Marketing Automation Platform',
      company: 'Digital Marketing Co.',
      contact: 'Emily Rodriguez',
      contactPhone: '+1-555-0126',
      contactEmail: 'emily.rodriguez@digitalmarketing.com',
      contactPerson: 'Emily Rodriguez',
      expectedRevenue: 28000,
      actualCloseRevenue: null,
      stage: 'Proposal',
      closeDate: '2024-03-25',
      owner: 'David Wilson',
      createdDate: '2024-01-25',
      lastActivity: '2024-02-12'
    },
    {
      id: 5,
      title: 'ERP System Implementation',
      company: 'Manufacturing Ltd.',
      contact: 'Robert Taylor',
      contactPhone: '+1-555-0127',
      contactEmail: 'robert.taylor@manufacturing.com',
      contactPerson: 'Robert Taylor',
      expectedRevenue: 75000,
      actualCloseRevenue: null,
      stage: 'Negotiation',
      closeDate: '2024-02-28',
      owner: 'Eva Brown',
      createdDate: '2024-01-10',
      lastActivity: '2024-02-15'
    },
    {
      id: 6,
      title: 'Healthcare Management System',
      company: 'Healthcare Systems',
      contact: 'Lisa Anderson',
      contactPhone: '+1-555-0128',
      contactEmail: 'lisa.anderson@healthcare.com',
      contactPerson: 'Lisa Anderson',
      expectedRevenue: 42000,
      actualCloseRevenue: 42000,
      stage: 'Closed Won',
      closeDate: '2024-02-10',
      owner: 'Frank Miller',
      createdDate: '2024-01-05',
      lastActivity: '2024-02-10'
    }
  ];

  const stageOptions = ['All', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Qualified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Proposal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Closed Won':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Closed Lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };


  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'All' || opportunity.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  // Sort the filtered opportunities
  const sortedOpportunities = sortData(filteredOpportunities, sortConfig);

  // Handle sorting
  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Action handlers
  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowViewModal(true);
  };

  const handleAddOpportunity = () => {
    setEditingOpportunity(null);
    setShowFormModal(true);
  };

  const handleEditOpportunity = (opportunity) => {
    // Map the opportunity data to the format expected by the form
    const formattedOpportunity = {
      dealname: opportunity.title,
      companyname: opportunity.company,
      customername: opportunity.contact,
      dealvalue: opportunity.value,
      dealstage: opportunity.stage,
      probability: opportunity.probability,
      expectedclosedate: opportunity.closeDate,
      dealownerid: mockUsers.find(u => u.fullname === opportunity.owner)?.id || 1,
      // Add other fields with default values
      dealstatus: 'Open',
      customertype: 'New',
      revenuetype: 'One-time',
      dealtype: 'New',
      dealhealthindicator: 'Green',
      customerrisklevel: 'Low',
      addedby: 1,
      dealcreateddate: opportunity.createdDate,
    };
    setEditingOpportunity(formattedOpportunity);
    setShowFormModal(true);
  };

  const handleDeleteOpportunity = (opportunityId) => {
    console.log('Delete opportunity:', opportunityId);
    // TODO: Implement delete opportunity confirmation
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingOpportunity) {
        toast.success('Opportunity updated successfully!');
      } else {
        toast.success('Opportunity created successfully!');
      }
      
      setShowFormModal(false);
      setEditingOpportunity(null);
      // TODO: Refresh opportunities list from API
    } catch (error) {
      toast.error('Failed to save opportunity');
      console.error('Error saving opportunity:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
    setEditingOpportunity(null);
  };

  // Search bar container handlers
  const handleRefresh = () => {
    console.log('Refreshing opportunities...');
    // TODO: Implement refresh functionality
  };

  const handleExport = (format) => {
    console.log(`Exporting opportunities to ${format}...`);
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

  // Checkbox handlers
  const handleSelectAll = () => {
    if (selectedOpportunities.length === sortedOpportunities.length) {
      setSelectedOpportunities([]);
    } else {
      setSelectedOpportunities(sortedOpportunities.map(opp => opp.id));
    }
  };

  const handleSelectOpportunity = (opportunityId) => {
    setSelectedOpportunities(prev => 
      prev.includes(opportunityId)
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId]
    );
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete selected opportunities:', selectedOpportunities);
    // TODO: Implement bulk delete functionality
    toast.info('Bulk delete functionality will be implemented');
    setSelectedOpportunities([]);
  };

  const handleBulkStageChange = () => {
    setShowBulkStageModal(true);
  };

  const handleBulkStageUpdate = (newStage) => {
    console.log('Bulk stage update:', { selectedOpportunities, newStage });
    // TODO: Implement bulk stage update functionality
    toast.success(`${selectedOpportunities.length} opportunities updated to ${newStage}`);
    setShowBulkStageModal(false);
    setSelectedOpportunities([]);
  };

  // Column configuration
  const columnConfig = {
    checkbox: { label: '', sortable: false },
    title: { label: 'Name', sortKey: 'title' },
    company: { label: 'Company', sortKey: 'company' },
    stage: { label: 'Status', sortKey: 'stage' },
    closeDate: { label: 'Expected Close Date', sortKey: 'closeDate' },
    expectedRevenue: { label: 'Expected Revenue', sortKey: 'expectedRevenue' },
    actualCloseRevenue: { label: 'Actual Close Revenue', sortKey: 'actualCloseRevenue' },
    contactPerson: { label: 'Contact Person', sortKey: 'contactPerson' },
    owner: { label: 'Owner', sortKey: 'owner' },
    actions: { label: 'Actions', sortable: false }
  };

  const totalExpectedRevenue = opportunities.reduce((sum, opportunity) => sum + opportunity.expectedRevenue, 0);
  const totalActualRevenue = opportunities.reduce((sum, opportunity) => sum + (opportunity.actualCloseRevenue || 0), 0);

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
      {/* Header with Stats Cards and Add Opportunity Button */}
      <div className="flex items-center justify-between">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 flex-1 mr-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Handshake className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Opportunities</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{opportunities.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expected Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${totalExpectedRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actual Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${totalActualRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round((opportunities.filter(opportunity => opportunity.stage === 'Closed Won').length / opportunities.length) * 100)}%
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* Add Opportunity Button */}
        <Button size="lg" onClick={handleAddOpportunity}>
          <Plus className="w-4 h-4 mr-2" />
          Add Opportunity
        </Button>
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
                        checked={selectedColumns.includes('title')}
                        onChange={() => toggleColumn('title')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Title</span>
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
                        checked={selectedColumns.includes('expectedRevenue')}
                        onChange={() => toggleColumn('expectedRevenue')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Expected Revenue</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('actualCloseRevenue')}
                        onChange={() => toggleColumn('actualCloseRevenue')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Actual Close Revenue</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('contactPerson')}
                        onChange={() => toggleColumn('contactPerson')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Contact Person</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('stage')}
                        onChange={() => toggleColumn('stage')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Stage</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('closeDate')}
                        onChange={() => toggleColumn('closeDate')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Expected Close Date</span>
                    </label>
                    
                    
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('owner')}
                        onChange={() => toggleColumn('owner')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Owner</span>
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
              placeholder="Search opportunities by title, company, contact, stage, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 w-80"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOpportunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedOpportunities.length} opportunity{selectedOpportunities.length !== 1 ? 'ies' : ''} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOpportunities([])}
                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 px-3 py-1.5"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkStageChange}
                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 px-3 py-1.5"
              >
                <Edit className="w-4 h-4 mr-2" />
                Change Stage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2 text-white" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Stage Change Modal */}
      {showBulkStageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Stage for {selectedOpportunities.length} Opportunit{selectedOpportunities.length !== 1 ? 'ies' : 'y'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select a new stage for the selected opportunities.
            </p>
            <div className="space-y-3 mb-6">
              {stageOptions.filter(stage => stage !== 'All').map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleBulkStageUpdate(stage)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">{stage}</span>
                    <Badge className={getStageColor(stage)}>
                      {stage}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowBulkStageModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Table */}
      <Card>
        <div className="overflow-x-auto">
          <SortableTable data={sortedOpportunities} onSort={handleSort} defaultSortKey="createdDate" defaultSortDirection="desc">
            <Table>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {columnOrder.map((columnKey) => {
                    const config = columnConfig[columnKey];
                    if (!config) return null;
                    
                    // Special handling for checkbox column
                    if (columnKey === 'checkbox') {
                      return (
                        <th key={columnKey} className="py-4 px-4 w-12">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={sortedOpportunities.length > 0 && selectedOpportunities.length === sortedOpportunities.length}
                              onChange={handleSelectAll}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        </th>
                      );
                    }
                    
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
                  {sortedOpportunities.map((opportunity, index) => (
                  <motion.tr
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleViewOpportunity(opportunity)}
                  >
                    {columnOrder.map((columnKey) => {
                      const config = columnConfig[columnKey];
                      if (!config) return null;

                      return (
                        <td key={columnKey} className="py-4 px-4">
                          {columnKey === 'checkbox' && (
                            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedOpportunities.includes(opportunity.id)}
                                onChange={() => handleSelectOpportunity(opportunity.id)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                              />
                            </div>
                          )}
                          {columnKey === 'title' && (
                            <div className="max-w-[200px]">
                              <p className="font-medium text-gray-900 dark:text-white truncate" title={opportunity.title}>
                                {opportunity.title}
                              </p>
                            </div>
                          )}
                          {columnKey === 'company' && (
                            <p className="text-gray-900 dark:text-white">{opportunity.company}</p>
                          )}
                          {columnKey === 'owner' && (
                            <p className="text-gray-900 dark:text-white">{opportunity.owner}</p>
                          )}
                          {columnKey === 'stage' && (
                            <Badge className={getStageColor(opportunity.stage)}>
                              {opportunity.stage}
                            </Badge>
                          )}
                          {columnKey === 'closeDate' && (
                            <div>
                              <p className="text-gray-900 dark:text-white">
                                {formatDate(opportunity.closeDate)}
                              </p>
                            </div>
                          )}
                          {columnKey === 'expectedRevenue' && (
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                ${opportunity.expectedRevenue.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {columnKey === 'actualCloseRevenue' && (
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {opportunity.actualCloseRevenue ? `$${opportunity.actualCloseRevenue.toLocaleString()}` : '-'}
                              </p>
                            </div>
                          )}
                          {columnKey === 'contactPerson' && (
                            <div>
                              <p className="text-gray-900 dark:text-white">{opportunity.contactPerson}</p>
                            </div>
                          )}
                          {columnKey === 'actions' && (
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`mailto:${opportunity.contactEmail || ''}`, '_blank')}
                                className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900"
                                title={`Email ${opportunity.contact}`}
                              >
                                <Mail className="w-4 h-4 text-purple-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`tel:${opportunity.contactPhone || ''}`, '_blank')}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
                                title={`Call ${opportunity.contact}`}
                              >
                                <Phone className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditOpportunity(opportunity)}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900"
                                title="Edit opportunity"
                              >
                                <Edit className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteOpportunity(opportunity.id)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900"
                                title="Delete opportunity"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </SortableTable>
        </div>
      </Card>

      {/* View Opportunity Modal */}
      <OpportunityViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        opportunity={selectedOpportunity}
      />

      {/* Add/Edit Opportunity Form Modal */}
      {showFormModal && (
        <OpportunityForm
          deal={editingOpportunity}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
          users={mockUsers}
          contacts={[]}
        />
      )}
    </div>
  );
};

export default Opportunities;

