import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  MoreVertical,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  SlidersHorizontal,
  GripVertical,
  TrendingUp,
  X
} from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table } from '../../components/ui/table';
import { SortableTable, SortableTableHead, sortData } from '../../components/ui/sortable-table';
import { Checkbox } from '../../components/ui/checkbox';
import { LeadsFilterForm } from '../../components/filters';
import { AddLeadForm } from '../../components/crm';
import { LeadViewModal } from '../../components/modals';
import { AddDealForm } from '../../components/crm';
import { formatDate } from '../../utils/formatDate';

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([
    'select', 'company', 'name', 'product', 'source', 'country', 'city', 'value', 'status', 'owner', 'addedDate', 'leadAge', 'activity', 'leadScore', 'actions'
  ]);
  const [columnOrder, setColumnOrder] = useState([
    'select', 'company', 'name', 'product', 'source', 'country', 'city', 'owner', 'status', 'addedDate', 'leadAge', 'activity', 'leadScore', 'actions'
  ]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);

  // Refs for all dropdowns
  const columnSelectorRef = useRef(null);
  const pageSizeMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Mock users data for the deal form
  const mockUsers = [
    { id: 1, fullname: 'Alice Johnson', name: 'Alice Johnson' },
    { id: 2, fullname: 'Bob Smith', name: 'Bob Smith' },
    { id: 3, fullname: 'Carol Davis', name: 'Carol Davis' },
    { id: 4, fullname: 'David Wilson', name: 'David Wilson' },
    { id: 5, fullname: 'Eva Brown', name: 'Eva Brown' },
    { id: 6, fullname: 'Frank Miller', name: 'Frank Miller' },
    { id: 7, fullname: 'Grace Lee', name: 'Grace Lee' },
    { id: 8, fullname: 'Henry Kim', name: 'Henry Kim' },
    { id: 9, fullname: 'Ivy Chen', name: 'Ivy Chen' },
  ];

  // Handle click outside to close all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close column selector dropdown
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target)) {
        setShowColumnSelector(false);
      }
      
      // Close page size menu
      if (pageSizeMenuRef.current && !pageSizeMenuRef.current.contains(event.target)) {
        setShowPageSizeMenu(false);
      }
      
      // Close export menu
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    // Add event listener if any dropdown is open
    if (showColumnSelector || showPageSizeMenu || showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSelector, showPageSizeMenu, showExportMenu]);

  // Mock leads data
  const leads = [
    {
      id: 1,
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      product: 'CRM Software',
      country: 'United States',
      city: 'New York',
      email: 'john@techsolutions.com',
      phone: '+1-555-0123',
      status: 'New',
      source: 'Website',
      value: 15000,
      leadScore: 85,
      createdDate: new Date().toISOString().split('T')[0], // Today - Blue
      lastContact: '2024-02-15',
      owner: 'Alice Johnson',
      activities: {
        manual: [
          { type: 'Email', date: '2025-09-25', description: 'Initial contact email sent' },
          { type: 'Call', date: '2025-09-24', description: 'Follow-up call made' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-23', description: 'Lead scoring and qualification analysis' }
        ]
      }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Global Enterprises',
      product: 'Marketing Automation',
      country: 'Canada',
      city: 'Toronto',
      email: 'sarah@globalent.com',
      phone: '+1-555-0456',
      status: 'Qualified',
      source: 'Referral',
      value: 25000,
      leadScore: 92,
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago - Green
      lastContact: '2024-02-16',
      owner: 'Bob Smith',
      activities: {
        manual: [
          { type: 'Call', date: '2025-09-24', description: 'Qualification call completed' },
          { type: 'Email', date: '2025-09-23', description: 'Proposal sent' },
          { type: 'Meeting', date: '2025-09-22', description: 'Technical discussion' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-21', description: 'Lead qualification and scoring' },
          { type: 'AI Recommendation', date: '2025-09-20', description: 'Next best action suggested' }
        ]
      }
    },
    {
      id: 3,
      name: 'Mike Chen',
      company: 'StartupXYZ',
      product: 'Analytics Dashboard',
      country: 'United Kingdom',
      city: 'London',
      email: 'mike@startupxyz.com',
      phone: '+1-555-0789',
      status: 'Contacted',
      source: 'Cold Call',
      value: 8500,
      leadScore: 68,
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago - Yellow
      lastContact: '2024-02-14',
      owner: 'Carol Davis',
      activities: {
        manual: [
          { type: 'Call', date: '2025-09-20', description: 'Initial cold call' },
          { type: 'Email', date: '2025-09-19', description: 'Follow-up email sent' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-18', description: 'Lead scoring and engagement analysis' }
        ]
      }
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      company: 'Digital Marketing Co.',
      product: 'Social Media Management',
      country: 'Spain',
      city: 'Madrid',
      email: 'emily@digitalmarketing.com',
      phone: '+1-555-0321',
      status: 'New',
      source: 'Social Media',
      value: 12000,
      leadScore: 74,
      createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago - Orange
      lastContact: '2024-02-12',
      owner: 'David Wilson',
      activities: {
        manual: [
          { type: 'Email', date: '2025-09-15', description: 'Initial contact via social media' },
          { type: 'Call', date: '2025-09-14', description: 'Follow-up call' },
          { type: 'Meeting', date: '2025-09-13', description: 'Discovery call scheduled' },
          { type: 'Email', date: '2025-09-12', description: 'Information package sent' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-11', description: 'Lead qualification and scoring' },
          { type: 'AI Recommendation', date: '2025-09-10', description: 'Personalized follow-up strategy' }
        ]
      }
    },
    {
      id: 5,
      name: 'Robert Taylor',
      company: 'Manufacturing Ltd.',
      product: 'ERP Software',
      country: 'Germany',
      city: 'Berlin',
      email: 'robert@manufacturing.com',
      phone: '+1-555-0654',
      status: 'Qualified',
      source: 'Trade Show',
      value: 35000,
      leadScore: 95,
      createdDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 18 days ago - Red
      lastContact: '2024-02-15',
      owner: 'Eva Brown',
      activities: {
        manual: [
          { type: 'Meeting', date: '2025-09-08', description: 'Trade show follow-up meeting' },
          { type: 'Email', date: '2025-09-07', description: 'Proposal sent' },
          { type: 'Call', date: '2025-09-06', description: 'Technical discussion call' },
          { type: 'Email', date: '2025-09-05', description: 'Pricing information sent' },
          { type: 'Meeting', date: '2025-09-04', description: 'Site visit scheduled' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-03', description: 'Lead scoring and qualification' },
          { type: 'AI Recommendation', date: '2025-09-02', description: 'Optimal pricing strategy suggested' }
        ]
      }
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      company: 'Healthcare Systems',
      product: 'Healthcare Management System',
      country: 'Australia',
      city: 'Sydney',
      email: 'lisa@healthcare.com',
      phone: '+1-555-0987',
      status: 'Contacted',
      source: 'Website',
      value: 22000,
      leadScore: 78,
      createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago - Green
      lastContact: '2024-02-14',
      owner: 'Frank Miller',
      activities: {
        manual: [
          { type: 'Email', date: '2025-09-24', description: 'Website inquiry follow-up' },
          { type: 'Call', date: '2025-09-23', description: 'Initial contact call' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-22', description: 'Lead scoring and qualification' }
        ]
      }
    },
    {
      id: 7,
      name: 'Alex Thompson',
      company: 'Finance Corp',
      product: 'Financial Analytics Platform',
      country: 'Singapore',
      city: 'Singapore',
      email: 'alex@financecorp.com',
      phone: '+1-555-1111',
      status: 'New',
      source: 'Cold Call',
      value: 18000,
      leadScore: 71,
      createdDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days ago - Yellow
      lastContact: '2024-02-14',
      owner: 'Grace Lee',
      activities: {
        manual: [
          { type: 'Call', date: '2025-09-19', description: 'Cold call made' },
          { type: 'Email', date: '2025-09-18', description: 'Follow-up email sent' },
          { type: 'Call', date: '2025-09-17', description: 'Second attempt call' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-16', description: 'Lead scoring and engagement analysis' },
          { type: 'AI Recommendation', date: '2025-09-15', description: 'Best time to call suggested' }
        ]
      }
    },
    {
      id: 8,
      name: 'Maria Garcia',
      company: 'Retail Solutions',
      product: 'E-commerce Platform',
      country: 'Mexico',
      city: 'Mexico City',
      email: 'maria@retailsolutions.com',
      phone: '+1-555-2222',
      status: 'Qualified',
      source: 'Website',
      value: 28000,
      leadScore: 88,
      createdDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days ago - Orange
      lastContact: '2024-02-15',
      owner: 'Henry Kim',
      activities: {
        manual: [
          { type: 'Email', date: '2025-09-13', description: 'Qualification email sent' },
          { type: 'Call', date: '2025-09-12', description: 'Qualification call' },
          { type: 'Meeting', date: '2025-09-11', description: 'Requirements gathering meeting' },
          { type: 'Email', date: '2025-09-10', description: 'Proposal sent' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-09-09', description: 'Lead qualification and scoring' },
          { type: 'AI Recommendation', date: '2025-09-08', description: 'Personalized proposal strategy' }
        ]
      }
    },
    {
      id: 9,
      name: 'David Wilson',
      company: 'Tech Innovations',
      product: 'AI Development Platform',
      country: 'Japan',
      city: 'Tokyo',
      email: 'david@techinnovations.com',
      phone: '+1-555-3333',
      status: 'Contacted',
      source: 'Referral',
      value: 32000,
      leadScore: 82,
      createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 20 days ago - Red
      lastContact: '2024-02-14',
      owner: 'Ivy Chen',
      activities: {
        manual: [
          { type: 'Call', date: '2025-09-05', description: 'Referral follow-up call' },
          { type: 'Email', date: '2025-09-04', description: 'Introduction email sent' },
          { type: 'Meeting', date: '2025-09-03', description: 'Initial meeting scheduled' },
          { type: 'Call', date: '2025-09-02', description: 'Technical discussion call' },
          { type: 'Email', date: '2025-09-01', description: 'Proposal sent' },
          { type: 'Meeting', date: '2025-08-31', description: 'Demo meeting' }
        ],
        ai: [
          { type: 'AI Analysis', date: '2025-08-30', description: 'Lead scoring and qualification' },
          { type: 'AI Recommendation', date: '2025-08-29', description: 'Optimal engagement strategy' }
        ]
      }
    }
  ];

  const statusOptions = ['All', 'New', 'Qualified', 'Contacted', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
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

  const getLeadAge = (createdDate) => {
    const today = new Date();
    const created = new Date(createdDate);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays.toString();
  };

  const getLeadAgeColor = (createdDate) => {
    const today = new Date();
    const created = new Date(createdDate);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'bg-blue-500'; // Today - Blue
    } else if (diffDays <= 3) {
      return 'bg-green-500'; // 1-3 days - Green
    } else if (diffDays <= 7) {
      return 'bg-yellow-500'; // 4-7 days - Yellow
    } else if (diffDays <= 14) {
      return 'bg-orange-500'; // 8-14 days - Orange
    } else {
      return 'bg-red-500'; // 15+ days - Red
    }
  };

  const getLastActivityDate = (lead) => {
    if (!lead.activities) return null;
    
    const allActivities = [
      ...(lead.activities.manual || []),
      ...(lead.activities.ai || [])
    ];
    
    if (allActivities.length === 0) return null;
    
    // Sort by date descending to get the most recent activity
    const sortedActivities = allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedActivities[0].date;
  };

  const formatLastActivityDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day}-${month}-${year}`;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    
    // Apply active filters
    let matchesFilters = true;
    
    if (activeFilters.status && lead.status !== activeFilters.status) {
      matchesFilters = false;
    }
    
    if (activeFilters.source && lead.source !== activeFilters.source) {
      matchesFilters = false;
    }
    
    if (activeFilters.owner && lead.owner !== activeFilters.owner) {
      matchesFilters = false;
    }
    
    if (activeFilters.created_date_after) {
      const leadDate = new Date(lead.createdDate);
      const filterDate = new Date(activeFilters.created_date_after);
      if (leadDate < filterDate) {
        matchesFilters = false;
      }
    }
    
    if (activeFilters.created_date_before) {
      const leadDate = new Date(lead.createdDate);
      const filterDate = new Date(activeFilters.created_date_before);
      if (leadDate > filterDate) {
        matchesFilters = false;
      }
    }
    
    if (activeFilters.company && lead.company !== activeFilters.company) {
      matchesFilters = false;
    }
    
    if (activeFilters.product && lead.product !== activeFilters.product) {
      matchesFilters = false;
    }
    
    if (activeFilters.country && lead.country !== activeFilters.country) {
      matchesFilters = false;
    }
    
    if (activeFilters.city && lead.city !== activeFilters.city) {
      matchesFilters = false;
    }
    
    if (activeFilters.leadScoreMin && lead.leadScore < parseInt(activeFilters.leadScoreMin)) {
      matchesFilters = false;
    }
    
    if (activeFilters.leadScoreMax && lead.leadScore > parseInt(activeFilters.leadScoreMax)) {
      matchesFilters = false;
    }
    
    if (activeFilters.valueMin && lead.value < parseInt(activeFilters.valueMin)) {
      matchesFilters = false;
    }
    
    if (activeFilters.valueMax && lead.value > parseInt(activeFilters.valueMax)) {
      matchesFilters = false;
    }
    
    return matchesSearch && matchesStatus && matchesFilters;
  });

  // Sort the filtered leads
  const sortedLeads = sortData(filteredLeads, sortConfig);

  // Handle sorting
  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Action handlers
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleEditLead = (lead) => {
    console.log('Edit lead:', lead);
    // TODO: Implement edit lead modal
  };

  const handleDeleteLead = (leadId) => {
    console.log('Delete lead:', leadId);
    // TODO: Implement delete lead confirmation
  };

  // Search bar container handlers
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    // TODO: Implement refresh functionality
  };

  const handleExport = (format) => {
    console.log(`Exporting leads to ${format}...`);
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
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedLeads(sortedLeads.map(lead => lead.id));
      setIsAllSelected(true);
    } else {
      setSelectedLeads([]);
      setIsAllSelected(false);
    }
  };

  // Calculate if select all should be indeterminate
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < sortedLeads.length;

  const handleSelectLead = (leadId) => (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newSelected = [...selectedLeads, leadId];
      setSelectedLeads(newSelected);
      // Check if all visible leads are now selected
      setIsAllSelected(newSelected.length === sortedLeads.length);
    } else {
      const newSelected = selectedLeads.filter(id => id !== leadId);
      setSelectedLeads(newSelected);
      setIsAllSelected(false);
    }
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete selected leads:', selectedLeads);
    // TODO: Implement bulk delete functionality
  };

  const handleBulkStatusChange = () => {
    setShowBulkStatusModal(true);
  };

  const handleBulkStatusUpdate = (newStatus) => {
    console.log('Bulk status update:', { selectedLeads, newStatus });
    // TODO: Implement bulk status update functionality
    setShowBulkStatusModal(false);
    setSelectedLeads([]);
    setIsAllSelected(false);
  };

  // Handle filter application
  const handleFilter = (filterParams) => {
    setActiveFilters(filterParams);
  };

  // Handle filter clear
  const handleClearFilters = () => {
    setActiveFilters({});
  };

  // Handle add lead form submission
  const handleAddLead = (leadData) => {
    console.log('Adding new lead:', leadData);
    // TODO: Implement API call to add lead
    setShowAddLeadModal(false);
  };

  // Handle convert lead to deal
  const handleConvertLead = (lead) => {
    setLeadToConvert(lead);
    setShowConvertModal(true);
  };

  // Handle deal form submission
  const handleConvertDeal = async (dealData) => {
    setConvertLoading(true);
    
    try {
      console.log('Converting lead to deal:', { 
        originalLead: leadToConvert, 
        dealData: dealData,
        conversionDetails: {
          leadId: leadToConvert?.id,
          leadName: leadToConvert?.name,
          company: leadToConvert?.company,
          dealName: dealData.dealname,
          dealValue: dealData.dealvalue,
          dealStage: dealData.dealstage
        }
      });
      
      // TODO: Implement API call to convert lead to deal
      // Example API call structure:
      // const response = await fetch('/api/leads/convert-to-deal', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     leadId: leadToConvert.id,
      //     dealData: dealData
      //   })
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowConvertModal(false);
      setLeadToConvert(null);
      
      // TODO: Show success toast
      // toast.success(`Successfully converted lead "${leadToConvert.name}" to deal "${dealData.dealname}"`);
      
      // TODO: Refresh leads list or update lead status
      console.log(`Lead "${leadToConvert.name}" successfully converted to deal "${dealData.dealname}"`);
    } catch (error) {
      console.error('Error converting lead to deal:', error);
      // TODO: Show error toast
      // toast.error('Failed to convert lead to deal');
    } finally {
      setConvertLoading(false);
    }
  };

  // Handle convert modal cancel
  const handleConvertCancel = () => {
    setShowConvertModal(false);
    setLeadToConvert(null);
    setConvertLoading(false);
  };

  // Column configuration
  const columnConfig = {
    select: { label: '', sortable: false },
    name: { label: 'Name', sortKey: 'name' },
    company: { label: 'Company', sortKey: 'company' },
    product: { label: 'Product', sortKey: 'product' },
    source: { label: 'Source', sortKey: 'source' },
    country: { label: 'Country', sortKey: 'country' },
    city: { label: 'City', sortKey: 'city' },
    owner: { label: 'Owner', sortKey: 'owner' },
    status: { label: 'Status', sortKey: 'status' },
    leadScore: { label: 'Lead Score', sortKey: 'leadScore' },
    addedDate: { label: 'Created Date', sortKey: 'createdDate' },
    leadAge: { label: 'Age (Days)', sortKey: 'createdDate' },
    activity: { label: 'Activity', sortable: false },
    actions: { label: 'Actions', sortable: false }
  };

  return (
    <div className="pt-3 px-6 pb-6 space-y-4">
      {/* Header with Stats Cards and Add Lead Button */}
      <div className="flex items-center justify-between">
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 flex-1 mr-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Qualified</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.status === 'Qualified').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.status === 'New').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contacted</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.status === 'Contacted').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.status === 'New' || lead.status === 'Qualified' || lead.status === 'Contacted').length}
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* Add Lead Button */}
        <Button size="lg" onClick={() => setShowAddLeadModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
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
                <span>{selectedColumns.filter(col => col !== 'select' && col !== 'actions').length} Columns</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {/* Column Selector Dropdown Menu */}
              {showColumnSelector && (
                <div ref={columnSelectorRef} className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Select Columns
                    </div>
                    
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
                        checked={selectedColumns.includes('name')}
                        onChange={() => toggleColumn('name')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('product')}
                        onChange={() => toggleColumn('product')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Product</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('source')}
                        onChange={() => toggleColumn('source')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Source</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('country')}
                        onChange={() => toggleColumn('country')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Country</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('city')}
                        onChange={() => toggleColumn('city')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">City</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('value')}
                        onChange={() => toggleColumn('value')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Value</span>
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
                        checked={selectedColumns.includes('leadScore')}
                        onChange={() => toggleColumn('leadScore')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Lead Score</span>
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
                        checked={selectedColumns.includes('addedDate')}
                        onChange={() => toggleColumn('addedDate')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Created Date</span>
                    </label>
                    
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes('leadAge')}
                        onChange={() => toggleColumn('leadAge')}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Age (Days)</span>
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
                <span>{pageSize === 1000 ? 'All' : `${pageSize} per page`}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {/* Page Size Dropdown Menu */}
              {showPageSizeMenu && (
                <div ref={pageSizeMenuRef} className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
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
                <div ref={exportMenuRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
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
              placeholder="Search leads by name, company, email, phone, status, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 w-80"
            />
          </div>
        </div>

        {/* Filter Form */}
        {showFilters && (
          <LeadsFilterForm
            onFilter={handleFilter}
            onClear={handleClearFilters}
            loading={false}
          />
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
           className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
              </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLeads([]);
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
                onClick={handleBulkStatusChange}
                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400 px-3 py-1.5"
              >
                <Edit className="w-4 h-4 mr-2" />
                Change Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                 className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2 text-white" />
                Move to Trash
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Status Change Modal */}
      {showBulkStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Status for {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select a new status for the selected leads.
            </p>
            <div className="space-y-3 mb-6">
              {statusOptions.filter(status => status !== 'All').map((status) => (
                <button
                  key={status}
                  onClick={() => handleBulkStatusUpdate(status)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">{status}</span>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowBulkStatusModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <Card className="overflow-hidden">
        <div className="overflow-auto max-h-[70vh] pr-2 pb-2 relative">
          <SortableTable data={sortedLeads} onSort={handleSort} defaultSortKey="createdDate" defaultSortDirection="desc">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {columnOrder.filter(columnKey => selectedColumns.includes(columnKey)).map((columnKey, colIndex) => {
                    const config = columnConfig[columnKey];
                    if (!config) return null;
                    
                    // Special handling for select/checkbox column
                    if (columnKey === 'select') {
                      return (
                        <th key={columnKey} className={`py-4 px-4 w-12 ${
                          colIndex === 1 ? 'sticky left-0 z-30 bg-white dark:bg-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.1)]' : ''
                        }`}>
                          <div className="flex items-center justify-center">
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
                        </th>
                      );
                    }
                    
                    return (
                      <SortableTableHead
                        key={columnKey}
                        sortKey={config.sortKey}
                        sortable={config.sortable !== false}
                        draggable={columnKey !== 'select'}
                        onDragStart={(e) => handleDragStart(e, columnKey)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, columnKey)}
                        onDragEnd={handleDragEnd}
                        onMouseEnter={() => setHoveredColumn(columnKey)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        className={`select-none transition-all duration-200 ${
                          draggedColumn === columnKey ? 'opacity-50' : ''
                        } ${
                          hoveredColumn === columnKey && columnKey !== 'select' ? 'cursor-move' : 'cursor-default'
                        } ${
                          colIndex === 1 ? 'sticky left-0 z-10 bg-white dark:bg-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.1)]' : ''
                        }`}
                        
                      >
                        <div className="flex items-center space-x-2 relative">
                          {columnKey === 'select' ? (
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
                  {sortedLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleViewLead(lead)}
                  >
                    {columnOrder.filter(columnKey => selectedColumns.includes(columnKey)).map((columnKey, colIndex) => {
                      const config = columnConfig[columnKey];
                      if (!config) return null;

                      return (
                        <td key={columnKey} className={`py-4 px-4 align-top ${
                          colIndex === 1 ? 'sticky left-0 z-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''
                        }`}>
                          {columnKey === 'select' && (
                            <div className="flex items-center justify-center w-full" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedLeads.includes(lead.id)}
                                onChange={handleSelectLead(lead.id)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </div>
                          )}
                          {columnKey === 'name' && (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{lead.name}</p>
                            </div>
                          )}
                          {columnKey === 'company' && (
                            <p className="text-sm text-gray-900 dark:text-white">{lead.company}</p>
                          )}
                          {columnKey === 'product' && (
                            <p className="text-sm text-gray-900 dark:text-white">{lead.product}</p>
                          )}
                          {columnKey === 'source' && (
                            <p className="text-sm text-gray-900 dark:text-white">{lead.source || 'N/A'}</p>
                          )}
                          {columnKey === 'country' && (
                            <p className="text-sm text-gray-900 dark:text-white">{lead.country || 'N/A'}</p>
                          )}
                          {columnKey === 'city' && (
                            <p className="text-sm text-gray-900 dark:text-white">{lead.city || 'N/A'}</p>
                          )}
                          {columnKey === 'owner' && (
                            <p className="text-sm text-gray-900 dark:text-white">{lead.owner}</p>
                          )}
                          {columnKey === 'status' && (
                            <div className="space-y-2">
                              <Badge className={getStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                              {getLastActivityDate(lead) && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <div>Last Activity:</div>
                                  <div>{formatLastActivityDate(getLastActivityDate(lead))}</div>
                                </div>
                              )}
                            </div>
                          )}
                          {columnKey === 'leadScore' && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    lead.leadScore >= 90 ? 'bg-green-500' :
                                    lead.leadScore >= 80 ? 'bg-blue-500' :
                                    lead.leadScore >= 70 ? 'bg-yellow-500' :
                                    lead.leadScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${lead.leadScore || 0}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-semibold ${
                                lead.leadScore >= 90 ? 'text-green-600 dark:text-green-400' :
                                lead.leadScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                                lead.leadScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                                lead.leadScore >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {lead.leadScore || 0}
                              </span>
                            </div>
                          )}
                          {columnKey === 'addedDate' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div className="font-medium">
                                {formatDate(lead.createdDate)}
                              </div>
                            </div>
                          )}
                          {columnKey === 'leadAge' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center justify-center">
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold ${getLeadAgeColor(lead.createdDate)}`}>
                                  {getLeadAge(lead.createdDate)}
                                </div>
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
                                    {lead.activities?.manual?.length || 0}
                                  </div>
                                </div>
                                {/* AI Activities */}
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI:</span>
                                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs font-semibold">
                                    {lead.activities?.ai?.length || 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {columnKey === 'actions' && (
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              {lead.status === 'Qualified' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConvertLead(lead)}
                                  className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900"
                                  title="Convert to Deal"
                                >
                                  <TrendingUp className="w-4 h-4 text-purple-600" />
                                </Button>
                              ) : (
                                <div className="w-8 h-8"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditLead(lead)}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900"
                                title="Edit lead"
                              >
                                <Edit className="w-4 h-4 text-green-600" />
                              </Button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${lead.email}`, '_blank');
                                }}
                                className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title={`Send email to ${lead.email}`}
                              >
                                <Mail className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`tel:${lead.phone}`, '_blank');
                                }}
                                className="p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                title={`Call ${lead.phone}`}
                              >
                                <Phone className="w-4 h-4 text-green-500 hover:text-green-600" />
                              </button>
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

      {/* Add Lead Modal */}
      <AddLeadForm
        isOpen={showAddLeadModal}
        onClose={() => setShowAddLeadModal(false)}
        onSubmit={handleAddLead}
      />

      {/* View Lead Modal */}
      <LeadViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        lead={selectedLead}
      />

      {/* Convert Lead to Deal Modal */}
      <AddDealForm
        isConverting={true}
        isOpen={showConvertModal}
        onClose={handleConvertCancel}
        onSubmit={handleConvertDeal}
        loading={convertLoading}
        users={mockUsers}
        contacts={[]}
        deal={leadToConvert ? {
          // Deal Information
          dealname: `${leadToConvert.company} - ${leadToConvert.product || 'Deal'}`,
          dealownerid: mockUsers.find(user => user.name === leadToConvert.owner)?.id || mockUsers[0]?.id,
          dealstage: leadToConvert.status === 'Qualified' ? 'Qualification' : 'Prospect',
          dealvalue: leadToConvert.value?.toString() || '',
          discountvalue: '',
          finaldealvalue: '',
          mrr: leadToConvert.product?.includes('SaaS') || leadToConvert.product?.includes('Software') ? Math.round(leadToConvert.value / 12).toString() : '',
          arr: leadToConvert.product?.includes('SaaS') || leadToConvert.product?.includes('Software') ? leadToConvert.value?.toString() : '',
          revenuetype: leadToConvert.product?.includes('SaaS') || leadToConvert.product?.includes('Software') ? 'Recurring' : 'One-time',
          expectedclosedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          actualclosedate: '',
          probability: Math.min(Math.max(Math.floor(leadToConvert.leadScore || 50), 10), 100),
          dealtype: 'New',
          leadsource: leadToConvert.source || '',
          attachments: null,
          engagementscore: leadToConvert.leadScore?.toString() || '50',
          dealhealthindicator: leadToConvert.leadScore >= 80 ? 'Green' : leadToConvert.leadScore >= 60 ? 'Yellow' : 'Red',
          dealstatus: 'Open',
          dealcreateddate: new Date().toISOString().split('T')[0],
          
          // Customer Information
          customername: leadToConvert.name,
          customeremail: leadToConvert.email,
          customerphone: leadToConvert.phone,
          customercompany: leadToConvert.company,
          customeraddress: `${leadToConvert.city}, ${leadToConvert.country}`,
          customercity: leadToConvert.city,
          customercountry: leadToConvert.country,
          customerdesignation: 'Decision Maker',
          customerwebsite: leadToConvert.company ? `https://www.${leadToConvert.company.toLowerCase().replace(/\s+/g, '')}.com` : '',
          
          // Additional Lead Details
          nextstep: leadToConvert.status === 'Qualified' ? 'Schedule demo call' : 'Initial qualification call',
          comments: '',
          
          // Deal Context
          dealcontext: `Lead created on ${leadToConvert.createdDate} and last contacted on ${leadToConvert.lastContact}`,
          competitiveadvantage: '',
          risksandchallenges: '',
          decisioncriteria: '',
          budgetconfirmation: leadToConvert.value ? 'Confirmed' : 'To be confirmed',
          decisiontimeline: '30 days',
          stakeholderinformation: leadToConvert.name
        } : null}
      />
    </div>
  );
};

export default Leads;
