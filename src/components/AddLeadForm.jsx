import React, { useState, useCallback, useMemo } from 'react';
import { 
  User, 
  Building2, 
  Package, 
  FileText, 
  X,
  Upload,
  Plus,
  Trash2,
  Search
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import Button from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { SearchableDropdown } from './ui/searchable-dropdown';
import { Select, SelectItem } from './ui/select';
import Card from './ui/card';
import { useAuth } from '../context/AuthContext';

const AddLeadForm = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  
  // Campaign data (same as Campaign page)
  const campaigns = [
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
  ];

  // Initial form data
  const initialFormData = {
    // Customer Information
    salutation: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    phoneNumber: '',
    dndStatus: false,
    emailAddress: '',
    preferredContactDateTime: '',
    customerSegment: '',
    designation: '',
    
    // Product Information
    businessUnit: '',
    productServices: '',
    estimatedBudget: '',
    decisionMakingAuthority: '',
    decisionTimeline: '',
    existingSolution: '',
    
    // Company Information
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    zipCode: '',
    companyCountry: '',
    location: '',
    companyEmployees: '',
    companyRevenue: '',
    industry: '',
    companyWebsite: '',
    companyPhone: '',
    companyEmail: '',
    companyType: '',
    gstTaxId: '',
    parentCompany: '',
    owner: '',
    
    // Lead Information
    mql: '',
    sql: '',
    leadStatus: '',
    leadRemark: '',
    leadSource: '',
    campaignName: '',
    leadOwner: '',
    leadGeneratedBy: '',
    leadType: '',
    leadSourceKeywords: '',
    activityType: '',
    remarks: '',
    competitorInfo: '',
    uploadedFiles: [],
    documentTypeTags: '',
    lostReason: '',
    leadPriority: '',
    nextActionType: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('companyInfo');

  // Search functionality
  const searchableFields = [
    'companyName', 'companyAddress', 'companyCity', 'companyState', 'zipCode', 'companyCountry',
    'location', 'companyEmployees', 'companyRevenue', 'industry', 'companyWebsite', 'companyPhone', 'companyEmail',
    'companyType', 'gstTaxId', 'parentCompany', 'owner', 'salutation', 'firstName', 'lastName',
    'mobileNumber', 'phoneNumber', 'emailAddress', 'preferredContactDateTime', 'customerSegment',
    'designation', 'businessUnit', 'productServices', 'estimatedBudget', 'decisionMakingAuthority',
    'decisionTimeline', 'existingSolution', 'mql', 'sql', 'leadStatus', 'leadRemark', 'leadSource',
    'campaignName', 'leadOwner', 'leadGeneratedBy', 'leadType', 'leadSourceKeywords', 'activityType',
    'remarks', 'competitorInfo', 'documentTypeTags', 'lostReason', 'leadPriority', 'nextActionType'
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
    { key: 'companyInfo', label: 'Company Information', icon: Building2 },
    { key: 'customerInfo', label: 'Customer Information', icon: User },
    { key: 'productInfo', label: 'Product Information', icon: Package },
    { key: 'leadInfo', label: 'Lead Information', icon: FileText }
  ];

  const scrollToSection = useCallback((sectionKey) => {
    setActiveSection(sectionKey);
    const element = document.getElementById(sectionKey);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Topbar component
  const Topbar = () => (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Lead</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new lead entry</p>
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

  // Dropdown options
  const salutationOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' }
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

  const leadStatusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Cold', label: 'Cold' },
    { value: 'Warm', label: 'Warm' },
    { value: 'Hot', label: 'Hot' },
    { value: 'Lead Lost', label: 'Lead Lost' },
    { value: 'Converted to Opportunity', label: 'Converted to Opportunity' }
  ];

  const activityTypeOptions = [
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'Demo', label: 'Demo' },
    { value: 'Personal Visit', label: 'Personal Visit' },
    { value: 'Presales Call', label: 'Presales Call' },
    { value: 'Other', label: 'Other' }
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
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  }, []);

  const removeFile = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.emailAddress) newErrors.emailAddress = 'Email address is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.companyAddress) newErrors.companyAddress = 'Company address is required';
    if (!formData.businessUnit) newErrors.businessUnit = 'Business unit is required';
    if (!formData.productServices) newErrors.productServices = 'Product/Services is required';
    if (!formData.leadStatus) newErrors.leadStatus = 'Lead status is required';
    if (!formData.leadOwner) newErrors.leadOwner = 'Lead owner is required';
    if (!formData.leadGeneratedBy) newErrors.leadGeneratedBy = 'Lead generated by is required';
    if (!formData.leadType) newErrors.leadType = 'Lead type is required';
    if (!formData.activityType) newErrors.activityType = 'Activity type is required';
    if (!formData.remarks) newErrors.remarks = 'Remarks is required';

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
      onSubmit(formData);
      resetForm();
      onClose();
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95rem] max-h-[90vh] p-0 z-50 !rounded-none" style={{ maxWidth: '85rem', zIndex: 9999 }} showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>Create a new lead entry with company, contact, product, and lead information</DialogDescription>
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
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information Section */}
          <div id="companyInfo">
            <FormSection title="Company Information" icon={Building2} sectionKey="companyInfo">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company Name */}
              <div className={`space-y-2 ${isFieldMatching('companyName') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
              </div>

              {/* Company Address */}
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address <span className="text-red-500">*</span></Label>
                <Textarea
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  placeholder="Enter company address"
                  className={errors.companyAddress ? 'border-red-500' : ''}
                />
                {errors.companyAddress && <p className="text-sm text-red-600">{errors.companyAddress}</p>}
              </div>

              {/* Company City */}
              <div className="space-y-2">
                <Label htmlFor="companyCity">Company City</Label>
                <Input
                  id="companyCity"
                  value={formData.companyCity}
                  onChange={(e) => handleInputChange('companyCity', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              {/* Company State */}
              <div className="space-y-2">
                <Label htmlFor="companyState">Company State</Label>
                <Input
                  id="companyState"
                  value={formData.companyState}
                  onChange={(e) => handleInputChange('companyState', e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              {/* Zip Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                />
              </div>

              {/* Company Country */}
              <div className="space-y-2">
                <Label htmlFor="companyCountry">Company Country</Label>
                <SearchableDropdown
                  options={[
                    { value: 'India', label: 'India' },
                    { value: 'USA', label: 'USA' },
                    { value: 'UK', label: 'UK' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'Australia', label: 'Australia' }
                  ]}
                  value={formData.companyCountry}
                  onValueChange={(value) => handleInputChange('companyCountry', value)}
                  placeholder="Select country"
                />
              </div>

              {/* Location */}
              <div className={`space-y-2 ${isFieldMatching('location') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter Location URL"
                />
              </div>

              {/* Company Employees */}
              <div className="space-y-2">
                <Label htmlFor="companyEmployees">Company Employees</Label>
                <SearchableDropdown
                  options={[
                    { value: '1-4', label: '1-4' },
                    { value: '5-9', label: '5-9' },
                    { value: '10-19', label: '10-19' },
                    { value: '20-49', label: '20-49' },
                    { value: '50-99', label: '50-99' },
                    { value: '100-249', label: '100-249' },
                    { value: '250-499', label: '250-499' }
                  ]}
                  value={formData.companyEmployees}
                  onValueChange={(value) => handleInputChange('companyEmployees', value)}
                  placeholder="Select employee count"
                />
              </div>

              {/* Company Revenue */}
              <div className="space-y-2">
                <Label htmlFor="companyRevenue">Company Revenue Size</Label>
                <SearchableDropdown
                  options={[
                    { value: '<$1M', label: '<$1M' },
                    { value: '$1M-$10M', label: '$1M - $10M' },
                    { value: '$10M-$50M', label: '$10M - $50M' },
                    { value: '$50M-$100M', label: '$50M - $100M' },
                    { value: '$100M-$500M', label: '$100M - $500M' },
                    { value: '$500M-$1B', label: '$500M - $1B' },
                    { value: '$1B+', label: '$1B+' }
                  ]}
                  value={formData.companyRevenue}
                  onValueChange={(value) => handleInputChange('companyRevenue', value)}
                  placeholder="Select revenue range"
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <SearchableDropdown
                  options={[
                    { value: 'Technology', label: 'Technology' },
                    { value: 'Healthcare', label: 'Healthcare' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Manufacturing', label: 'Manufacturing' },
                    { value: 'Retail', label: 'Retail' },
                    { value: 'Education', label: 'Education' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={formData.industry}
                  onValueChange={(value) => handleInputChange('industry', value)}
                  placeholder="Select industry"
                />
              </div>

              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  placeholder="Enter website URL"
                />
              </div>

              {/* Company Phone */}
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="companyPhone"
                  value={formData.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  placeholder="Enter company phone"
                  className={errors.companyPhone ? 'border-red-500' : ''}
                />
                {errors.companyPhone && <p className="text-sm text-red-600">{errors.companyPhone}</p>}
              </div>

              {/* Company Email */}
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email ID <span className="text-red-500">*</span></Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  placeholder="Enter company email"
                  className={errors.companyEmail ? 'border-red-500' : ''}
                />
                {errors.companyEmail && <p className="text-sm text-red-600">{errors.companyEmail}</p>}
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type</Label>
                <SearchableDropdown
                  options={[
                    { value: 'Pvt Ltd', label: 'Pvt Ltd' },
                    { value: 'LLP', label: 'LLP' },
                    { value: 'Govt', label: 'Govt' },
                    { value: 'NGO', label: 'NGO' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={formData.companyType}
                  onValueChange={(value) => handleInputChange('companyType', value)}
                  placeholder="Select company type"
                />
              </div>

              {/* GST/Tax ID */}
              <div className="space-y-2">
                <Label htmlFor="gstTaxId">GST / Tax ID</Label>
                <Input
                  id="gstTaxId"
                  value={formData.gstTaxId}
                  onChange={(e) => handleInputChange('gstTaxId', e.target.value)}
                  placeholder="Enter GST/Tax ID"
                />
              </div>

              {/* Parent Company */}
              <div className="space-y-2">
                <Label htmlFor="parentCompany">Parent Company / Group Name</Label>
                <Input
                  id="parentCompany"
                  value={formData.parentCompany}
                  onChange={(e) => handleInputChange('parentCompany', e.target.value)}
                  placeholder="Enter parent company name"
                />
              </div>

              {/* Owner */}
              <div className="space-y-2">
                <Label htmlFor="owner">Owner <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'user1', label: 'John Doe' },
                    { value: 'user2', label: 'Jane Smith' },
                    { value: 'user3', label: 'Mike Johnson' }
                  ]}
                  value={formData.owner}
                  onValueChange={(value) => handleInputChange('owner', value)}
                  placeholder="Select owner"
                />
                {errors.owner && <p className="text-sm text-red-600">{errors.owner}</p>}
              </div>
            </div>
            </FormSection>
          </div>

          {/* Customer Information Section */}
          <div id="customerInfo">
            <FormSection title="Customer Information" icon={User} sectionKey="customerInfo">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Salutation */}
              <div className="space-y-2">
                <Label htmlFor="salutation">Salutation <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={salutationOptions}
                  value={formData.salutation}
                  onValueChange={createDropdownHandler('salutation')}
                  placeholder="Select salutation"
                />
                {errors.salutation && <p className="text-sm text-red-600">{errors.salutation}</p>}
              </div>

              {/* First Name */}
              <div className={`space-y-2 ${isFieldMatching('firstName') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                <Label htmlFor="firstName">Contact First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={createInputHandler('firstName')}
                  placeholder="Enter first name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Contact Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="Enter mobile number"
                  className={errors.mobileNumber ? 'border-red-500' : ''}
                />
                {errors.mobileNumber && <p className="text-sm text-red-600">{errors.mobileNumber}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter phone number with area code"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* DND Button */}
              <div className="space-y-2">
                <Label>DND Status</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dndStatus"
                    checked={formData.dndStatus}
                    onChange={(e) => handleInputChange('dndStatus', e.target.checked)}
                  />
                  <Label htmlFor="dndStatus">Do Not Disturb</Label>
                </div>
              </div>

              {/* Email Address */}
              <div className={`space-y-2 ${isFieldMatching('emailAddress') ? 'bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                <Label htmlFor="emailAddress">Official Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.emailAddress ? 'border-red-500' : ''}
                />
                {errors.emailAddress && <p className="text-sm text-red-600">{errors.emailAddress}</p>}
              </div>

              {/* Preferred Contact Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="preferredContactDateTime">Preferred Contact Date/Time <span className="text-red-500">*</span></Label>
                <Input
                  id="preferredContactDateTime"
                  type="datetime-local"
                  value={formData.preferredContactDateTime}
                  onChange={(e) => handleInputChange('preferredContactDateTime', e.target.value)}
                  className={errors.preferredContactDateTime ? 'border-red-500' : ''}
                />
                {errors.preferredContactDateTime && <p className="text-sm text-red-600">{errors.preferredContactDateTime}</p>}
              </div>

              {/* Customer Segment */}
              <div className="space-y-2">
                <Label htmlFor="customerSegment">Customer Segment / Tier</Label>
                <SearchableDropdown
                  options={[
                    { value: 'SMB', label: 'SMB' },
                    { value: 'Mid-Market', label: 'Mid-Market' },
                    { value: 'Enterprise', label: 'Enterprise' }
                  ]}
                  value={formData.customerSegment}
                  onValueChange={(value) => handleInputChange('customerSegment', value)}
                  placeholder="Select customer segment"
                />
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Enter designation"
                  className={errors.designation ? 'border-red-500' : ''}
                />
                {errors.designation && <p className="text-sm text-red-600">{errors.designation}</p>}
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
                <Label htmlFor="businessUnit">Business Unit <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={businessUnitOptions}
                  value={formData.businessUnit}
                  onValueChange={(value) => handleInputChange('businessUnit', value)}
                  placeholder="Select business unit"
                />
                {errors.businessUnit && <p className="text-sm text-red-600">{errors.businessUnit}</p>}
              </div>

              {/* Product or Services */}
              <div className="space-y-2">
                <Label htmlFor="productServices">Product or Services <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={formData.businessUnit ? productServicesOptions[formData.businessUnit] || [] : []}
                  value={formData.productServices}
                  onValueChange={(value) => handleInputChange('productServices', value)}
                  placeholder="Select product/service"
                  disabled={!formData.businessUnit}
                />
                {errors.productServices && <p className="text-sm text-red-600">{errors.productServices}</p>}
              </div>

              {/* Estimated Budget */}
              <div className="space-y-2">
                <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                <Input
                  id="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                  placeholder="Enter estimated budget"
                />
              </div>

              {/* Decision Making Authority */}
              <div className="space-y-2">
                <Label htmlFor="decisionMakingAuthority">Decision Making Authority <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.decisionMakingAuthority}
                  onValueChange={(value) => handleInputChange('decisionMakingAuthority', value)}
                  placeholder="Select decision making authority"
                />
                {errors.decisionMakingAuthority && <p className="text-sm text-red-600">{errors.decisionMakingAuthority}</p>}
              </div>

              {/* Decision Timeline */}
              <div className="space-y-2">
                <Label htmlFor="decisionTimeline">Decision Timeline</Label>
                <SearchableDropdown
                  options={[
                    { value: 'Immediate', label: 'Immediate' },
                    { value: '<1 month', label: '<1 month' },
                    { value: '1-3 months', label: '1–3 months' },
                    { value: '3-6 months', label: '3–6 months' },
                    { value: '6+ months', label: '6+ months' }
                  ]}
                  value={formData.decisionTimeline}
                  onValueChange={(value) => handleInputChange('decisionTimeline', value)}
                  placeholder="Select decision timeline"
                />
              </div>

              {/* Existing Solution */}
              <div className="space-y-2">
                <Label htmlFor="existingSolution">Existing Solution / Provider</Label>
                <Input
                  id="existingSolution"
                  value={formData.existingSolution}
                  onChange={(e) => handleInputChange('existingSolution', e.target.value)}
                  placeholder="Enter existing solution/provider"
                />
              </div>
            </div>
            </FormSection>
          </div>

          {/* Lead Information Section */}
          <div id="leadInfo">
            <FormSection title="Lead Information" icon={FileText} sectionKey="leadInfo">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* MQL */}
              <div className="space-y-2">
                <Label htmlFor="mql">MQL <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.mql}
                  onValueChange={(value) => handleInputChange('mql', value)}
                  placeholder="Select MQL status"
                />
                {errors.mql && <p className="text-sm text-red-600">{errors.mql}</p>}
              </div>

              {/* SQL */}
              <div className="space-y-2">
                <Label htmlFor="sql">SQL <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.sql}
                  onValueChange={(value) => handleInputChange('sql', value)}
                  placeholder="Select SQL status"
                />
                {errors.sql && <p className="text-sm text-red-600">{errors.sql}</p>}
              </div>

              {/* Lead Status */}
              <div className="space-y-2">
                <Label htmlFor="leadStatus">Lead Status <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={leadStatusOptions}
                  value={formData.leadStatus}
                  onValueChange={(value) => handleInputChange('leadStatus', value)}
                  placeholder="Select lead status"
                />
                {errors.leadStatus && <p className="text-sm text-red-600">{errors.leadStatus}</p>}
              </div>

              {/* Lead Remark */}
              <div className="space-y-2">
                <Label htmlFor="leadRemark">Lead Remark <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'Cold', label: 'Cold' },
                    { value: 'Warm', label: 'Warm' },
                    { value: 'Hot', label: 'Hot' },
                    { value: 'Junk lead', label: 'Junk lead' },
                    { value: 'No response', label: 'No response' }
                  ]}
                  value={formData.leadRemark}
                  onValueChange={(value) => handleInputChange('leadRemark', value)}
                  placeholder="Select lead remark"
                />
                {errors.leadRemark && <p className="text-sm text-red-600">{errors.leadRemark}</p>}
              </div>

              {/* Lead Source */}
              <div className="space-y-2">
                <Label htmlFor="leadSource">Lead Source <span className="text-red-500">*</span></Label>
                <Input
                  id="leadSource"
                  value={formData.leadSource}
                  onChange={(e) => handleInputChange('leadSource', e.target.value)}
                  placeholder="Auto-populated from campaign"
                  disabled
                />
                {errors.leadSource && <p className="text-sm text-red-600">{errors.leadSource}</p>}
              </div>

              {/* Campaign Name */}
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={campaigns.map(campaign => ({
                    value: campaign.id,
                    label: campaign.name
                  }))}
                  value={formData.campaignName}
                  onValueChange={(value) => handleInputChange('campaignName', value)}
                  placeholder="Select campaign"
                  emptyText="No campaigns found"
                />
                {errors.campaignName && <p className="text-sm text-red-600">{errors.campaignName}</p>}
              </div>

              {/* Lead Owner */}
              <div className="space-y-2">
                <Label htmlFor="leadOwner">Lead Owner <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'owner1', label: 'Alice Johnson' },
                    { value: 'owner2', label: 'Bob Smith' },
                    { value: 'owner3', label: 'Carol Davis' }
                  ]}
                  value={formData.leadOwner}
                  onValueChange={(value) => handleInputChange('leadOwner', value)}
                  placeholder="Select lead owner"
                />
                {errors.leadOwner && <p className="text-sm text-red-600">{errors.leadOwner}</p>}
              </div>

              {/* Lead Generated By */}
              <div className="space-y-2">
                <Label htmlFor="leadGeneratedBy">Lead Generated By <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'user1', label: 'John Doe' },
                    { value: 'user2', label: 'Jane Smith' },
                    { value: 'user3', label: 'Mike Johnson' }
                  ]}
                  value={formData.leadGeneratedBy}
                  onValueChange={(value) => handleInputChange('leadGeneratedBy', value)}
                  placeholder="Select user"
                />
                {errors.leadGeneratedBy && <p className="text-sm text-red-600">{errors.leadGeneratedBy}</p>}
              </div>

              {/* Lead Type */}
              <div className="space-y-2">
                <Label htmlFor="leadType">Lead Type <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={[
                    { value: 'Competitor', label: 'Competitor' },
                    { value: 'Customer', label: 'Customer' },
                    { value: 'Partner', label: 'Partner' },
                    { value: 'Reseller', label: 'Reseller' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={formData.leadType}
                  onValueChange={(value) => handleInputChange('leadType', value)}
                  placeholder="Select lead type"
                />
                {errors.leadType && <p className="text-sm text-red-600">{errors.leadType}</p>}
              </div>

              {/* Lead Source Keywords */}
              <div className="space-y-2">
                <Label htmlFor="leadSourceKeywords">Lead Source Keywords</Label>
                <Input
                  id="leadSourceKeywords"
                  value={formData.leadSourceKeywords}
                  onChange={(e) => handleInputChange('leadSourceKeywords', e.target.value)}
                  placeholder="Enter keywords"
                />
              </div>

              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={activityTypeOptions}
                  value={formData.activityType}
                  onValueChange={(value) => handleInputChange('activityType', value)}
                  placeholder="Select activity type"
                />
                {errors.activityType && <p className="text-sm text-red-600">{errors.activityType}</p>}
              </div>

              {/* Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks <span className="text-red-500">*</span></Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Enter remarks"
                  className={errors.remarks ? 'border-red-500' : ''}
                />
                {errors.remarks && <p className="text-sm text-red-600">{errors.remarks}</p>}
              </div>

              {/* Competitor Info */}
              <div className="space-y-2">
                <Label htmlFor="competitorInfo">Competitor Info</Label>
                <Input
                  id="competitorInfo"
                  value={formData.competitorInfo}
                  onChange={(e) => handleInputChange('competitorInfo', e.target.value)}
                  placeholder="Enter competitor information"
                />
              </div>

              {/* Uploaded Files */}
              <div className="space-y-2 md:col-span-2">
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
                {formData.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {formData.uploadedFiles.map((file, index) => (
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

              {/* Document Type Tags */}
              <div className="space-y-2">
                <Label htmlFor="documentTypeTags">Document Type Tags</Label>
                <SearchableDropdown
                  options={[
                    { value: 'Quote', label: 'Quote' },
                    { value: 'NDA', label: 'NDA' },
                    { value: 'MOU', label: 'MOU' },
                    { value: 'PO', label: 'PO' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={formData.documentTypeTags}
                  onValueChange={(value) => handleInputChange('documentTypeTags', value)}
                  placeholder="Select document type"
                />
              </div>

              {/* Lost Reason */}
              <div className="space-y-2">
                <Label htmlFor="lostReason">Lost Reason</Label>
                <Input
                  id="lostReason"
                  value={formData.lostReason}
                  onChange={(e) => handleInputChange('lostReason', e.target.value)}
                  placeholder="Enter lost reason"
                />
              </div>

              {/* Lead Priority */}
              <div className="space-y-2">
                <Label htmlFor="leadPriority">Lead Priority</Label>
                <SearchableDropdown
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                    { value: 'Critical', label: 'Critical' }
                  ]}
                  value={formData.leadPriority}
                  onValueChange={(value) => handleInputChange('leadPriority', value)}
                  placeholder="Select priority"
                />
              </div>

              {/* Next Action Type */}
              <div className="space-y-2">
                <Label htmlFor="nextActionType">Next Action Type</Label>
                <SearchableDropdown
                  options={activityTypeOptions}
                  value={formData.nextActionType}
                  onValueChange={(value) => handleInputChange('nextActionType', value)}
                  placeholder="Select next action"
                />
              </div>
            </div>
            </FormSection>
          </div>
              </form>
            </div>
            
            {/* Fixed Footer with Buttons */}
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit}>
                Add Lead
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadForm;