import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, ChevronDown, RefreshCw, Download, SlidersHorizontal } from 'lucide-react';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Table } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import CampaignForm from '../../components/forms/CampaignForm';
import { CampaignViewModal } from '../../components/modals';
import { CampaignFilterForm } from '../../components/filters';
import { SortableTable, SortableTableHead, sortData } from '../../components/ui/sortable-table';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';

const Campaign = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedColumns, setSelectedColumns] = useState([
    'select', 'name', 'type', 'status', 'budget', 'spent', 'leads', 'conversions', 'conversionRate', 'targetAudience', 'createdBy', 'startDate', 'endDate', 'actions'
  ]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Refs for dropdowns
  const columnSelectorRef = useRef(null);
  const pageSizeMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Handle click outside to close all dropdowns
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

  // Sample campaign data
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Summer Sale 2024',
      type: 'email',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      budget: 50000,
      spent: 32500,
      targetAudience: 'Existing Customers',
      leads: 1250,
      conversions: 89,
      conversionRate: 7.12,
      createdBy: 'John Smith',
      createdAt: '2024-05-15',
      description: 'Promotional email campaign for summer products'
    },
    {
      id: 2,
      name: 'New Product Launch',
      type: 'google_ads',
      status: 'completed',
      startDate: '2024-04-01',
      endDate: '2024-05-15',
      budget: 75000,
      spent: 74200,
      targetAudience: 'Tech Enthusiasts',
      leads: 2100,
      conversions: 156,
      conversionRate: 7.43,
      createdBy: 'Sarah Johnson',
      createdAt: '2024-03-20',
      description: 'Google Ads campaign for new product launch'
    },
    {
      id: 3,
      name: 'LinkedIn B2B Outreach',
      type: 'linkedin',
      status: 'active',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      budget: 30000,
      spent: 18200,
      targetAudience: 'Business Professionals',
      leads: 890,
      conversions: 67,
      conversionRate: 7.53,
      createdBy: 'Mike Chen',
      createdAt: '2024-06-25',
      description: 'LinkedIn sponsored content for B2B lead generation'
    },
    {
      id: 4,
      name: 'Holiday Special Offer',
      type: 'facebook_ads',
      status: 'draft',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      budget: 40000,
      spent: 0,
      targetAudience: 'General Audience',
      leads: 0,
      conversions: 0,
      conversionRate: 0,
      createdBy: 'Emily Davis',
      createdAt: '2024-11-15',
      description: 'Holiday season promotional campaign'
    },
    {
      id: 5,
      name: 'Webinar Series',
      type: 'event',
      status: 'active',
      startDate: '2024-08-01',
      endDate: '2024-10-31',
      budget: 25000,
      spent: 15750,
      targetAudience: 'Industry Professionals',
      leads: 650,
      conversions: 45,
      conversionRate: 6.92,
      createdBy: 'David Wilson',
      createdAt: '2024-07-20',
      description: 'Educational webinar series for lead generation'
    },
    {
      id: 6,
      name: 'SMS Follow-up',
      type: 'sms',
      status: 'paused',
      startDate: '2024-06-15',
      endDate: '2024-08-15',
      budget: 15000,
      spent: 8900,
      targetAudience: 'Existing Leads',
      leads: 420,
      conversions: 28,
      conversionRate: 6.67,
      createdBy: 'Lisa Anderson',
      createdAt: '2024-06-01',
      description: 'SMS follow-up campaign for warm leads'
    },
    {
      id: 7,
      name: 'Referral Program',
      type: 'referral',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 60000,
      spent: 45600,
      targetAudience: 'Existing Customers',
      leads: 3200,
      conversions: 234,
      conversionRate: 7.31,
      createdBy: 'Robert Taylor',
      createdAt: '2023-12-15',
      description: 'Customer referral incentive program'
    },
    {
      id: 8,
      name: 'SEO Content Campaign',
      type: 'seo',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      budget: 35000,
      spent: 23100,
      targetAudience: 'Search Users',
      leads: 1850,
      conversions: 98,
      conversionRate: 5.30,
      createdBy: 'Jennifer Brown',
      createdAt: '2024-02-20',
      description: 'Long-term SEO content marketing strategy'
    }
  ]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleRefresh = () => {
    // Add refresh logic here
    console.log('Refreshing campaigns...');
  };

  const handleExport = (format) => {
    // Add export logic here
    console.log(`Exporting campaigns to ${format}...`);
  };

  const handleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    setShowCampaignForm(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowCampaignForm(true);
  };

  const handleCloseCampaignForm = () => {
    setShowCampaignForm(false);
    setEditingCampaign(null);
  };

  const handleCampaignSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Submitting campaign:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingCampaign) {
        // Update existing campaign
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === editingCampaign.id 
            ? { ...campaign, ...formData }
            : campaign
        ));
        toast.success('Campaign updated successfully!');
      } else {
        // Add new campaign
        const newCampaign = {
          id: Math.max(...campaigns.map(c => c.id)) + 1,
          ...formData,
          leads: 0,
          conversions: 0,
          conversionRate: 0
        };
        setCampaigns(prev => [...prev, newCampaign]);
        toast.success('Campaign created successfully!');
      }
      
      setShowCampaignForm(false);
      setEditingCampaign(null);
    } catch (error) {
      console.error('Error submitting campaign:', error);
      toast.error('Failed to save campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCampaign = (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
      toast.success('Campaign deleted successfully!');
    }
  };

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  // Filter campaigns based on search term and active filters
  const filteredCampaigns = campaigns.filter(campaign => {
    // Search term filter
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply active filters
    let matchesFilters = true;
    
    if (activeFilters.status && campaign.status !== activeFilters.status) {
      matchesFilters = false;
    }
    
    if (activeFilters.type && campaign.type !== activeFilters.type) {
      matchesFilters = false;
    }
    
    if (activeFilters.createdBy && campaign.createdBy !== activeFilters.createdBy) {
      matchesFilters = false;
    }
    
    if (activeFilters.targetAudience && campaign.targetAudience !== activeFilters.targetAudience) {
      matchesFilters = false;
    }
    
    if (activeFilters.fromDate) {
      const campaignDate = new Date(campaign.startDate);
      const filterDate = new Date(activeFilters.fromDate);
      if (campaignDate < filterDate) {
        matchesFilters = false;
      }
    }
    
    if (activeFilters.toDate) {
      const campaignDate = new Date(campaign.startDate);
      const filterDate = new Date(activeFilters.toDate);
      if (campaignDate > filterDate) {
        matchesFilters = false;
      }
    }
    
    if (activeFilters.budgetMin && campaign.budget < parseInt(activeFilters.budgetMin)) {
      matchesFilters = false;
    }
    
    if (activeFilters.budgetMax && campaign.budget > parseInt(activeFilters.budgetMax)) {
      matchesFilters = false;
    }
    
    if (activeFilters.spentMin && campaign.spent < parseInt(activeFilters.spentMin)) {
      matchesFilters = false;
    }
    
    if (activeFilters.spentMax && campaign.spent > parseInt(activeFilters.spentMax)) {
      matchesFilters = false;
    }
    
    if (activeFilters.leadsMin && campaign.leads < parseInt(activeFilters.leadsMin)) {
      matchesFilters = false;
    }
    
    if (activeFilters.leadsMax && campaign.leads > parseInt(activeFilters.leadsMax)) {
      matchesFilters = false;
    }
    
    if (activeFilters.conversionRateMin && campaign.conversionRate < parseFloat(activeFilters.conversionRateMin)) {
      matchesFilters = false;
    }
    
    if (activeFilters.conversionRateMax && campaign.conversionRate > parseFloat(activeFilters.conversionRateMax)) {
      matchesFilters = false;
    }
    
    return matchesSearch && matchesFilters;
  });

  // Sort the filtered campaigns
  const sortedCampaigns = sortData(filteredCampaigns, sortConfig);

  // Handle sorting
  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Get campaign type label
  const getCampaignTypeLabel = (type) => {
    const typeMap = {
      'email': 'Email Campaign',
      'sms': 'SMS Campaign',
      'telecalling': 'Telecalling',
      'whatsapp': 'WhatsApp Campaign',
      'event': 'Event / Webinar',
      'google_ads': 'Paid Ads – Google',
      'facebook_ads': 'Paid Ads – Facebook',
      'instagram_ads': 'Paid Ads – Instagram',
      'linkedin': 'LinkedIn Campaign',
      'referral': 'Referral Campaign',
      'organic_social': 'Organic Social Media',
      'seo': 'Inbound / SEO Campaign'
    };
    return typeMap[type] || type;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Column configuration
  const columnConfig = {
    select: { label: '', sortable: false },
    name: { label: 'Campaign Name', sortKey: 'name' },
    type: { label: 'Type', sortKey: 'type' },
    status: { label: 'Status', sortKey: 'status' },
    budget: { label: 'Budget', sortKey: 'budget' },
    spent: { label: 'Spent', sortKey: 'spent' },
    leads: { label: 'Leads', sortKey: 'leads' },
    conversions: { label: 'Conversions', sortKey: 'conversions' },
    conversionRate: { label: 'Conversion Rate', sortKey: 'conversionRate' },
    targetAudience: { label: 'Target Audience', sortKey: 'targetAudience' },
    createdBy: { label: 'Created By', sortKey: 'createdBy' },
    startDate: { label: 'Start Date', sortKey: 'startDate' },
    endDate: { label: 'End Date', sortKey: 'endDate' },
    actions: { label: 'Actions', sortable: false }
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Handle page size change
  const handleChangePageSize = (newPageSize) => {
    setItemsPerPage(newPageSize);
  };

  // Checkbox handlers
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedCampaigns(sortedCampaigns.map(campaign => campaign.id));
      setIsAllSelected(true);
    } else {
      setSelectedCampaigns([]);
      setIsAllSelected(false);
    }
  };

  // Calculate if select all should be indeterminate
  const isIndeterminate = selectedCampaigns.length > 0 && selectedCampaigns.length < sortedCampaigns.length;

  const handleSelectCampaign = (campaignId) => (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newSelected = [...selectedCampaigns, campaignId];
      setSelectedCampaigns(newSelected);
      // Check if all visible campaigns are now selected
      setIsAllSelected(newSelected.length === sortedCampaigns.length);
    } else {
      const newSelected = selectedCampaigns.filter(id => id !== campaignId);
      setSelectedCampaigns(newSelected);
      setIsAllSelected(false);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCampaigns.length} campaign(s)?`)) {
      setCampaigns(prev => prev.filter(campaign => !selectedCampaigns.includes(campaign.id)));
      setSelectedCampaigns([]);
      setIsAllSelected(false);
      toast.success(`${selectedCampaigns.length} campaign(s) deleted successfully!`);
    }
  };

  // Handle filter application
  const handleFilter = (filterParams) => {
    setActiveFilters(filterParams);
  };

  // Handle filter clear
  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="pt-3 px-6 pb-6 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
          </div>
          <Button icon={Plus} onClick={handleAddCampaign}>
            Add Campaign
          </Button>
        </div>
      </motion.div>

      {/* Controls Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Left: Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Column Selector */}
              <div className="relative" ref={columnSelectorRef}>
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
                      
                      {Object.entries(columnConfig).map(([columnKey, config]) => (
                        <label key={columnKey} className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedColumns.includes(columnKey)}
                            onChange={() => toggleColumn(columnKey)}
                            className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{config.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Page Size Dropdown */}
              <div className="relative" ref={pageSizeMenuRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPageSizeMenu(!showPageSizeMenu)}
                  className="flex items-center space-x-2"
                >
                  <span>{itemsPerPage === 1000 ? 'All' : `${itemsPerPage} per page`}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {/* Page Size Dropdown Menu */}
                {showPageSizeMenu && (
                  <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {[10, 20, 50, 1000].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            handleChangePageSize(num);
                            setShowPageSizeMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                            itemsPerPage === num ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span>{num === 1000 ? 'All' : `${num} per page`}</span>
                          {itemsPerPage === num && <span className="text-blue-600">✓</span>}
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
                onClick={handleRefresh}
              >
                Refresh
              </Button>

              {/* Export Dropdown */}
              <div className="relative" ref={exportMenuRef}>
                <Button
                  variant="outline"
                  icon={Download}
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center space-x-2"
                >
                  Export
                  <ChevronDown className="w-4 h-4" />
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
                onClick={handleFilters}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                {Object.keys(activeFilters).length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Right: Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search campaigns by name, status, type..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 w-80"
              />
            </div>
        </div>
      </motion.div>

      {/* Filter Form */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CampaignFilterForm
            onFilter={handleFilter}
            onClear={handleClearFilters}
            loading={false}
          />
        </motion.div>
      )}

      {/* Bulk Actions Bar */}
      {selectedCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCampaigns([]);
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
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2 text-white" />
                Delete Selected
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-auto max-h-[70vh] pr-2 pb-2">
            <SortableTable data={sortedCampaigns} onSort={handleSort} defaultSortKey="createdAt" defaultSortDirection="desc">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {selectedColumns.map((columnKey) => {
                      const config = columnConfig[columnKey];
                      if (!config) return null;
                      
                      return (
                        <SortableTableHead
                          key={columnKey}
                          sortKey={config.sortKey}
                          sortable={config.sortable !== false}
                          className="select-none transition-all duration-200"
                        >
                          <div className="flex items-center space-x-2 relative">
                            {columnKey === 'select' ? (
                              <div className="flex items-center justify-center w-full">
                                <Checkbox
                                  checked={isAllSelected}
                                  ref={(el) => {
                                    if (el) {
                                      el.indeterminate = isIndeterminate;
                                    }
                                  }}
                                  onChange={handleSelectAll}
                                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                              </div>
                            ) : (
                              <span>{config.label}</span>
                            )}
                          </div>
                        </SortableTableHead>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={selectedColumns.length} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        No campaigns found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    sortedCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => handleViewCampaign(campaign)}>
                        {selectedColumns.map((columnKey) => {
                          const config = columnConfig[columnKey];
                          if (!config) return null;

                          return (
                            <td key={columnKey} className="py-4 px-4 align-top">
                              {columnKey === 'select' && (
                                <div className="flex items-center justify-center w-full" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    checked={selectedCampaigns.includes(campaign.id)}
                                    onChange={handleSelectCampaign(campaign.id)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                </div>
                              )}
                              {columnKey === 'name' && (
                                <p className="text-sm text-gray-900 dark:text-white">{campaign.name}</p>
                              )}
                              {columnKey === 'type' && (
                                <p className="text-sm text-gray-900 dark:text-white">{getCampaignTypeLabel(campaign.type)}</p>
                              )}
                              {columnKey === 'status' && (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </span>
                              )}
                              {columnKey === 'budget' && (
                                <p className="text-sm text-gray-900 dark:text-white">₹{campaign.budget.toLocaleString()}</p>
                              )}
                              {columnKey === 'spent' && (
                                <p className="text-sm text-gray-900 dark:text-white">₹{campaign.spent.toLocaleString()}</p>
                              )}
                              {columnKey === 'leads' && (
                                <p className="text-sm text-gray-900 dark:text-white">{campaign.leads.toLocaleString()}</p>
                              )}
                              {columnKey === 'conversions' && (
                                <p className="text-sm text-gray-900 dark:text-white">{campaign.conversions.toLocaleString()}</p>
                              )}
                              {columnKey === 'conversionRate' && (
                                <p className="text-sm text-gray-900 dark:text-white">{campaign.conversionRate.toFixed(2)}%</p>
                              )}
                              {columnKey === 'targetAudience' && (
                                <p className="text-sm text-gray-900 dark:text-white">{campaign.targetAudience}</p>
                              )}
                              {columnKey === 'createdBy' && (
                                <p className="text-sm text-gray-900 dark:text-white">{campaign.createdBy}</p>
                              )}
                              {columnKey === 'startDate' && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  <div>
                                    {formatDate(campaign.startDate)}
                                  </div>
                                </div>
                              )}
                              {columnKey === 'endDate' && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  <div>
                                    {formatDate(campaign.endDate)}
                                  </div>
                                </div>
                              )}
                              {columnKey === 'actions' && (
                                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCampaign(campaign)}
                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900"
                                    title="Edit campaign"
                                  >
                                    <Edit className="w-4 h-4 text-green-600" />
                                  </Button>
                                </div>
                              )}
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
      </motion.div>

      {/* Campaign Form Modal */}
      {showCampaignForm && (
        <CampaignForm
          campaign={editingCampaign}
          onSubmit={handleCampaignSubmit}
          onCancel={handleCloseCampaignForm}
          loading={isSubmitting}
        />
      )}

      {/* Campaign View Modal */}
      <CampaignViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default Campaign;
