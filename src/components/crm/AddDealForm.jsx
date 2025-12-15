import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  DollarSign, 
  Building2, 
  Users, 
  FileText, 
  X,
  Upload,
  Plus,
  Trash2,
  Search,
  Target,
  TrendingUp,
  Calendar,
  Package,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { SearchableDropdown } from '../ui/searchable-dropdown';
import { Select, SelectItem } from '../ui/select';
import Card from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// FormSection component - defined outside to prevent re-creation on every render
const FormSection = React.memo(({ title, icon: Icon, sectionKey, children }) => (
  <Card className="mb-6">
    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </Card>
));

const AddDealForm = ({ 
  deal = null,
  isConverting = false,
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  users = [],
  contacts = []
}) => {
  const { user, logout } = useAuth();
  
  // Check if user ID, orgId, and email are available, if not logout
  useEffect(() => {
    if (!user?.id || !user?.orgId || !user?.email) {
      toast.error('User session invalid. Please login again.');
      logout();
      onClose();
      return;
    }
  }, [user?.id, user?.orgId, user?.email, logout, onClose]);
  
  // Initial form data
  const initialFormData = {
    // Deal Information
    dealname: '',
    dealownerid: user?.id || '',
    dealstage: 'Prospect',
    dealvalue: '',
    mrr: '',
    arr: '',
    revenuetype: 'One-time',
    expectedclosedate: '',
    actualclosedate: '',
    probability: 10,
    dealtype: 'New',
    leadsource: '',
    engagementscore: '',
    dealstatus: 'Open',
    dealcreateddate: new Date().toISOString().split('T')[0],
    
    // Customer Information
    customername: '',
    customeremail: '',
    customerphone: '',
    customercompany: '',
    customeraddress: '',
    customercity: '',
    customerstate: '',
    customerzipcode: '',
    customercountry: '',
    customerdesignation: '',
    customerwebsite: '',
    customerindustry: '',
    customeremployees: '',
    customerrevenue: '',
    
    // Contact Information
    contactperson: '',
    contactemail: '',
    contactphone: '',
    contactdesignation: '',
    contactdepartment: '',
    
    // Product Information
    businessunit: '',
    productservices: '',
    estimatedbudget: '',
    decisionmakingauthority: '',
    decisiontimeline: '',
    existingsolution: '',
    
    // Deal Context
    dealcontext: '',
    competitiveadvantage: '',
    risksandchallenges: '',
    decisioncriteria: '',
    budgetconfirmation: '',
    stakeholderinformation: '',
    nextstep: '',
    comments: '',
    attachments: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dealInfo');
  
  // Ref for the scrollable container
  const scrollContainerRef = useRef(null);
  
  // Reset activeSection when form opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection('dealInfo');
    }
  }, [isOpen]);
  
  // Single keystroke focus feature
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only trigger if the form is open and no input is currently focused
      if (isOpen && !event.target.matches('input, textarea, select, [contenteditable]')) {
        // Check if it's a printable character (not special keys)
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          // Focus the first input field in the form
          const firstInput = scrollContainerRef.current?.querySelector('input:not([type="hidden"]), textarea, select');
          if (firstInput) {
            firstInput.focus();
            // Prevent the default behavior to avoid typing in the focused input
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen]);
  
  // Product/Services Line Items State
  const [productLineItems, setProductLineItems] = useState([
    {
      id: 1,
      productService: '',
      quantity: 1,
      price: '',
      currency: 'USD',
      discount: 0,
      totalAmount: 0
    }
  ]);

  // Initialize form data when deal prop changes
  useEffect(() => {
    if (deal) {
      setFormData({
        dealname: deal.dealname || deal.opportunityname || '',
        dealownerid: deal.dealownerid || deal.opportunityownerid || user?.id || null,
        dealstage: deal.dealstage || deal.opportunitystage || 'Prospect',
        dealvalue: deal.dealvalue || deal.opportunityvalue || '',
        mrr: deal.mrr || '',
        arr: deal.arr || '',
        revenuetype: deal.revenuetype || 'One-time',
        expectedclosedate: deal.expectedclosedate || '',
        actualclosedate: deal.actualclosedate || '',
        probability: deal.probability || 10,
        dealtype: deal.dealtype || deal.opportunitytype || 'New',
        leadsource: deal.leadsource || '',
        engagementscore: deal.engagementscore || '',
        dealstatus: deal.dealstatus || deal.opportunitystatus || 'Open',
        dealcreateddate: deal.dealcreateddate || deal.opportunitycreateddate || new Date().toISOString().split('T')[0],
        customername: deal.customername || '',
        customeremail: deal.customeremail || '',
        customerphone: deal.customerphone || '',
        customercompany: deal.customercompany || '',
        customeraddress: deal.customeraddress || '',
        customercity: deal.customercity || '',
        customerstate: deal.customerstate || '',
        customerzipcode: deal.customerzipcode || '',
        customercountry: deal.customercountry || '',
        customerdesignation: deal.customerdesignation || '',
        customerwebsite: deal.customerwebsite || '',
        customerindustry: deal.customerindustry || '',
        customeremployees: deal.customeremployees || '',
        customerrevenue: deal.customerrevenue || '',
        contactperson: deal.contactperson || '',
        contactemail: deal.contactemail || '',
        contactphone: deal.contactphone || '',
        contactdesignation: deal.contactdesignation || '',
        contactdepartment: deal.contactdepartment || '',
        businessunit: deal.businessunit || '',
        productservices: deal.productservices || '',
        estimatedbudget: deal.estimatedbudget || '',
        decisionmakingauthority: deal.decisionmakingauthority || '',
        decisiontimeline: deal.decisiontimeline || '',
        existingsolution: deal.existingsolution || '',
        dealcontext: deal.dealcontext || '',
        competitiveadvantage: deal.competitiveadvantage || '',
        risksandchallenges: deal.risksandchallenges || '',
        decisioncriteria: deal.decisioncriteria || '',
        budgetconfirmation: deal.budgetconfirmation || '',
        stakeholderinformation: deal.stakeholderinformation || '',
        nextstep: deal.nextstep || '',
        comments: deal.comments || '',
        attachments: deal.attachments || []
      });
    }
  }, [deal, user?.id]);

  // Search functionality
  const searchableFields = [
    'dealname', 'dealvalue', 'customername', 'customeremail', 'customerphone', 'customercompany',
    'customeraddress', 'customerdesignation', 'contactperson', 'contactemail', 'contactphone',
    'businessunit', 'productservices', 'estimatedbudget', 'dealcontext', 'nextstep', 'comments'
  ];

  const filteredFormData = useMemo(() => {
    if (!searchTerm.trim()) return formData;
    
    const filtered = {};
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (searchableFields.includes(key) && 
          value && 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered[key] = value;
      }
    });
    return filtered;
  }, [formData, searchTerm]);

  // Function to check if a field matches the search term
  const isFieldMatching = useCallback((fieldName) => {
    if (!searchTerm.trim()) return false;
    const value = formData[fieldName];
    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  }, [formData, searchTerm]);

  // Navigation sections
  const navigationSections = [
    { key: 'dealInfo', label: 'Deal Information', icon: DollarSign },
    { key: 'customerInfo', label: 'Customer Information', icon: Building2 },
    { key: 'contactInfo', label: 'Contact Information', icon: Users },
    { key: 'productInfo', label: 'Product Information', icon: Package },
    { key: 'dealContext', label: 'Deal Context', icon: FileText }
  ];

  // Precise scroll detection for automatic navigation highlighting
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      // Debounce scroll events for better performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollTop = scrollContainer.scrollTop;
        const containerHeight = scrollContainer.clientHeight;
        
        // More precise calculation - use 20% from top as trigger point
        const triggerPoint = scrollTop + (containerHeight * 0.2);
        
        // Find which section is currently most visible
        let currentSection = 'dealInfo';
        let maxVisibleArea = 0;
        
        navigationSections.forEach((section) => {
          const element = document.getElementById(section.key);
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Calculate visible area of this section
            const visibleTop = Math.max(elementTop, scrollTop);
            const visibleBottom = Math.min(elementBottom, scrollTop + containerHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Check if trigger point is within this section
            const isTriggerPointInSection = triggerPoint >= elementTop && triggerPoint < elementBottom;
            
            // Prioritize sections where trigger point is located, then by visible area
            if (isTriggerPointInSection || (visibleHeight > maxVisibleArea && visibleHeight > containerHeight * 0.1)) {
              if (isTriggerPointInSection || visibleHeight > maxVisibleArea) {
                currentSection = section.key;
                maxVisibleArea = visibleHeight;
              }
            }
          }
        });

        // Update active section if it changed
        if (currentSection !== activeSection) {
          setActiveSection(currentSection);
        }
      }, 5); // Reduced debounce for more responsive updates
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check
      handleScroll();
      
      return () => {
        clearTimeout(scrollTimeout);
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [activeSection, navigationSections]);

  const scrollToSection = useCallback((sectionKey) => {
    setActiveSection(sectionKey);
    const element = document.getElementById(sectionKey);
    const scrollContainer = scrollContainerRef.current;
    
    if (element && scrollContainer) {
      // Calculate precise scroll position
      const elementTop = element.offsetTop;
      const containerHeight = scrollContainer.clientHeight;
      
      // Scroll to show section at 20% from top for consistency
      const targetScrollTop = elementTop - (containerHeight * 0.2);
      
      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }, []);

  // Calculate deal age
  const dealAge = useMemo(() => {
    if (!formData.dealcreateddate) return 0;
    const createdDate = new Date(formData.dealcreateddate);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [formData.dealcreateddate]);

  // Topbar component
  const Topbar = () => {
    const title = isConverting ? 'Add Deal' : deal ? 'Edit Deal' : 'Add New Deal';
    const description = isConverting ? 'Add a new deal from lead information' : deal ? 'Update deal details' : 'Create a new deal entry';
    
    return (
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Dropdown options
  const dealStageOptions = [
    { value: 'Prospect', label: 'Prospect' },
    { value: 'Qualification', label: 'Qualification' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  const dealTypeOptions = [
    { value: 'New', label: 'New' },
    { value: 'Existing', label: 'Existing' },
    { value: 'Renewal', label: 'Renewal' },
    { value: 'Upgrade', label: 'Upgrade' }
  ];

  const dealStatusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const revenueTypeOptions = [
    { value: 'One-time', label: 'One-time' },
    { value: 'Recurring', label: 'Recurring' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  const businessUnitOptions = [
    { value: 'Cloud', label: 'Cloud' },
    { value: 'KPO', label: 'KPO' }
  ];

  const productServicesOptions = {
    Cloud: [
      { value: 'acronis-backup', label: 'Acronis backup' },
      { value: 'aws', label: 'AWS' },
      { value: 'cdn', label: 'CDN' },
      { value: 'cyber-security', label: 'Cyber security' },
      { value: 'dedicated-server', label: 'Dedicated server' },
      { value: 'google-cloud', label: 'Google cloud' },
      { value: 'hp-green-lake', label: 'HP green lake' },
      { value: 'm365', label: 'M365' },
      { value: 'managed-services', label: 'Managed services' },
      { value: 'microsoft-azure', label: 'Microsoft azure' },
      { value: 'one-time-setup', label: 'One time set up charges' },
      { value: 'oracle-cloud', label: 'Oracle cloud' },
      { value: 'private-cloud', label: 'Private cloud' },
      { value: 'siem', label: 'SIEM' },
      { value: 'single-sign-on', label: 'Single sign-on' },
      { value: 'tally-on-cloud', label: 'Tally on cloud' },
      { value: 'vapt', label: 'VAPT' },
      { value: 'vps', label: 'VPS' }
    ],
    KPO: [
      { value: 'back-office-logistics', label: 'Back-office services – Logistics & transportation' },
      { value: 'back-office-recruitment', label: 'Back-office services – Recruitment & staffing' }
    ],
    Others: [
      { value: 'ap-ar-automation', label: 'AP AR automation' },
      { value: 'bookkeeping-services', label: 'Bookkeeping services' },
      { value: 'hedge-fund-services', label: 'Hedge fund services' },
      { value: 'ms-licences', label: 'MS licences' },
      { value: 'other', label: 'Other' }
    ]
  };

  const industryOptions = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' }
  ];

  const employeeCountOptions = [
    { value: '1-4', label: '1-4' },
    { value: '5-9', label: '5-9' },
    { value: '10-19', label: '10-19' },
    { value: '20-49', label: '20-49' },
    { value: '50-99', label: '50-99' },
    { value: '100-249', label: '100-249' },
    { value: '250-499', label: '250-499' }
  ];

  const revenueSizeOptions = [
    { value: '<$1M', label: '<$1M' },
    { value: '$1M-$10M', label: '$1M - $10M' },
    { value: '$10M-$50M', label: '$10M - $50M' },
    { value: '$50M-$100M', label: '$50M - $100M' },
    { value: '$100M-$500M', label: '$100M - $500M' },
    { value: '$500M-$1B', label: '$500M - $1B' },
    { value: '$1B+', label: '$1B+' }
  ];

  const countryOptions = [
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
    { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
    { value: 'INR', label: 'INR - Indian Rupee', symbol: '₹' },
    { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
    { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
    { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' },
    { value: 'CNY', label: 'CNY - Chinese Yuan', symbol: '¥' }
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Memoized input handlers to prevent unnecessary re-renders
  const createInputHandler = useCallback((field) => {
    return (e) => handleInputChange(field, e.target.value);
  }, [handleInputChange]);

  const createDropdownHandler = useCallback((field) => {
    return (value) => handleInputChange(field, value);
  }, [handleInputChange]);

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  }, []);

  const removeFile = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  }, []);

  // Product Line Item Handlers
  const addProductLineItem = useCallback(() => {
    const newId = Math.max(...productLineItems.map(item => item.id), 0) + 1;
    setProductLineItems(prev => [
      ...prev,
      {
        id: newId,
        productService: '',
        quantity: 1,
        price: '',
        currency: 'USD',
        discount: 0,
        totalAmount: 0
      }
    ]);
  }, [productLineItems]);

  const removeProductLineItem = useCallback((id) => {
    if (productLineItems.length > 1) {
      setProductLineItems(prev => prev.filter(item => item.id !== id));
    }
  }, [productLineItems.length]);

  const updateProductLineItem = useCallback((id, field, value) => {
    setProductLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate total amount when price, quantity, or discount changes
        if (field === 'price' || field === 'quantity' || field === 'discount') {
          const price = parseFloat(field === 'price' ? value : updatedItem.price) || 0;
          const quantity = parseInt(field === 'quantity' ? value : updatedItem.quantity) || 0;
          const discount = parseFloat(field === 'discount' ? value : updatedItem.discount) || 0;
          
          const subtotal = price * quantity;
          const discountAmount = (subtotal * discount) / 100;
          updatedItem.totalAmount = subtotal - discountAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  }, []);

  // Calculate grand total from all line items
  const grandTotal = useMemo(() => {
    return productLineItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  }, [productLineItems]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.dealname) newErrors.dealname = 'Deal name is required';
    if (!formData.dealownerid) newErrors.dealownerid = 'Deal owner is required';
    if (!formData.dealstage) newErrors.dealstage = 'Deal stage is required';
    if (!formData.dealvalue) newErrors.dealvalue = 'Deal value is required';
    if (!formData.expectedclosedate) newErrors.expectedclosedate = 'Expected close date is required';
    if (!formData.customername) newErrors.customername = 'Customer name is required';
    if (!formData.customeremail) newErrors.customeremail = 'Customer email is required';
    if (!formData.customerphone) newErrors.customerphone = 'Customer phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  // Reset form when dialog closes
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Include product line items in the submission
      const submissionData = {
        ...formData,
        productLineItems: productLineItems,
        grandTotal: grandTotal
      };
      onSubmit(submissionData);
      resetForm();
      onClose();
    }
  };

  // Don't render the form if user ID, orgId, or email is not available
  if (!user?.id || !user?.orgId || !user?.email) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95rem] max-h-[90vh] p-0 z-50 !rounded-none" style={{ maxWidth: '85rem', zIndex: 9999 }} showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>Create a new deal entry with deal, customer, contact, product, and context information</DialogDescription>
        </DialogHeader>
        {/* Topbar */}
        <Topbar />
        
        <div className="flex h-[calc(90vh-4rem)] overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full flex-shrink-0">
            {/* Search Box */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search Fields"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Found {Object.keys(filteredFormData).length} matching field(s)
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-6 overflow-y-auto">
              <nav className="space-y-2">
                {navigationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.key}
                      onClick={() => scrollToSection(section.key)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.key
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            <div className="flex-1 overflow-y-auto p-6" ref={scrollContainerRef}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Deal Information Section */}
                <div id="dealInfo">
                  <FormSection title="Deal Information" icon={DollarSign} sectionKey="dealInfo">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Deal Name */}
                      <div className={`space-y-2 ${isFieldMatching('dealname') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                        <Label htmlFor="dealname">Deal Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="dealname"
                          value={formData.dealname}
                          onChange={createInputHandler('dealname')}
                          placeholder="Enter deal name"
                          className={errors.dealname ? 'border-red-500' : ''}
                        />
                        {errors.dealname && <p className="text-sm text-red-600">{errors.dealname}</p>}
                      </div>

                      {/* Deal Owner */}
                      <div className="space-y-2">
                        <Label htmlFor="dealownerid">Deal Owner <span className="text-red-500">*</span></Label>
                        <SearchableDropdown
                          options={users.map(user => ({
                            value: user.id,
                            label: user.name || user.fullname
                          }))}
                          value={formData.dealownerid}
                          onValueChange={createDropdownHandler('dealownerid')}
                          placeholder="Select deal owner"
                        />
                        {errors.dealownerid && <p className="text-sm text-red-600">{errors.dealownerid}</p>}
                      </div>

                      {/* Deal Stage */}
                      <div className="space-y-2">
                        <Label htmlFor="dealstage">Deal Stage <span className="text-red-500">*</span></Label>
                        <SearchableDropdown
                          options={dealStageOptions}
                          value={formData.dealstage}
                          onValueChange={createDropdownHandler('dealstage')}
                          placeholder="Select deal stage"
                        />
                        {errors.dealstage && <p className="text-sm text-red-600">{errors.dealstage}</p>}
                      </div>

                      {/* Deal Value */}
                      <div className="space-y-2">
                        <Label htmlFor="dealvalue">Deal Value <span className="text-red-500">*</span></Label>
                        <Input
                          id="dealvalue"
                          type="number"
                          value={formData.dealvalue}
                          onChange={createInputHandler('dealvalue')}
                          placeholder="Enter deal value"
                          className={errors.dealvalue ? 'border-red-500' : ''}
                        />
                        {errors.dealvalue && <p className="text-sm text-red-600">{errors.dealvalue}</p>}
                      </div>

                      {/* MRR */}
                      <div className="space-y-2">
                        <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
                        <Input
                          id="mrr"
                          type="number"
                          value={formData.mrr}
                          onChange={createInputHandler('mrr')}
                          placeholder="Enter MRR"
                        />
                      </div>

                      {/* ARR */}
                      <div className="space-y-2">
                        <Label htmlFor="arr">Annual Recurring Revenue (ARR)</Label>
                        <Input
                          id="arr"
                          type="number"
                          value={formData.arr}
                          onChange={createInputHandler('arr')}
                          placeholder="Enter ARR"
                        />
                      </div>

                      {/* Revenue Type */}
                      <div className="space-y-2">
                        <Label htmlFor="revenuetype">Revenue Type</Label>
                        <SearchableDropdown
                          options={revenueTypeOptions}
                          value={formData.revenuetype}
                          onValueChange={createDropdownHandler('revenuetype')}
                          placeholder="Select revenue type"
                        />
                      </div>

                      {/* Expected Close Date */}
                      <div className="space-y-2">
                        <Label htmlFor="expectedclosedate">Expected Close Date <span className="text-red-500">*</span></Label>
                        <Input
                          id="expectedclosedate"
                          type="date"
                          value={formData.expectedclosedate}
                          onChange={createInputHandler('expectedclosedate')}
                          className={errors.expectedclosedate ? 'border-red-500' : ''}
                        />
                        {errors.expectedclosedate && <p className="text-sm text-red-600">{errors.expectedclosedate}</p>}
                      </div>

                      {/* Actual Close Date */}
                      <div className="space-y-2">
                        <Label htmlFor="actualclosedate">Actual Close Date</Label>
                        <Input
                          id="actualclosedate"
                          type="date"
                          value={formData.actualclosedate}
                          onChange={createInputHandler('actualclosedate')}
                        />
                      </div>

                      {/* Probability */}
                      <div className="space-y-2">
                        <Label htmlFor="probability">Probability (%)</Label>
                        <Input
                          id="probability"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.probability}
                          onChange={createInputHandler('probability')}
                          placeholder="Enter probability"
                        />
                      </div>

                      {/* Deal Type */}
                      <div className="space-y-2">
                        <Label htmlFor="dealtype">Deal Type</Label>
                        <SearchableDropdown
                          options={dealTypeOptions}
                          value={formData.dealtype}
                          onValueChange={createDropdownHandler('dealtype')}
                          placeholder="Select deal type"
                        />
                      </div>

                      {/* Lead Source */}
                      <div className="space-y-2">
                        <Label htmlFor="leadsource">Lead Source</Label>
                        <Input
                          id="leadsource"
                          value={formData.leadsource}
                          onChange={createInputHandler('leadsource')}
                          placeholder="Enter lead source"
                        />
                      </div>

                      {/* Engagement Score */}
                      <div className="space-y-2">
                        <Label htmlFor="engagementscore">Engagement Score</Label>
                        <Input
                          id="engagementscore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.engagementscore}
                          onChange={createInputHandler('engagementscore')}
                          placeholder="Enter engagement score"
                        />
                      </div>

                      {/* Deal Status */}
                      <div className="space-y-2">
                        <Label htmlFor="dealstatus">Deal Status</Label>
                        <SearchableDropdown
                          options={dealStatusOptions}
                          value={formData.dealstatus}
                          onValueChange={createDropdownHandler('dealstatus')}
                          placeholder="Select deal status"
                        />
                      </div>

                      {/* Deal Created Date */}
                      <div className="space-y-2">
                        <Label htmlFor="dealcreateddate">Deal Created Date</Label>
                        <Input
                          id="dealcreateddate"
                          type="date"
                          value={formData.dealcreateddate}
                          onChange={createInputHandler('dealcreateddate')}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                        <p className="text-xs text-gray-500">Auto-generated when deal is created</p>
                      </div>

                      {/* Deal Age */}
                      <div className="space-y-2">
                        <Label>Deal Age</Label>
                        <Input
                          value={`${dealAge} days`}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                        <p className="text-xs text-gray-500">From first contact to closure</p>
                      </div>
                    </div>
                  </FormSection>
                </div>

                {/* Customer Information Section */}
                <div id="customerInfo">
                  <FormSection title="Customer Information" icon={Building2} sectionKey="customerInfo">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Customer Name */}
                      <div className={`space-y-2 ${isFieldMatching('customername') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                        <Label htmlFor="customername">Customer Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="customername"
                          value={formData.customername}
                          onChange={createInputHandler('customername')}
                          placeholder="Enter customer name"
                          className={errors.customername ? 'border-red-500' : ''}
                        />
                        {errors.customername && <p className="text-sm text-red-600">{errors.customername}</p>}
                      </div>

                      {/* Customer Email */}
                      <div className={`space-y-2 ${isFieldMatching('customeremail') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                        <Label htmlFor="customeremail">Customer Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="customeremail"
                          type="email"
                          value={formData.customeremail}
                          onChange={createInputHandler('customeremail')}
                          placeholder="Enter customer email"
                          className={errors.customeremail ? 'border-red-500' : ''}
                        />
                        {errors.customeremail && <p className="text-sm text-red-600">{errors.customeremail}</p>}
                      </div>

                      {/* Customer Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="customerphone">Customer Phone <span className="text-red-500">*</span></Label>
                        <Input
                          id="customerphone"
                          value={formData.customerphone}
                          onChange={createInputHandler('customerphone')}
                          placeholder="Enter customer phone"
                          className={errors.customerphone ? 'border-red-500' : ''}
                        />
                        {errors.customerphone && <p className="text-sm text-red-600">{errors.customerphone}</p>}
                      </div>

                      {/* Customer Company */}
                      <div className="space-y-2">
                        <Label htmlFor="customercompany">Customer Company</Label>
                        <Input
                          id="customercompany"
                          value={formData.customercompany}
                          onChange={createInputHandler('customercompany')}
                          placeholder="Enter customer company"
                        />
                      </div>

                      {/* Customer Address */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="customeraddress">Customer Address</Label>
                        <Textarea
                          id="customeraddress"
                          value={formData.customeraddress}
                          onChange={createInputHandler('customeraddress')}
                          placeholder="Enter customer address"
                          rows={3}
                        />
                      </div>

                      {/* Customer City */}
                      <div className="space-y-2">
                        <Label htmlFor="customercity">Customer City</Label>
                        <Input
                          id="customercity"
                          value={formData.customercity}
                          onChange={createInputHandler('customercity')}
                          placeholder="Enter city"
                        />
                      </div>

                      {/* Customer State */}
                      <div className="space-y-2">
                        <Label htmlFor="customerstate">Customer State</Label>
                        <Input
                          id="customerstate"
                          value={formData.customerstate}
                          onChange={createInputHandler('customerstate')}
                          placeholder="Enter state"
                        />
                      </div>

                      {/* Customer Zip Code */}
                      <div className="space-y-2">
                        <Label htmlFor="customerzipcode">Zip Code</Label>
                        <Input
                          id="customerzipcode"
                          value={formData.customerzipcode}
                          onChange={createInputHandler('customerzipcode')}
                          placeholder="Enter zip code"
                        />
                      </div>

                      {/* Customer Country */}
                      <div className="space-y-2">
                        <Label htmlFor="customercountry">Customer Country</Label>
                        <SearchableDropdown
                          options={countryOptions}
                          value={formData.customercountry}
                          onValueChange={createDropdownHandler('customercountry')}
                          placeholder="Select country"
                        />
                      </div>

                      {/* Customer Designation */}
                      <div className="space-y-2">
                        <Label htmlFor="customerdesignation">Customer Designation</Label>
                        <Input
                          id="customerdesignation"
                          value={formData.customerdesignation}
                          onChange={createInputHandler('customerdesignation')}
                          placeholder="Enter customer designation"
                        />
                      </div>

                      {/* Customer Website */}
                      <div className="space-y-2">
                        <Label htmlFor="customerwebsite">Customer Website</Label>
                        <Input
                          id="customerwebsite"
                          value={formData.customerwebsite}
                          onChange={createInputHandler('customerwebsite')}
                          placeholder="Enter website URL"
                        />
                      </div>

                      {/* Customer Industry */}
                      <div className="space-y-2">
                        <Label htmlFor="customerindustry">Customer Industry</Label>
                        <SearchableDropdown
                          options={industryOptions}
                          value={formData.customerindustry}
                          onValueChange={createDropdownHandler('customerindustry')}
                          placeholder="Select industry"
                        />
                      </div>

                      {/* Customer Employees */}
                      <div className="space-y-2">
                        <Label htmlFor="customeremployees">Customer Employees</Label>
                        <SearchableDropdown
                          options={employeeCountOptions}
                          value={formData.customeremployees}
                          onValueChange={createDropdownHandler('customeremployees')}
                          placeholder="Select employee count"
                        />
                      </div>

                      {/* Customer Revenue */}
                      <div className="space-y-2">
                        <Label htmlFor="customerrevenue">Customer Revenue Size</Label>
                        <SearchableDropdown
                          options={revenueSizeOptions}
                          value={formData.customerrevenue}
                          onValueChange={createDropdownHandler('customerrevenue')}
                          placeholder="Select revenue range"
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>

                {/* Contact Information Section */}
                <div id="contactInfo">
                  <FormSection title="Contact Information" icon={Users} sectionKey="contactInfo">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Contact Person */}
                      <div className="space-y-2">
                        <Label htmlFor="contactperson">Contact Person</Label>
                        <Input
                          id="contactperson"
                          value={formData.contactperson}
                          onChange={createInputHandler('contactperson')}
                          placeholder="Enter contact person"
                        />
                      </div>

                      {/* Contact Email */}
                      <div className="space-y-2">
                        <Label htmlFor="contactemail">Contact Email</Label>
                        <Input
                          id="contactemail"
                          type="email"
                          value={formData.contactemail}
                          onChange={createInputHandler('contactemail')}
                          placeholder="Enter contact email"
                        />
                      </div>

                      {/* Contact Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="contactphone">Contact Phone</Label>
                        <Input
                          id="contactphone"
                          value={formData.contactphone}
                          onChange={createInputHandler('contactphone')}
                          placeholder="Enter contact phone"
                        />
                      </div>

                      {/* Contact Designation */}
                      <div className="space-y-2">
                        <Label htmlFor="contactdesignation">Contact Designation</Label>
                        <Input
                          id="contactdesignation"
                          value={formData.contactdesignation}
                          onChange={createInputHandler('contactdesignation')}
                          placeholder="Enter contact designation"
                        />
                      </div>

                      {/* Contact Department */}
                      <div className="space-y-2">
                        <Label htmlFor="contactdepartment">Contact Department</Label>
                        <Input
                          id="contactdepartment"
                          value={formData.contactdepartment}
                          onChange={createInputHandler('contactdepartment')}
                          placeholder="Enter contact department"
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>

                {/* Product Information Section */}
                <div id="productInfo">
                  <FormSection title="Product Information" icon={Package} sectionKey="productInfo">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Business Unit */}
                      <div className="space-y-2">
                        <Label htmlFor="businessunit">Business Unit</Label>
                        <SearchableDropdown
                          options={businessUnitOptions}
                          value={formData.businessunit}
                          onValueChange={createDropdownHandler('businessunit')}
                          placeholder="Select business unit"
                        />
                      </div>

                      {/* Product or Services */}
                      <div className="space-y-2">
                        <Label htmlFor="productservices">Product or Services</Label>
                        <SearchableDropdown
                          options={formData.businessunit ? productServicesOptions[formData.businessunit] || [] : []}
                          value={formData.productservices}
                          onValueChange={createDropdownHandler('productservices')}
                          placeholder="Select product/service"
                          disabled={!formData.businessunit}
                        />
                      </div>

                      {/* Estimated Budget */}
                      <div className="space-y-2">
                        <Label htmlFor="estimatedbudget">Estimated Budget</Label>
                        <Input
                          id="estimatedbudget"
                          type="number"
                          value={formData.estimatedbudget}
                          onChange={createInputHandler('estimatedbudget')}
                          placeholder="Enter estimated budget"
                        />
                      </div>

                      {/* Decision Making Authority */}
                      <div className="space-y-2">
                        <Label htmlFor="decisionmakingauthority">Decision Making Authority</Label>
                        <SearchableDropdown
                          options={[
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' }
                          ]}
                          value={formData.decisionmakingauthority}
                          onValueChange={createDropdownHandler('decisionmakingauthority')}
                          placeholder="Select decision making authority"
                        />
                      </div>

                      {/* Decision Timeline */}
                      <div className="space-y-2">
                        <Label htmlFor="decisiontimeline">Decision Timeline</Label>
                        <SearchableDropdown
                          options={[
                            { value: 'Immediate', label: 'Immediate' },
                            { value: '<1 month', label: '<1 month' },
                            { value: '1-3 months', label: '1–3 months' },
                            { value: '3-6 months', label: '3–6 months' },
                            { value: '6+ months', label: '6+ months' }
                          ]}
                          value={formData.decisiontimeline}
                          onValueChange={createDropdownHandler('decisiontimeline')}
                          placeholder="Select decision timeline"
                        />
                      </div>

                      {/* Existing Solution */}
                      <div className="space-y-2">
                        <Label htmlFor="existingsolution">Existing Solution / Provider</Label>
                        <Input
                          id="existingsolution"
                          value={formData.existingsolution}
                          onChange={createInputHandler('existingsolution')}
                          placeholder="Enter existing solution/provider"
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>

                {/* Product/Services Line Items Section */}
                <div id="productLineItems">
                  <FormSection title="Products or Services" icon={Package} sectionKey="productLineItems">
                    <div className="space-y-4">
                      {/* Header Row */}
                      <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="col-span-3">Product or Service <span className="text-red-500">*</span></div>
                        <div className="col-span-2">Quantity <span className="text-red-500">*</span></div>
                        <div className="col-span-2">Currency</div>
                        <div className="col-span-2">Price <span className="text-red-500">*</span></div>
                        <div className="col-span-2">Discount (%)</div>
                        <div className="col-span-1">Actions</div>
                      </div>

                      {/* Line Items */}
                      {productLineItems.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {/* Product/Service Dropdown */}
                          <div className="col-span-3 space-y-2">
                            <SearchableDropdown
                              options={formData.businessunit ? productServicesOptions[formData.businessunit] || [] : []}
                              value={item.productService}
                              onValueChange={(value) => updateProductLineItem(item.id, 'productService', value)}
                              placeholder="Select product/service"
                              disabled={!formData.businessunit}
                            />
                            {!formData.businessunit && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                Please select Business Unit first
                              </p>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateProductLineItem(item.id, 'quantity', e.target.value)}
                              placeholder="Qty"
                              className="w-full"
                            />
                          </div>

                          {/* Currency */}
                          <div className="col-span-2">
                            <SearchableDropdown
                              options={currencyOptions}
                              value={item.currency}
                              onValueChange={(value) => updateProductLineItem(item.id, 'currency', value)}
                              placeholder="Currency"
                            />
                          </div>

                          {/* Price */}
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateProductLineItem(item.id, 'price', e.target.value)}
                              placeholder="Price"
                              className="w-full"
                            />
                          </div>

                          {/* Discount */}
                          <div className="col-span-2">
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={item.discount}
                                onChange={(e) => updateProductLineItem(item.id, 'discount', e.target.value)}
                                placeholder="0"
                                className="w-full pr-8"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                %
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex items-center justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProductLineItem(item.id)}
                              disabled={productLineItems.length === 1}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Remove line item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Total Amount Display */}
                          <div className="col-span-12 flex justify-end">
                            <div className="text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Line Total: </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {currencyOptions.find(c => c.value === item.currency)?.symbol || '$'}
                                {item.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Line Item Button */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addProductLineItem}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Product/Service</span>
                        </Button>

                        {/* Grand Total */}
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grand Total</div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${grandTotal.toFixed(2)}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Across {productLineItems.length} line item{productLineItems.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Help Text */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-2">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Product/Service Line Items</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              <li>Select Business Unit first to see available products/services</li>
                              <li>Discount is applied at line level (0-100%)</li>
                              <li>Total amount is auto-calculated: (Price × Quantity) - Discount</li>
                              <li>You can add multiple products/services to this deal</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>

                {/* Deal Context Section */}
                <div id="dealContext">
                  <FormSection title="Deal Context" icon={FileText} sectionKey="dealContext">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Deal Context */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="dealcontext">Deal Context</Label>
                        <Textarea
                          id="dealcontext"
                          value={formData.dealcontext}
                          onChange={createInputHandler('dealcontext')}
                          placeholder="Enter deal context and background"
                          rows={3}
                        />
                      </div>

                      {/* Next Step */}
                      <div className="space-y-2">
                        <Label htmlFor="nextstep">Next Step</Label>
                        <Input
                          id="nextstep"
                          value={formData.nextstep}
                          onChange={createInputHandler('nextstep')}
                          placeholder="Enter next step"
                        />
                      </div>

                      {/* Competitive Advantage */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="competitiveadvantage">Competitive Advantage</Label>
                        <Textarea
                          id="competitiveadvantage"
                          value={formData.competitiveadvantage}
                          onChange={createInputHandler('competitiveadvantage')}
                          placeholder="Enter competitive advantage"
                          rows={3}
                        />
                      </div>

                      {/* Budget Confirmation */}
                      <div className="space-y-2">
                        <Label htmlFor="budgetconfirmation">Budget Confirmation</Label>
                        <SearchableDropdown
                          options={[
                            { value: 'Confirmed', label: 'Confirmed' },
                            { value: 'To be confirmed', label: 'To be confirmed' },
                            { value: 'Not confirmed', label: 'Not confirmed' }
                          ]}
                          value={formData.budgetconfirmation}
                          onValueChange={createDropdownHandler('budgetconfirmation')}
                          placeholder="Select budget confirmation"
                        />
                      </div>

                      {/* Risks and Challenges */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="risksandchallenges">Risks and Challenges</Label>
                        <Textarea
                          id="risksandchallenges"
                          value={formData.risksandchallenges}
                          onChange={createInputHandler('risksandchallenges')}
                          placeholder="Enter risks and challenges"
                          rows={3}
                        />
                      </div>

                      {/* Stakeholder Information */}
                      <div className="space-y-2">
                        <Label htmlFor="stakeholderinformation">Stakeholder Information</Label>
                        <Input
                          id="stakeholderinformation"
                          value={formData.stakeholderinformation}
                          onChange={createInputHandler('stakeholderinformation')}
                          placeholder="Enter stakeholder information"
                        />
                      </div>

                      {/* Decision Criteria */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="decisioncriteria">Decision Criteria</Label>
                        <Textarea
                          id="decisioncriteria"
                          value={formData.decisioncriteria}
                          onChange={createInputHandler('decisioncriteria')}
                          placeholder="Enter decision criteria"
                          rows={3}
                        />
                      </div>

                      {/* Comments */}
                      <div className="space-y-2">
                        <Label htmlFor="comments">Comments</Label>
                        <Textarea
                          id="comments"
                          value={formData.comments}
                          onChange={createInputHandler('comments')}
                          placeholder="Enter additional comments"
                          rows={3}
                        />
                      </div>

                      {/* Uploaded Files */}
                      <div className="space-y-2 lg:col-span-3">
                        <Label>Uploaded Files (Max 5 files, 10MB each)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="fileUpload"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="fileUpload"
                            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                          >
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload files</span>
                          </label>
                        </div>
                        {formData.attachments.length > 0 && (
                          <div className="space-y-2">
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </FormSection>
                </div>
              </form>
            </div>
            
            {/* Fixed Footer with Buttons */}
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isConverting ? 'Add Deal' : deal ? 'Update Deal' : 'Create Deal'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealForm;
