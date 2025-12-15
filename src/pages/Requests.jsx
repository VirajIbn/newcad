import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Search, Clock, User, Calendar, AlertCircle, CheckCircle, XCircle, Download, RefreshCw, ChevronDown, ChevronUp, ChevronsUpDown, X, SlidersHorizontal } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { SortableTable, SortableTableHead } from '../components/ui/sortable-table';

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortField, setSortField] = useState('submittedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'srno', 'title', 'requester', 'department', 'type', 'priority', 'status', 'submittedDate', 'estimatedCost', 'actions'
  ]);

  const sortConfig = { key: sortField, direction: sortDirection };

  // Column definitions for table
  const columnDefinitions = {
    srno: { label: 'Sr No', sortable: false },
    title: { label: 'Title', sortable: true },
    requester: { label: 'Requester', sortable: true },
    department: { label: 'Department', sortable: true },
    type: { label: 'Type', sortable: true },
    priority: { label: 'Priority', sortable: true },
    status: { label: 'Status', sortable: true },
    submittedDate: { label: 'Submitted Date', sortable: true },
    estimatedCost: { label: 'Estimated Cost', sortable: true },
    actions: { label: 'Actions', sortable: false }
  };

  const requests = [
    {
      id: 1,
      title: 'New Laptop Request',
      requester: 'John Smith',
      department: 'IT',
      type: 'Hardware',
      priority: 'High',
      status: 'Pending',
      submittedDate: '2024-01-15',
      description: 'Need a new laptop for software development work. Current laptop is 5 years old and running slowly.',
      estimatedCost: '₹1,200',
    },
    {
      id: 2,
      title: 'Software License Renewal',
      requester: 'Sarah Johnson',
      department: 'Marketing',
      type: 'Software',
      priority: 'Medium',
      status: 'Approved',
      submittedDate: '2024-01-12',
      description: 'Adobe Creative Suite license needs renewal for the marketing team.',
      estimatedCost: '₹2,400',
    },
    {
      id: 3,
      title: 'Office Furniture',
      requester: 'Michael Chen',
      department: 'Sales',
      type: 'Furniture',
      priority: 'Low',
      status: 'Rejected',
      submittedDate: '2024-01-10',
      description: 'New ergonomic chairs for the sales team office.',
      estimatedCost: '₹800',
    },
    {
      id: 4,
      title: 'Server Maintenance',
      requester: 'David Wilson',
      department: 'IT',
      type: 'Maintenance',
      priority: 'High',
      status: 'In Progress',
      submittedDate: '2024-01-08',
      description: 'Annual server maintenance and security updates.',
      estimatedCost: '₹3,500',
    },
    {
      id: 5,
      title: 'Training Program',
      requester: 'Emily Davis',
      department: 'HR',
      type: 'Training',
      priority: 'Medium',
      status: 'Pending',
      submittedDate: '2024-01-14',
      description: 'Leadership training program for middle management.',
      estimatedCost: '₹5,000',
    },
    {
      id: 6,
      title: 'Network Equipment',
      requester: 'Lisa Brown',
      department: 'IT',
      type: 'Hardware',
      priority: 'High',
      status: 'Approved',
      submittedDate: '2024-01-11',
      description: 'New network switches for improved connectivity.',
      estimatedCost: '₹4,200',
    },
  ];

  // Filter and sort requests
  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRequests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRequests = sortedRequests.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = useCallback((sortConfig) => {
    setSortField(sortConfig.key);
    setSortDirection(sortConfig.direction);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  // Toggle column visibility
  const toggleColumn = useCallback((columnKey) => {
    if (columnKey === 'srno' || columnKey === 'title') {
      return; // Don't allow hiding required columns
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        const nonRequiredColumns = prev.filter(col => col !== 'srno' && col !== 'title');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev; // Don't allow hiding the last non-required column
        }
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400';
      case 'Approved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400';
      case 'Rejected':
        return 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'In Progress':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <Button icon={Plus} variant="primary">
          New Request
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-medium transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-primary-500">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {request.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {request.description}
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{request.requester}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {request.submittedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Cost: {request.estimatedCost}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Requests; 