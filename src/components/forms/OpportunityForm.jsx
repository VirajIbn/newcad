import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Loader2, DollarSign, Users, Building2, Calendar, TrendingUp, FileText, Upload, File, Paperclip, Clock, Target } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'react-toastify';

const OpportunityForm = ({ 
  opportunity = null, 
  onSubmit, 
  onCancel, 
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
      onCancel();
      return;
    }
  }, [user?.id, user?.orgId, user?.email, logout, onCancel]);

  const [formData, setFormData] = useState({
    // Opportunity Information
    opportunityname: '',
    opportunityownerid: user?.id || null,
    opportunitystage: 'Prospect',
    opportunityvalue: '',
    discountvalue: '',
    mrr: '',
    arr: '',
    revenuetype: 'One-time',
    expectedclosedate: '',
    actualclosedate: '',
    probability: 10,
    opportunitytype: 'New',
    leadsource: '',
    attachments: null,
    engagementscore: '',
    opportunityhealthindicator: 'Green',
    opportunitystatus: 'Open',
    opportunitycreateddate: new Date().toISOString().split('T')[0],
    
    // Customer Information
    customername: '',
    customeremail: '',
    customerphone: '',
    customercompany: '',
    customeraddress: '',
    customerdesignation: '',
    
    // Contact Information
    contactperson: '',
    contactemail: '',
    contactphone: '',
    contactdesignation: '',
    
    // Closing Details
    lostreason: '',
    nextstep: '',
    comments: '',
    expectedrevenue: '',
    actualcloserevenue: ''
  });

  const [errors, setErrors] = useState({});

  // Opportunity stages
  const opportunityStages = [
    'Prospect',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  // Opportunity types
  const opportunityTypes = [
    'New',
    'Existing',
    'Renewal',
    'Upgrade'
  ];

  // Opportunity statuses
  const opportunityStatuses = [
    'Open',
    'Closed',
    'On Hold',
    'Cancelled'
  ];

  // Health indicators
  const healthIndicators = [
    'Green',
    'Yellow',
    'Red'
  ];

  // Revenue types
  const revenueTypes = [
    'One-time',
    'Recurring',
    'Hybrid'
  ];

  // Initialize form data when opportunity prop changes
  useEffect(() => {
    if (opportunity) {
      setFormData({
        opportunityname: opportunity.opportunityname || '',
        opportunityownerid: opportunity.opportunityownerid || user?.id || null,
        opportunitystage: opportunity.opportunitystage || 'Prospect',
        opportunityvalue: opportunity.opportunityvalue || '',
        discountvalue: opportunity.discountvalue || '',
        mrr: opportunity.mrr || '',
        arr: opportunity.arr || '',
        revenuetype: opportunity.revenuetype || 'One-time',
        expectedclosedate: opportunity.expectedclosedate || '',
        actualclosedate: opportunity.actualclosedate || '',
        probability: opportunity.probability || 10,
        opportunitytype: opportunity.opportunitytype || 'New',
        leadsource: opportunity.leadsource || '',
        attachments: opportunity.attachments || null,
        engagementscore: opportunity.engagementscore || '',
        opportunityhealthindicator: opportunity.opportunityhealthindicator || 'Green',
        opportunitystatus: opportunity.opportunitystatus || 'Open',
        opportunitycreateddate: opportunity.opportunitycreateddate || new Date().toISOString().split('T')[0],
        customername: opportunity.customername || '',
        customeremail: opportunity.customeremail || '',
        customerphone: opportunity.customerphone || '',
        customercompany: opportunity.customercompany || '',
        customeraddress: opportunity.customeraddress || '',
        customerdesignation: opportunity.customerdesignation || '',
        contactperson: opportunity.contactperson || '',
        contactemail: opportunity.contactemail || '',
        contactphone: opportunity.contactphone || '',
        contactdesignation: opportunity.contactdesignation || '',
        lostreason: opportunity.lostreason || '',
        nextstep: opportunity.nextstep || '',
        comments: opportunity.comments || '',
        expectedrevenue: opportunity.expectedrevenue || '',
        actualcloserevenue: opportunity.actualcloserevenue || ''
      });
    }
  }, [opportunity, user?.id]);

  // Calculate final opportunity value
  const finalOpportunityValue = useMemo(() => {
    const value = parseFloat(formData.opportunityvalue) || 0;
    const discount = parseFloat(formData.discountvalue) || 0;
    return Math.max(0, value - discount);
  }, [formData.opportunityvalue, formData.discountvalue]);

  // Calculate opportunity age
  const opportunityAge = useMemo(() => {
    if (!formData.opportunitycreateddate) return 0;
    const createdDate = new Date(formData.opportunitycreateddate);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [formData.opportunitycreateddate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachments: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.opportunityname.trim()) {
      newErrors.opportunityname = 'Opportunity name is required';
    }
    if (!formData.opportunityownerid) {
      newErrors.opportunityownerid = 'Opportunity owner is required';
    }
    if (!formData.opportunitystage) {
      newErrors.opportunitystage = 'Opportunity stage is required';
    }
    if (!formData.opportunityvalue) {
      newErrors.opportunityvalue = 'Opportunity value is required';
    }
    if (!formData.expectedclosedate) {
      newErrors.expectedclosedate = 'Expected close date is required';
    }
    if (!formData.customername.trim()) {
      newErrors.customername = 'Customer name is required';
    }
    if (!formData.customeremail.trim()) {
      newErrors.customeremail = 'Customer email is required';
    }
    if (!formData.customerphone.trim()) {
      newErrors.customerphone = 'Customer phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const title = opportunity ? 'Edit Opportunity' : 'Add New Opportunity';
  const submitText = opportunity ? 'Update Opportunity' : 'Create Opportunity';

  // Don't render the form if user ID, orgId, or email is not available
  if (!user?.id || !user?.orgId || !user?.email) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onCancel}
    >
      <div className="w-full max-w-[95rem] max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden" style={{ maxWidth: '85rem' }} onClick={(e) => e.stopPropagation()}>
        {/* Topbar */}
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {opportunity ? 'Update opportunity details' : 'Create a new opportunity entry'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
          </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-4rem)] overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            <div className="flex-1 overflow-y-auto p-6">
        {/* Form */}
              <form id="opportunity-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Opportunity Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
              <DollarSign className="w-5 h-5" />
                    <h3>Opportunity Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Opportunity Name */}
                    <div className="space-y-2">
                      <Label htmlFor="opportunityname">
                        Opportunity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                        id="opportunityname"
                        value={formData.opportunityname}
                        onChange={(e) => handleInputChange('opportunityname', e.target.value)}
                  placeholder="e.g., AWS Setup – XYZ Ltd."
                        className={errors.opportunityname ? 'border-red-500' : ''}
                />
                      {errors.opportunityname && <p className="text-sm text-red-600">{errors.opportunityname}</p>}
              </div>

                    {/* Opportunity Owner */}
              <div className="space-y-2">
                      <Label htmlFor="opportunityownerid">
                        Opportunity Owner <span className="text-red-500">*</span>
                </Label>
                <select
                        id="opportunityownerid"
                        value={formData.opportunityownerid}
                        onChange={(e) => handleInputChange('opportunityownerid', e.target.value)}
                        className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.opportunityownerid ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Owner</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                      {errors.opportunityownerid && <p className="text-sm text-red-600">{errors.opportunityownerid}</p>}
              </div>

                    {/* Opportunity Stage */}
              <div className="space-y-2">
                      <Label htmlFor="opportunitystage">
                        Opportunity Stage <span className="text-red-500">*</span>
                </Label>
                <select
                        id="opportunitystage"
                        value={formData.opportunitystage}
                        onChange={(e) => handleInputChange('opportunitystage', e.target.value)}
                        className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.opportunitystage ? 'border-red-500' : ''}`}
                      >
                        {opportunityStages.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                      {errors.opportunitystage && <p className="text-sm text-red-600">{errors.opportunitystage}</p>}
              </div>

                    {/* Opportunity Value */}
              <div className="space-y-2">
                      <Label htmlFor="opportunityvalue">
                        Opportunity Value <span className="text-red-500">*</span>
                </Label>
                <Input
                        id="opportunityvalue"
                  type="number"
                        value={formData.opportunityvalue}
                        onChange={(e) => handleInputChange('opportunityvalue', e.target.value)}
                        placeholder="Enter amount"
                        className={errors.opportunityvalue ? 'border-red-500' : ''}
                      />
                      {errors.opportunityvalue && <p className="text-sm text-red-600">{errors.opportunityvalue}</p>}
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <Label htmlFor="discountvalue">Discount Value</Label>
                <Input
                  id="discountvalue"
                  type="number"
                  value={formData.discountvalue}
                  onChange={(e) => handleInputChange('discountvalue', e.target.value)}
                        placeholder="Enter discount amount"
                />
              </div>

                    {/* Final Opportunity Value */}
                <div className="space-y-2">
                      <Label>Final Opportunity Value</Label>
                  <Input
                        value={finalOpportunityValue.toLocaleString()}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700"
                  />
                      <p className="text-xs text-gray-500">Auto-calculated from opportunity value minus discount</p>
                </div>

              {/* MRR */}
              <div className="space-y-2">
                <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
                <Input
                  id="mrr"
                  type="number"
                  value={formData.mrr}
                  onChange={(e) => handleInputChange('mrr', e.target.value)}
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
                  onChange={(e) => handleInputChange('arr', e.target.value)}
                        placeholder="Enter ARR"
                />
              </div>

              {/* Revenue Type */}
              <div className="space-y-2">
                      <Label htmlFor="revenuetype">Revenue Type</Label>
                <select
                  id="revenuetype"
                  value={formData.revenuetype}
                  onChange={(e) => handleInputChange('revenuetype', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {revenueTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Expected Close Date */}
              <div className="space-y-2">
                <Label htmlFor="expectedclosedate">
                  Expected Close Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expectedclosedate"
                  type="date"
                  value={formData.expectedclosedate}
                  onChange={(e) => handleInputChange('expectedclosedate', e.target.value)}
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
                  onChange={(e) => handleInputChange('actualclosedate', e.target.value)}
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
                    onChange={(e) => handleInputChange('probability', e.target.value)}
                        placeholder="Enter probability"
                  />
              </div>

                    {/* Opportunity Type */}
              <div className="space-y-2">
                      <Label htmlFor="opportunitytype">Opportunity Type</Label>
                <select
                        id="opportunitytype"
                        value={formData.opportunitytype}
                        onChange={(e) => handleInputChange('opportunitytype', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {opportunityTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Lead Source */}
              <div className="space-y-2">
                <Label htmlFor="leadsource">Lead Source</Label>
                      <Input
                  id="leadsource"
                  value={formData.leadsource}
                  onChange={(e) => handleInputChange('leadsource', e.target.value)}
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
                  onChange={(e) => handleInputChange('engagementscore', e.target.value)}
                        placeholder="Enter engagement score"
                />
              </div>

                    {/* Opportunity Health Indicator */}
              <div className="space-y-2">
                      <Label htmlFor="opportunityhealthindicator">Opportunity Health Indicator</Label>
                <select
                        id="opportunityhealthindicator"
                        value={formData.opportunityhealthindicator}
                        onChange={(e) => handleInputChange('opportunityhealthindicator', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {healthIndicators.map(indicator => (
                          <option key={indicator} value={indicator}>{indicator}</option>
                  ))}
                </select>
              </div>

                    {/* Opportunity Status */}
                    <div className="space-y-2">
                      <Label htmlFor="opportunitystatus">Opportunity Status</Label>
                      <select
                        id="opportunitystatus"
                        value={formData.opportunitystatus}
                        onChange={(e) => handleInputChange('opportunitystatus', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {opportunityStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
              </div>

                    {/* Opportunity Created Date */}
                <div className="space-y-2">
                      <Label htmlFor="opportunitycreateddate">Opportunity Created Date</Label>
                  <Input
                        id="opportunitycreateddate"
                        type="date"
                        value={formData.opportunitycreateddate}
                        onChange={(e) => handleInputChange('opportunitycreateddate', e.target.value)}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700"
                  />
                      <p className="text-xs text-gray-500">Auto-generated when opportunity is created</p>
                </div>

                    {/* Opportunity Age */}
                <div className="space-y-2">
                      <Label>Opportunity Age</Label>
                  <Input
                        value={`${opportunityAge} days`}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700"
                  />
                      <p className="text-xs text-gray-500">From first contact to closure</p>
                </div>
            </div>
          </div>

          {/* Customer & Contact Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
              <Users className="w-5 h-5" />
              <h3>Customer & Contact Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customername">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customername"
                  value={formData.customername}
                  onChange={(e) => handleInputChange('customername', e.target.value)}
                  placeholder="Enter customer name"
                  className={errors.customername ? 'border-red-500' : ''}
                />
                      {errors.customername && <p className="text-sm text-red-600">{errors.customername}</p>}
              </div>

                    {/* Customer Email */}
              <div className="space-y-2">
                      <Label htmlFor="customeremail">
                        Customer Email <span className="text-red-500">*</span>
                </Label>
                <Input
                        id="customeremail"
                        type="email"
                        value={formData.customeremail}
                        onChange={(e) => handleInputChange('customeremail', e.target.value)}
                        placeholder="Enter customer email"
                        className={errors.customeremail ? 'border-red-500' : ''}
                      />
                      {errors.customeremail && <p className="text-sm text-red-600">{errors.customeremail}</p>}
              </div>

                    {/* Customer Phone */}
              <div className="space-y-2">
                      <Label htmlFor="customerphone">
                        Customer Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                        id="customerphone"
                        value={formData.customerphone}
                        onChange={(e) => handleInputChange('customerphone', e.target.value)}
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
                        onChange={(e) => handleInputChange('customercompany', e.target.value)}
                        placeholder="Enter customer company"
                      />
              </div>

                    {/* Customer Address */}
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="customeraddress">Customer Address</Label>
                      <Textarea
                        id="customeraddress"
                        value={formData.customeraddress}
                        onChange={(e) => handleInputChange('customeraddress', e.target.value)}
                        placeholder="Enter customer address"
                        rows={3}
                      />
                    </div>

                    {/* Customer Designation */}
              <div className="space-y-2">
                      <Label htmlFor="customerdesignation">Customer Designation</Label>
                <Input
                        id="customerdesignation"
                        value={formData.customerdesignation}
                        onChange={(e) => handleInputChange('customerdesignation', e.target.value)}
                        placeholder="Enter customer designation"
                />
              </div>

                    {/* Contact Person */}
                    <div className="space-y-2">
                      <Label htmlFor="contactperson">Contact Person</Label>
                      <Input
                        id="contactperson"
                        value={formData.contactperson}
                        onChange={(e) => handleInputChange('contactperson', e.target.value)}
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
                        onChange={(e) => handleInputChange('contactemail', e.target.value)}
                        placeholder="Enter contact email"
                      />
              </div>

                    {/* Contact Phone */}
              <div className="space-y-2">
                      <Label htmlFor="contactphone">Contact Phone</Label>
                <Input
                        id="contactphone"
                        value={formData.contactphone}
                        onChange={(e) => handleInputChange('contactphone', e.target.value)}
                        placeholder="Enter contact phone"
                      />
              </div>

                    {/* Contact Designation */}
              <div className="space-y-2">
                      <Label htmlFor="contactdesignation">Contact Designation</Label>
                      <Input
                        id="contactdesignation"
                        value={formData.contactdesignation}
                        onChange={(e) => handleInputChange('contactdesignation', e.target.value)}
                        placeholder="Enter contact designation"
                      />
              </div>

                    {/* Expected Revenue */}
              <div className="space-y-2">
                      <Label htmlFor="expectedrevenue">Expected Revenue</Label>
                      <Input
                        id="expectedrevenue"
                        type="number"
                        value={formData.expectedrevenue}
                        onChange={(e) => handleInputChange('expectedrevenue', e.target.value)}
                        placeholder="Enter expected revenue"
                      />
              </div>

                    {/* Actual Close Revenue */}
                    <div className="space-y-2">
                      <Label htmlFor="actualcloserevenue">Actual Close Revenue</Label>
                <Input
                        id="actualcloserevenue"
                        type="number"
                        value={formData.actualcloserevenue}
                        onChange={(e) => handleInputChange('actualcloserevenue', e.target.value)}
                        placeholder="Enter actual close revenue"
                />
              </div>
            </div>
          </div>

          {/* Closing Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
              <FileText className="w-5 h-5" />
              <h3>Closing Details</h3>
            </div>
            
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lost Reason */}
                    <div className="space-y-2">
                      <Label htmlFor="lostreason">Lost Reason</Label>
                      <Input
                    id="lostreason"
                    value={formData.lostreason}
                    onChange={(e) => handleInputChange('lostreason', e.target.value)}
                        placeholder="Enter lost reason if applicable"
                      />
                </div>

                    {/* Next Step */}
                    <div className="space-y-2">
                      <Label htmlFor="nextstep">Next Step</Label>
                      <Input
                        id="nextstep"
                        value={formData.nextstep}
                        onChange={(e) => handleInputChange('nextstep', e.target.value)}
                        placeholder="Enter next step"
                      />
              </div>

                    {/* Comments */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                        placeholder="Enter additional comments"
                  rows={4}
                />
              </div>

                    {/* File Upload */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="attachments">Attachments</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          id="attachments"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor="attachments"
                          className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload files</span>
                        </label>
                      </div>
                      {formData.attachments && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <File className="w-4 h-4" />
                          <span>{formData.attachments.name}</span>
                </div>
              )}
            </div>
                  </div>
                </div>
              </form>
          </div>

            {/* Fixed Footer with Buttons */}
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
              <Button type="submit" form="opportunity-form" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {submitText}
                </>
              )}
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityForm;