import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  Mail,
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
import { toast } from 'react-toastify';

const EmailMaster = () => {
  // Email action types
  const emailActionTypes = [
    { value: 'lead_remark_changed', label: 'Lead Remark Changed' },
    { value: 'lead_status_changed', label: 'Lead Status Changed' },
    { value: 'new_lead_created', label: 'New Lead Created' },
    { value: 'lead_assigned', label: 'Lead Assigned' },
    { value: 'deal_won', label: 'Deal Won' },
    { value: 'deal_lost', label: 'Deal Lost' },
    { value: 'follow_up_reminder', label: 'Follow-up Reminder' },
    { value: 'opportunity_created', label: 'Opportunity Created' },
    { value: 'asset_maintenance', label: 'Asset Maintenance Due' },
    { value: 'user_registration', label: 'User Registration' },
    { value: 'password_reset', label: 'Password Reset' },
    { value: 'general_notification', label: 'General Notification' }
  ];

  // Mock data for email templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      emailid: 1,
      templatename: 'Welcome Email',
      subject: 'Welcome to Our Platform',
      description: 'Sent to new users upon registration',
      emailbody: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
      emailactiontype: 'user_registration',
      leadremarkchangeemail: 'admin@example.com',
      isactive: 1,
      isdeleted: 0,
      addeddate: '2024-01-15T10:30:00Z',
    },
    {
      emailid: 2,
      templatename: 'Password Reset',
      subject: 'Reset Your Password',
      description: 'Password reset request email',
      emailbody: '<p>Click the link below to reset your password.</p>',
      emailactiontype: 'password_reset',
      leadremarkchangeemail: 'support@example.com',
      isactive: 1,
      isdeleted: 0,
      addeddate: '2024-01-20T14:15:00Z',
    },
    {
      emailid: 3,
      templatename: 'Lead Remark Notification',
      subject: 'Lead Remark Has Been Updated',
      description: 'Notification when lead remark is changed',
      emailbody: '<p>A lead remark has been updated. Please review the changes.</p>',
      emailactiontype: 'lead_remark_changed',
      leadremarkchangeemail: 'leads@example.com',
      isactive: 1,
      isdeleted: 0,
      addeddate: '2024-02-01T09:45:00Z',
    },
    {
      emailid: 4,
      templatename: 'Deal Won',
      subject: 'Congratulations on Closing the Deal!',
      description: 'Celebration email when a deal is won',
      emailbody: '<h2>Congratulations!</h2><p>You have successfully closed the deal.</p>',
      emailactiontype: 'deal_won',
      leadremarkchangeemail: 'sales@example.com',
      isactive: 0,
      isdeleted: 0,
      addeddate: '2024-02-10T16:20:00Z',
    },
    {
      emailid: 5,
      templatename: 'Asset Maintenance Reminder',
      subject: 'Asset Maintenance Due',
      description: 'Reminder for upcoming asset maintenance',
      emailbody: '<p>Your asset maintenance is due soon.</p>',
      emailactiontype: 'asset_maintenance',
      leadremarkchangeemail: 'maintenance@example.com',
      isactive: 1,
      isdeleted: 0,
      addeddate: '2024-02-15T11:30:00Z',
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

  const [showForm, setShowForm] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'addeddate', direction: 'desc' });
  
  // Form state
  const [formData, setFormData] = useState({
    templatename: '',
    subject: '',
    description: '',
    emailbody: '',
    emailactiontype: '',
    leadremarkchangeemail: '',
    isactive: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedColumns, setSelectedColumns] = useState(['checkbox', 'templatename', 'subject', 'emailactiontype', 'leadremarkchangeemail', 'activestatus', 'addeddate', 'actions']);
  const [selectedEmails, setSelectedEmails] = useState([]);
  
  const [showColumnSelector, setShowColumnSelector] = useState(false);
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
    { key: 'templatename', label: 'Template Name', required: true },
    { key: 'subject', label: 'Subject', required: false },
    { key: 'emailactiontype', label: 'Action/Trigger', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'leadremarkchangeemail', label: 'Notification Email', required: false },
    { key: 'activestatus', label: 'Active Status', required: false },
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

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this email template?')) {
      setDeletingId(id);
      try {
        setEmailTemplates(prev => prev.filter(email => email.emailid !== id));
        toast.success('Email template deleted successfully!');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const currentData = searchTerm ? filteredEmails : emailTemplates;
    if (selectedEmails.length === currentData.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(currentData.map(email => email.emailid));
    }
  };

  // Handle individual checkbox selection
  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) return;
    
    const confirmMessage = selectedEmails.length === 1 
      ? 'Are you sure you want to delete this email template?'
      : `Are you sure you want to delete ${selectedEmails.length} email templates?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setEmailTemplates(prev => prev.filter(email => !selectedEmails.includes(email.emailid)));
        setSelectedEmails([]);
        toast.success(`${selectedEmails.length} email template${selectedEmails.length !== 1 ? 's' : ''} deleted successfully!`);
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete selected email templates');
      }
    }
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    if (columnKey === 'checkbox' || columnKey === 'templatename') {
      return;
    }
    
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        const nonRequiredColumns = prev.filter(col => col !== 'templatename');
        if (nonRequiredColumns.length === 1 && nonRequiredColumns[0] === columnKey) {
          return prev;
        }
        return prev.filter(col => col !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.templatename.trim()) {
      errors.templatename = 'Template name is required';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.emailbody.trim()) {
      errors.emailbody = 'Email body is required';
    }

    if (!formData.emailactiontype) {
      errors.emailactiontype = 'Please select an action/trigger';
    }

    if (formData.leadremarkchangeemail && !validateEmail(formData.leadremarkchangeemail)) {
      errors.leadremarkchangeemail = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingEmail) {
        // Update existing template
        setEmailTemplates(prev => prev.map(email => 
          email.emailid === editingEmail.emailid 
            ? { 
                ...email, 
                ...formData,
                modifieddate: new Date().toISOString()
              }
            : email
        ));
        toast.success('Email template updated successfully!');
      } else {
        // Add new template
        const newTemplate = {
          emailid: Math.max(...emailTemplates.map(e => e.emailid), 0) + 1,
          ...formData,
          isdeleted: 0,
          addeddate: new Date().toISOString()
        };
        setEmailTemplates(prev => [newTemplate, ...prev]);
        toast.success('Email template added successfully!');
      }
      
      // Reset form and close modal
      handleCloseForm();
    } catch (error) {
      console.error('Error saving email template:', error);
      toast.error('Failed to save email template');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form close
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmail(null);
    setFormData({
      templatename: '',
      subject: '',
      description: '',
      emailbody: '',
      emailactiontype: '',
      leadremarkchangeemail: '',
      isactive: 1
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (email) => {
    setEditingEmail(email);
    setFormData({
      templatename: email.templatename || '',
      subject: email.subject || '',
      description: email.description || '',
      emailbody: email.emailbody || '',
      emailactiontype: email.emailactiontype || '',
      leadremarkchangeemail: email.leadremarkchangeemail || '',
      isactive: email.isactive
    });
    setShowForm(true);
  };

  // Client-side search fallback
  const [filteredEmails, setFilteredEmails] = useState([]);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmails(emailTemplates);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = emailTemplates.filter(email => {
      const searchableFields = [
        email.templatename,
        email.subject,
        email.description,
        email.leadremarkchangeemail,
        getActionTypeLabel(email.emailactiontype),
        email.addeddate
      ];

      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredEmails(filtered);
  }, [emailTemplates, searchTerm]);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const shouldShowPagination = pagination.totalPages > 1 && pagination.pageSize !== 1000;

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

  // Get action type label
  const getActionTypeLabel = (actionType) => {
    const action = emailActionTypes.find(a => a.value === actionType);
    return action ? action.label : actionType || 'Not Set';
  };

  // Get action type badge
  const getActionTypeBadge = (actionType) => {
    if (!actionType) {
      return <Badge variant="secondary">Not Set</Badge>;
    }
    
    const badgeVariant = actionType === 'lead_remark_changed' ? 'default' : 
                         actionType === 'deal_won' ? 'success' : 
                         actionType === 'deal_lost' ? 'destructive' : 
                         'outline';
    
    return <Badge variant={badgeVariant}>{getActionTypeLabel(actionType)}</Badge>;
  };

  // Get action buttons
  const getActionButtons = (email) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(email)}
        disabled={loading}
        className="p-2"
        title="Edit"
      >
        <Edit className="w-4 h-4 text-green-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(email.emailid)}
        disabled={loading || deletingId === email.emailid}
        className="p-2"
        title="Delete"
      >
        {deletingId === email.emailid ? (
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
          onClick={() => setShowForm(true)}
        >
          Add Email Template
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

            <Button
              variant="outline"
              icon={RefreshCw}
              size="sm"
              onClick={refresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>

          {/* Right: Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search email templates..."
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
      {selectedEmails.length > 0 && (
        <div className="flex items-center justify-between py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              {selectedEmails.length} email template{selectedEmails.length !== 1 ? 's' : ''} selected
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEmails([])}
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
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Email Templates Table */}
      <Card>
        {loading && emailTemplates.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading email templates...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 text-red-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Email Templates
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button variant="primary" onClick={refresh}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (searchTerm ? filteredEmails : emailTemplates).length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Email Templates Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search'
                  : 'Get started by adding your first email template'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            <SortableTable
              data={emailTemplates}
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
                          checked={selectedEmails.length > 0 && selectedEmails.length === (searchTerm ? filteredEmails : emailTemplates).length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </SortableTableHead>
                    )}
                    {selectedColumns.includes('templatename') && (
                      <SortableTableHead sortKey="templatename">Template Name</SortableTableHead>
                    )}
                    {selectedColumns.includes('subject') && (
                      <SortableTableHead sortKey="subject">Subject</SortableTableHead>
                    )}
                    {selectedColumns.includes('emailactiontype') && (
                      <SortableTableHead sortKey="emailactiontype">Action/Trigger</SortableTableHead>
                    )}
                    {selectedColumns.includes('description') && (
                      <SortableTableHead sortKey="description">Description</SortableTableHead>
                    )}
                    {selectedColumns.includes('leadremarkchangeemail') && (
                      <SortableTableHead sortKey="leadremarkchangeemail">Notification Email</SortableTableHead>
                    )}
                    {selectedColumns.includes('activestatus') && (
                      <SortableTableHead sortKey="isactive">Active Status</SortableTableHead>
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
                 {(searchTerm ? filteredEmails : emailTemplates).map((email, index) => (
                   <motion.tr
                     key={email.emailid}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.05 }}
                   >
                     {selectedColumns.includes('checkbox') && (
                       <Table.Cell>
                         <input
                           type="checkbox"
                           checked={selectedEmails.includes(email.emailid)}
                           onChange={() => handleSelectEmail(email.emailid)}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                         />
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('templatename') && (
                       <Table.Cell className="font-medium">
                         {email.templatename}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('subject') && (
                       <Table.Cell>
                         {email.subject || 'N/A'}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('emailactiontype') && (
                       <Table.Cell>
                         {getActionTypeBadge(email.emailactiontype)}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('description') && (
                       <Table.Cell className="max-w-xs">
                         <div className="truncate" title={email.description}>
                           {email.description || 'No description'}
                         </div>
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('leadremarkchangeemail') && (
                       <Table.Cell className="text-sm">
                         {email.leadremarkchangeemail ? (
                           <span className="text-blue-600 dark:text-blue-400" title={email.leadremarkchangeemail}>
                             {email.leadremarkchangeemail}
                           </span>
                         ) : (
                           <span className="text-gray-400 dark:text-gray-500">Not set</span>
                         )}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('activestatus') && (
                       <Table.Cell>
                         {getStatusBadge(email.isactive, email.isdeleted)}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('addeddate') && (
                       <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">
                         {formatDate(email.addeddate)}
                       </Table.Cell>
                     )}
                     {selectedColumns.includes('actions') && (
                       <Table.Cell>
                         {getActionButtons(email)}
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

      {/* Form Modal */}
      <AnimatePresence>
      {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseForm();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto max-md:max-w-full max-md:h-full max-md:max-h-full"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10 max-md:px-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 max-md:text-lg">
              {editingEmail ? 'Edit Email Template' : 'Add Email Template'}
            </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-md:p-4 max-md:space-y-4">
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-4">
                  {/* Template Name */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label htmlFor="templatename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Template Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="templatename"
                      name="templatename"
                      type="text"
                      value={formData.templatename}
                      onChange={handleInputChange}
                      placeholder="Enter template name"
                      className={formErrors.templatename ? 'border-red-500' : ''}
                    />
                    {formErrors.templatename && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.templatename}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter email subject"
                      className={formErrors.subject ? 'border-red-500' : ''}
                    />
                    {formErrors.subject && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>
                    )}
                  </div>

                  {/* Email Action Type */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label htmlFor="emailactiontype" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Action/Trigger <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="emailactiontype"
                      name="emailactiontype"
                      value={formData.emailactiontype}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                        formErrors.emailactiontype ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select action/trigger</option>
                      {emailActionTypes.map((action) => (
                        <option key={action.value} value={action.value}>
                          {action.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.emailactiontype && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.emailactiontype}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Select when this email template should be triggered
                    </p>
                  </div>

                  {/* Description */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter template description"
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  {/* Email Body */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label htmlFor="emailbody" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="emailbody"
                      name="emailbody"
                      value={formData.emailbody}
                      onChange={handleInputChange}
                      placeholder="Enter email body (HTML supported)"
                      rows={6}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                        formErrors.emailbody ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {formErrors.emailbody && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.emailbody}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      You can use HTML tags to format the email
                    </p>
                  </div>

                  {/* Notification Email */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label htmlFor="leadremarkchangeemail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notification Email Address
                    </label>
                    <Input
                      id="leadremarkchangeemail"
                      name="leadremarkchangeemail"
                      type="email"
                      value={formData.leadremarkchangeemail}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className={formErrors.leadremarkchangeemail ? 'border-red-500' : ''}
                    />
                    {formErrors.leadremarkchangeemail && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.leadremarkchangeemail}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email address to send notifications when this action/trigger occurs
                    </p>
                  </div>

                  {/* Active Status */}
                  <div className="col-span-2 max-md:col-span-1">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isactive"
                        checked={formData.isactive === 1}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active Template
                      </span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                    type="button"
                variant="outline"
                    onClick={handleCloseForm}
                    disabled={isSaving}
              >
                Cancel
              </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSaving}
                    className="min-w-[100px]"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingEmail ? 'Update' : 'Save'
                    )}
              </Button>
            </div>
              </form>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default EmailMaster;

