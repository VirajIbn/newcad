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
import { DealViewModal } from '../../components/modals';
import { AddDealForm } from '../../components/crm';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([
    'title', 'company', 'stage', 'closeDate', 'expectedRevenue', 'actualCloseRevenue', 'contactPerson', 'owner', 'dealAge', 'activity', 'dealScore', 'winProbability', 'actions'
  ]);
  const [columnOrder, setColumnOrder] = useState([
    'checkbox', 'title', 'company', 'stage', 'closeDate', 'expectedRevenue', 'actualCloseRevenue', 'contactPerson', 'owner', 'dealAge', 'activity', 'dealScore', 'winProbability', 'actions'
  ]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
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

  // Mock deals data
  const deals = [
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
      convertedDate: '2024-01-20',
      lastActivity: '2024-02-15',
      aiActivity: 12,
      manualActivity: 8,
      dealScore: 85,
      winProbability: 75
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
      convertedDate: '2024-01-25',
      lastActivity: '2024-02-16',
      aiActivity: 8,
      manualActivity: 15,
      dealScore: 92,
      winProbability: 85
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
      convertedDate: '2024-02-05',
      lastActivity: '2024-02-14',
      aiActivity: 5,
      manualActivity: 3,
      dealScore: 68,
      winProbability: 45
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
      convertedDate: '2024-01-30',
      lastActivity: '2024-02-12',
      aiActivity: 18,
      manualActivity: 6,
      dealScore: 74,
      winProbability: 60
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
      convertedDate: '2024-01-15',
      lastActivity: '2024-02-15',
      aiActivity: 25,
      manualActivity: 12,
      dealScore: 95,
      winProbability: 90
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
      convertedDate: '2024-01-08',
      lastActivity: '2024-02-10',
      aiActivity: 15,
      manualActivity: 20,
      dealScore: 100,
      winProbability: 95
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


  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'All' || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  // Sort the filtered deals
  const sortedDeals = sortData(filteredDeals, sortConfig);

  // Handle sorting
  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Action handlers
  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setShowViewModal(true);
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setShowFormModal(true);
  };

  const handleEditDeal = (deal) => {
    // Map the deal data to the format expected by the form
    const formattedDeal = {
      dealname: deal.title,
      companyname: deal.company,
      customername: deal.contact,
      dealvalue: deal.value,
      dealstage: deal.stage,
      probability: deal.probability,
      expectedclosedate: deal.closeDate,
      dealownerid: mockUsers.find(u => u.fullname === deal.owner)?.id || 1,
      // Add other fields with default values
      dealstatus: 'Open',
      customertype: 'New',
      revenuetype: 'One-time',
      dealtype: 'New',
      dealhealthindicator: 'Green',
      customerrisklevel: 'Low',
      addedby: 1,
      dealcreateddate: deal.createdDate,
    };
    setEditingDeal(formattedDeal);
    setShowFormModal(true);
  };

  const handleDeleteDeal = (dealId) => {
    console.log('Delete deal:', dealId);
    // TODO: Implement delete deal confirmation
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingDeal) {
        toast.success('Deal updated successfully!');
      } else {
        toast.success('Deal created successfully!');
      }
      
      setShowFormModal(false);
      setEditingDeal(null);
      // TODO: Refresh deals list from API
    } catch (error) {
      toast.error('Failed to save deal');
      console.error('Error saving deal:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
    setEditingDeal(null);
  };

  // Search bar container handlers
  const handleRefresh = () => {
    console.log('Refreshing deals...');
    // TODO: Implement refresh functionality
  };

  const handleExport = (format) => {
    console.log(`Exporting deals to ${format}...`);
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
    if (selectedDeals.length === sortedDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(sortedDeals.map(deal => deal.id));
    }
  };

  const handleSelectDeal = (dealId) => {
    setSelectedDeals(prev => 
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete selected deals:', selectedDeals);
    // TODO: Implement bulk delete functionality
    toast.info('Bulk delete functionality will be implemented');
    setSelectedDeals([]);
  };

  const handleBulkStageChange = () => {
    setShowBulkStageModal(true);
  };

  const handleBulkStageUpdate = (newStage) => {
    console.log('Bulk stage update:', { selectedDeals, newStage });
    // TODO: Implement bulk stage update functionality
    toast.success(`${selectedDeals.length} deals updated to ${newStage}`);
    setShowBulkStageModal(false);
    setSelectedDeals([]);
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
    dealAge: { label: 'Deal Age', sortKey: 'convertedDate' },
    activity: { label: 'Activity', sortable: false },
    dealScore: { label: 'Deal Score', sortKey: 'dealScore' },
    winProbability: { label: 'Win Probability', sortKey: 'winProbability' },
    actions: { label: 'Actions', sortable: false }
  };

  const totalExpectedRevenue = deals.reduce((sum, deal) => sum + deal.expectedRevenue, 0);
  const totalActualRevenue = deals.reduce((sum, deal) => sum + (deal.actualCloseRevenue || 0), 0);

  // Calculate deal age in days from converted date
  const getDealAge = (convertedDate) => {
    const today = new Date();
    const converted = new Date(convertedDate);
    const diffTime = Math.abs(today - converted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get deal age color based on age
  const getDealAgeColor = (convertedDate) => {
    const age = getDealAge(convertedDate);
    if (age <= 7) {
      return 'bg-green-500'; // 0-7 days - Green
    } else if (age <= 30) {
      return 'bg-blue-500'; // 8-30 days - Blue
    } else if (age <= 60) {
      return 'bg-yellow-500'; // 31-60 days - Yellow
    } else if (age <= 90) {
      return 'bg-orange-500'; // 61-90 days - Orange
    } else {
      return 'bg-red-500'; // 90+ days - Red
    }
  };

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
      {/* Header with Stats Cards and Add Deal Button */}
      <div className="flex items-center justify-between">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 flex-1 mr-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Handshake className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deals</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{deals.length}</p>
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
                {Math.round((deals.filter(deal => deal.stage === 'Closed Won').length / deals.length) * 100)}%
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* Add Deal Button - Hidden as requested */}
        {/* <Button size="lg" onClick={handleAddDeal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button> */}
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
                        checked={selectedColumns.includes('dealAge')}
                        onChange={() => toggleColumn('dealAge')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Deal Age</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('activity')}
                        onChange={() => toggleColumn('activity')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Activity</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('dealScore')}
                        onChange={() => toggleColumn('dealScore')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Deal Score</span>
                    </label>
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('winProbability')}
                        onChange={() => toggleColumn('winProbability')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Win Probability</span>
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
              placeholder="Search deals by title, company, contact, stage, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 w-80"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedDeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedDeals.length} deal{selectedDeals.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDeals([])}
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
              Change Stage for {selectedDeals.length} Deal{selectedDeals.length !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select a new stage for the selected deals.
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

      {/* Deals Table */}
      <Card className="overflow-hidden">
        <div className="overflow-auto max-h-[70vh] pr-2 pb-2 relative">
          <SortableTable data={sortedDeals} onSort={handleSort} defaultSortKey="createdDate" defaultSortDirection="desc">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {columnOrder.map((columnKey, colIndex) => {
                    const config = columnConfig[columnKey];
                    if (!config) return null;
                    
                    // Special handling for checkbox column
                    if (columnKey === 'checkbox') {
                      return (
                        <th key={columnKey} className="py-4 px-4 w-12">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={sortedDeals.length > 0 && selectedDeals.length === sortedDeals.length}
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
                         draggable={columnKey !== 'checkbox'}
                         onDragStart={(e) => handleDragStart(e, columnKey)}
                         onDragOver={handleDragOver}
                         onDrop={(e) => handleDrop(e, columnKey)}
                         onDragEnd={handleDragEnd}
                         onMouseEnter={() => setHoveredColumn(columnKey)}
                         onMouseLeave={() => setHoveredColumn(null)}
                         className={`select-none transition-all duration-200 ${
                           draggedColumn === columnKey ? 'opacity-50' : ''
                         } ${
                           hoveredColumn === columnKey && columnKey !== 'checkbox' ? 'cursor-move' : 'cursor-default'
                         } ${
                           colIndex === 1 ? 'sticky left-0 z-10 bg-white dark:bg-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.1)]' : ''
                         }`}
                       >
                         <div className="flex items-center space-x-2 relative">
                           {columnKey === 'checkbox' ? (
                             <div className="flex items-center justify-center">
                               <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                 {config.label}
                               </span>
                             </div>
                           ) : (
                             <>
                               <div className="w-4 h-4 flex items-center justify-center">
                                 {hoveredColumn === columnKey && (
                                   <GripVertical className="w-4 h-4 text-gray-400" />
                                 )}
                               </div>
                               <span>{config.label}</span>
                             </>
                           )}
                         </div>
                       </SortableTableHead>
                     );
                  })}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedDeals.map((deal, index) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleViewDeal(deal)}
                  >
                    {columnOrder.map((columnKey, colIndex) => {
                      const config = columnConfig[columnKey];
                      if (!config) return null;

                      return (
                        <td key={columnKey} className={`py-4 px-4 ${
                          colIndex === 1 ? 'sticky left-0 z-10 bg-white dark:bg-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.1)]' : ''
                        }`}>
                          {columnKey === 'checkbox' && (
                            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedDeals.includes(deal.id)}
                                onChange={() => handleSelectDeal(deal.id)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                              />
                            </div>
                          )}
                          {columnKey === 'title' && (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{deal.title}</p>
                            </div>
                          )}
                          {columnKey === 'company' && (
                            <p className="text-sm text-gray-900 dark:text-white">{deal.company}</p>
                          )}
                          {columnKey === 'owner' && (
                            <p className="text-sm text-gray-900 dark:text-white">{deal.owner}</p>
                          )}
                          {columnKey === 'stage' && (
                            <Badge className={getStageColor(deal.stage)}>
                              {deal.stage}
                            </Badge>
                          )}
                          {columnKey === 'closeDate' && (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {formatDate(deal.closeDate)}
                              </p>
                            </div>
                          )}
                          {columnKey === 'expectedRevenue' && (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">
                                ${deal.expectedRevenue.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {columnKey === 'actualCloseRevenue' && (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {deal.actualCloseRevenue ? `$${deal.actualCloseRevenue.toLocaleString()}` : '-'}
                              </p>
                            </div>
                          )}
                          {columnKey === 'contactPerson' && (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{deal.contactPerson}</p>
                            </div>
                          )}
                          {columnKey === 'dealAge' && (
                            <div className="flex items-center justify-center">
                              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold ${getDealAgeColor(deal.convertedDate)}`}>
                                {getDealAge(deal.convertedDate)}
                              </div>
                            </div>
                          )}
                          {columnKey === 'activity' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex flex-col items-end space-y-1">
                                {/* Manual Activities */}
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Manual:</span>
                                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold">
                                    {deal.manualActivity || 0}
                                  </div>
                                </div>
                                {/* AI Activities */}
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI:</span>
                                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs font-semibold">
                                    {deal.aiActivity || 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {columnKey === 'dealScore' && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    deal.dealScore >= 90 ? 'bg-green-500' :
                                    deal.dealScore >= 80 ? 'bg-blue-500' :
                                    deal.dealScore >= 70 ? 'bg-yellow-500' :
                                    deal.dealScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${deal.dealScore || 0}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-semibold ${
                                deal.dealScore >= 90 ? 'text-green-600 dark:text-green-400' :
                                deal.dealScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                                deal.dealScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                                deal.dealScore >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {deal.dealScore || 0}
                              </span>
                            </div>
                          )}
                          {columnKey === 'winProbability' && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    deal.winProbability >= 80 ? 'bg-green-500' :
                                    deal.winProbability >= 60 ? 'bg-blue-500' :
                                    deal.winProbability >= 40 ? 'bg-yellow-500' :
                                    deal.winProbability >= 20 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${deal.winProbability || 0}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-semibold ${
                                deal.winProbability >= 80 ? 'text-green-600 dark:text-green-400' :
                                deal.winProbability >= 60 ? 'text-blue-600 dark:text-blue-400' :
                                deal.winProbability >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                                deal.winProbability >= 20 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {deal.winProbability || 0}%
                              </span>
                            </div>
                          )}
                          {columnKey === 'actions' && (
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`mailto:${deal.contactEmail || ''}`, '_blank')}
                                className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900"
                                title={`Email ${deal.contact}`}
                              >
                                <Mail className="w-4 h-4 text-purple-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`tel:${deal.contactPhone || ''}`, '_blank')}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
                                title={`Call ${deal.contact}`}
                              >
                                <Phone className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDeal(deal)}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900"
                                title="Edit deal"
                              >
                                <Edit className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDeal(deal.id)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900"
                                title="Delete deal"
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
            </table>
          </SortableTable>
        </div>
      </Card>

      {/* View Deal Modal */}
      <DealViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        deal={selectedDeal}
      />

      {/* Add/Edit Deal Form Modal */}
      <AddDealForm
        deal={editingDeal}
        isOpen={showFormModal}
        onClose={handleFormCancel}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        users={mockUsers}
        contacts={[]}
      />
    </div>
  );
};

export default Deals;
