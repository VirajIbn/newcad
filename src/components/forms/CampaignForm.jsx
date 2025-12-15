import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/card';
import { toast } from 'react-toastify';
import { SearchableDropdown } from '../ui/searchable-dropdown';
import { useEmployees } from '../../hooks/useEmployees';
import { useCountries } from '../../hooks/useCountries';
import { useDepartments } from '../../hooks/useDepartments';

const CampaignForm = ({ 
  campaign = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { user, logout } = useAuth();
  const { employees, fetchEmployees } = useEmployees();
  const { countries, fetchActiveCountries } = useCountries();
  const { departments, refetch: fetchDepartments } = useDepartments(user?.orgId);
  
  // Check if user ID, orgId, and email are available, if not logout
  useEffect(() => {
    if (!user?.id || !user?.orgId || !user?.email) {
      toast.error('User session invalid. Please login again.');
      logout();
      onCancel();
      return;
    }
  }, [user?.id, user?.orgId, user?.email, logout, onCancel]);

  // Campaign type options
  const campaignTypes = [
    { value: 'email', label: 'Email Campaign' },
    { value: 'sms', label: 'SMS Campaign' },
    { value: 'telecalling', label: 'Telecalling' },
    { value: 'whatsapp', label: 'WhatsApp Campaign' },
    { value: 'event', label: 'Event / Webinar' },
    { value: 'google_ads', label: 'Paid Ads – Google' },
    { value: 'facebook_ads', label: 'Paid Ads – Facebook' },
    { value: 'instagram_ads', label: 'Paid Ads – Instagram' },
    { value: 'linkedin', label: 'LinkedIn Campaign' },
    { value: 'referral', label: 'Referral Campaign' },
    { value: 'organic_social', label: 'Organic Social Media' },
    { value: 'seo', label: 'Inbound / SEO Campaign' },
    { value: 'content_syndication', label: 'Content Syndication' },
    { value: 'influencer', label: 'Influencer / Affiliate Campaign' },
    { value: 'others', label: 'Others' }
  ];

  // Campaign status options
  const campaignStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  // Revenue segment options
  const revenueSegments = [
    { value: '0-10k', label: '₹0 - ₹10,000' },
    { value: '10k-50k', label: '₹10,000 - ₹50,000' },
    { value: '50k-100k', label: '₹50,000 - ₹100,000' },
    { value: '100k-500k', label: '₹100,000 - ₹500,000' },
    { value: '500k-1m', label: '₹500,000 - ₹1,000,000' },
    { value: '1m+', label: '₹1,000,000+' }
  ];

  // Industry segment options
  const industrySegments = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  // Employee size segment options
  const employeeSizeSegments = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  const [formData, setFormData] = useState({
    campaignType: '',
    campaignName: '',
    campaignOwner: '',
    startDate: '',
    endDate: '',
    budget: '',
    targetLocation: [],
    businessUnits: [],
    productsServices: [],
    segments: [],
    revenueSegment: [],
    industrySegment: [],
    employeeSizeSegment: [],
    notes: '',
    campaignStatus: 'active',
    campaignObjective: '',
    expectedLeads: '',
    spendEntries: [],
    resourceFiles: [],
    orgid: user?.orgId,
    addedby: user?.id,
    modifiedby: user?.id,
  });

  const [errors, setErrors] = useState({});
  const [newSpendEntry, setNewSpendEntry] = useState({
    dateFrom: '',
    dateTo: '',
    amount: '',
    description: ''
  });

  // Initialize form with campaign data if editing
  useEffect(() => {
    if (!user?.id || !user?.orgId || !user?.email) {
      return;
    }

    if (campaign) {
      setFormData({
        campaignType: campaign.campaignType || '',
        campaignName: campaign.campaignName || '',
        campaignOwner: campaign.campaignOwner || '',
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        budget: campaign.budget || '',
        targetLocation: campaign.targetLocation || [],
        businessUnits: campaign.businessUnits || [],
        productsServices: campaign.productsServices || [],
        segments: campaign.segments || [],
        revenueSegment: campaign.revenueSegment || [],
        industrySegment: campaign.industrySegment || [],
        employeeSizeSegment: campaign.employeeSizeSegment || [],
        notes: campaign.notes || '',
        campaignStatus: campaign.campaignStatus || 'active',
        campaignObjective: campaign.campaignObjective || '',
        expectedLeads: campaign.expectedLeads || '',
        spendEntries: campaign.spendEntries || [],
        resourceFiles: campaign.resourceFiles || [],
        orgid: user?.orgId,
        addedby: campaign.addedby,
        modifiedby: user?.id,
      });
    } else {
      setFormData({
        campaignType: '',
        campaignName: '',
        campaignOwner: '',
        startDate: '',
        endDate: '',
        budget: '',
        targetLocation: [],
        businessUnits: [],
        productsServices: [],
        segments: [],
        revenueSegment: [],
        industrySegment: [],
        employeeSizeSegment: [],
        notes: '',
        campaignStatus: 'active',
        campaignObjective: '',
        expectedLeads: '',
        spendEntries: [],
        resourceFiles: [],
        orgid: user?.orgId,
        addedby: user?.id,
        modifiedby: user?.id,
      });
    }
  }, [campaign, user]);

  // Load data on component mount
  useEffect(() => {
    if (user?.orgId) {
      fetchEmployees();
      fetchActiveCountries();
      fetchDepartments(user.orgId);
    }
  }, [user?.orgId, fetchEmployees, fetchActiveCountries, fetchDepartments]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.campaignType) {
      newErrors.campaignType = 'Campaign Type is required';
    }

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = 'Campaign Name is required';
    } else if (formData.campaignName.length > 200) {
      newErrors.campaignName = 'Campaign Name must be 200 characters or less';
    }

    if (!formData.campaignOwner) {
      newErrors.campaignOwner = 'Campaign Owner is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required';
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End Date must be after Start Date';
    }

    if (formData.budget && (isNaN(formData.budget) || parseFloat(formData.budget) < 0)) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    if (!formData.targetLocation || formData.targetLocation.length === 0) {
      newErrors.targetLocation = 'Target Location is required';
    }

    if (!formData.businessUnits || formData.businessUnits.length === 0) {
      newErrors.businessUnits = 'Business Units is required';
    }

    if (!formData.productsServices || formData.productsServices.length === 0) {
      newErrors.productsServices = 'Products & Services is required';
    }

    if (!formData.segments || formData.segments.length === 0) {
      newErrors.segments = 'Segments is required';
    }

    if (formData.expectedLeads && (isNaN(formData.expectedLeads) || parseInt(formData.expectedLeads) < 0)) {
      newErrors.expectedLeads = 'Expected Leads must be a valid positive number';
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'Notes must be 1000 characters or less';
    }

    if (formData.campaignObjective && formData.campaignObjective.length > 500) {
      newErrors.campaignObjective = 'Campaign Objective must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id || !user?.orgId || !user?.email) {
      toast.error('User session invalid. Please login again.');
      logout();
      onCancel();
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    const submitData = { ...formData };
    
    if (campaign) {
      submitData.modifiedby = user?.id;
      submitData.addedby = campaign.addedby;
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle multiselect changes
  const handleMultiselectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Add spend entry
  const addSpendEntry = () => {
    if (!newSpendEntry.dateFrom || !newSpendEntry.amount) {
      toast.error('Date From and Amount are required for spend entry');
      return;
    }

    const spendEntry = {
      id: Date.now(),
      ...newSpendEntry,
      amount: parseFloat(newSpendEntry.amount)
    };

    setFormData(prev => ({
      ...prev,
      spendEntries: [...prev.spendEntries, spendEntry]
    }));

    setNewSpendEntry({
      dateFrom: '',
      dateTo: '',
      amount: '',
      description: ''
    });
  };

  // Remove spend entry
  const removeSpendEntry = (id) => {
    setFormData(prev => ({
      ...prev,
      spendEntries: prev.spendEntries.filter(entry => entry.id !== id)
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      resourceFiles: [...prev.resourceFiles, ...files]
    }));
  };

  // Remove file
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      resourceFiles: prev.resourceFiles.filter((_, i) => i !== index)
    }));
  };

  const isEditing = !!campaign;
  const title = isEditing ? 'Edit Campaign' : 'Add New Campaign';
  const submitText = isEditing ? 'Update' : 'Add';

  if (!user?.id || !user?.orgId || !user?.email) {
    return null;
  }

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not child elements
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Type */}
            <div className="space-y-2">
              <Label htmlFor="campaignType">
                Campaign Type/Lead Source <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={campaignTypes}
                value={formData.campaignType}
                onValueChange={(value) => handleInputChange('campaignType', value)}
                placeholder="Select campaign type"
                className={errors.campaignType ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.campaignType && (
                <p className="text-sm text-red-500">{errors.campaignType}</p>
              )}
            </div>

            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaignName">
                Campaign Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="campaignName"
                value={formData.campaignName}
                onChange={(e) => handleInputChange('campaignName', e.target.value)}
                placeholder="Enter campaign name"
                className={errors.campaignName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.campaignName && (
                <p className="text-sm text-red-500">{errors.campaignName}</p>
              )}
            </div>

            {/* Campaign Owner */}
            <div className="space-y-2">
              <Label htmlFor="campaignOwner">
                Campaign Owner <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
                value={formData.campaignOwner}
                onValueChange={(value) => handleInputChange('campaignOwner', value)}
                placeholder="Select campaign owner"
                className={errors.campaignOwner ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.campaignOwner && (
                <p className="text-sm text-red-500">{errors.campaignOwner}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Enter budget amount in ₹"
                className={errors.budget ? 'border-red-500' : ''}
                disabled={loading}
                min="0"
                step="0.01"
              />
              {errors.budget && (
                <p className="text-sm text-red-500">{errors.budget}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>

            {/* Target Location */}
            <div className="space-y-2">
              <Label htmlFor="targetLocation">
                Target Location <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={countries.map(country => ({ value: country.id, label: country.name }))}
                value={formData.targetLocation}
                onValueChange={(value) => handleMultiselectChange('targetLocation', value)}
                placeholder="Select target locations"
                className={errors.targetLocation ? 'border-red-500' : ''}
                disabled={loading}
                multiple
              />
              {errors.targetLocation && (
                <p className="text-sm text-red-500">{errors.targetLocation}</p>
              )}
            </div>

            {/* Business Units */}
            <div className="space-y-2">
              <Label htmlFor="businessUnits">
                Business Units <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                value={formData.businessUnits}
                onValueChange={(value) => handleMultiselectChange('businessUnits', value)}
                placeholder="Select business units"
                className={errors.businessUnits ? 'border-red-500' : ''}
                disabled={loading}
                multiple
              />
              {errors.businessUnits && (
                <p className="text-sm text-red-500">{errors.businessUnits}</p>
              )}
            </div>

            {/* Products & Services */}
            <div className="space-y-2">
              <Label htmlFor="productsServices">
                Products & Services <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={[]} // This would be populated from Product Master
                value={formData.productsServices}
                onValueChange={(value) => handleMultiselectChange('productsServices', value)}
                placeholder="Select products & services"
                className={errors.productsServices ? 'border-red-500' : ''}
                disabled={loading}
                multiple
              />
              {errors.productsServices && (
                <p className="text-sm text-red-500">{errors.productsServices}</p>
              )}
            </div>

            {/* Segments */}
            <div className="space-y-2">
              <Label htmlFor="segments">
                Segments <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={[
                  { value: 'smb', label: 'SMB' },
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'startup', label: 'Startup' },
                  { value: 'mid_market', label: 'Mid Market' }
                ]}
                value={formData.segments}
                onValueChange={(value) => handleMultiselectChange('segments', value)}
                placeholder="Select segments"
                className={errors.segments ? 'border-red-500' : ''}
                disabled={loading}
                multiple
              />
              {errors.segments && (
                <p className="text-sm text-red-500">{errors.segments}</p>
              )}
            </div>

            {/* Revenue Segment */}
            <div className="space-y-2">
              <Label htmlFor="revenueSegment">Revenue Segment</Label>
              <SearchableDropdown
                options={revenueSegments}
                value={formData.revenueSegment}
                onValueChange={(value) => handleMultiselectChange('revenueSegment', value)}
                placeholder="Select revenue segments"
                disabled={loading}
                multiple
              />
            </div>

            {/* Industry Segment */}
            <div className="space-y-2">
              <Label htmlFor="industrySegment">Industry Segment</Label>
              <SearchableDropdown
                options={industrySegments}
                value={formData.industrySegment}
                onValueChange={(value) => handleMultiselectChange('industrySegment', value)}
                placeholder="Select industry segments"
                disabled={loading}
                multiple
              />
            </div>

            {/* Employee Size Segment */}
            <div className="space-y-2">
              <Label htmlFor="employeeSizeSegment">Employee Size Segment</Label>
              <SearchableDropdown
                options={employeeSizeSegments}
                value={formData.employeeSizeSegment}
                onValueChange={(value) => handleMultiselectChange('employeeSizeSegment', value)}
                placeholder="Select employee size segments"
                disabled={loading}
                multiple
              />
            </div>

            {/* Campaign Status */}
            <div className="space-y-2">
              <Label htmlFor="campaignStatus">
                Campaign Status <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={campaignStatuses}
                value={formData.campaignStatus}
                onValueChange={(value) => handleInputChange('campaignStatus', value)}
                placeholder="Select campaign status"
                disabled={loading}
              />
            </div>

            {/* Expected Leads */}
            <div className="space-y-2">
              <Label htmlFor="expectedLeads">Expected Leads</Label>
              <Input
                id="expectedLeads"
                type="number"
                value={formData.expectedLeads}
                onChange={(e) => handleInputChange('expectedLeads', e.target.value)}
                placeholder="Enter expected leads"
                className={errors.expectedLeads ? 'border-red-500' : ''}
                disabled={loading}
                min="0"
              />
              {errors.expectedLeads && (
                <p className="text-sm text-red-500">{errors.expectedLeads}</p>
              )}
            </div>

            {/* Campaign Resource Cost */}
            <div className="space-y-2">
              <Label htmlFor="resourceFiles">Campaign Resource Cost</Label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resourceFiles"
                  disabled={loading}
                />
                <label 
                  htmlFor="resourceFiles" 
                  className="flex items-center justify-center w-full px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {formData.resourceFiles.length > 0 
                      ? `${formData.resourceFiles.length} file(s) selected`
                      : 'Choose files'
                    }
                  </span>
                </label>
              </div>
              {formData.resourceFiles.length > 0 && (
                <div className="space-y-1">
                  {formData.resourceFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 text-xs bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={loading}
                        className="p-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spend Entries */}
          <div className="space-y-4">
            <Label>Spend Entries</Label>
            <div className="border rounded-lg p-4 space-y-4">
              {/* Add New Spend Entry */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="spendDateFrom">Date From</Label>
                  <Input
                    id="spendDateFrom"
                    type="date"
                    value={newSpendEntry.dateFrom}
                    onChange={(e) => setNewSpendEntry(prev => ({ ...prev, dateFrom: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="spendDateTo">Date To</Label>
                  <Input
                    id="spendDateTo"
                    type="date"
                    value={newSpendEntry.dateTo}
                    onChange={(e) => setNewSpendEntry(prev => ({ ...prev, dateTo: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="spendAmount">Amount</Label>
                  <Input
                    id="spendAmount"
                    type="number"
                    value={newSpendEntry.amount}
                    onChange={(e) => setNewSpendEntry(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    disabled={loading}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addSpendEntry}
                    disabled={loading}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Cost
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="spendDescription">Description</Label>
                <Input
                  id="spendDescription"
                  value={newSpendEntry.description}
                  onChange={(e) => setNewSpendEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  disabled={loading}
                />
              </div>

              {/* Display Spend Entries */}
              {formData.spendEntries.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Added Spend Entries:</h4>
                  {formData.spendEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">₹{entry.amount}</span>
                        <span className="text-gray-500 ml-2">
                          {entry.dateFrom} - {entry.dateTo}
                        </span>
                        {entry.description && (
                          <span className="text-gray-500 ml-2">({entry.description})</span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpendEntry(entry.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Notes and Campaign Objective */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter internal notes or additional context"
                className={errors.notes ? 'border-red-500' : ''}
                rows={3}
                maxLength={1000}
                disabled={loading}
              />
              <div className="flex justify-between items-center">
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.notes.length}/1000
                </p>
              </div>
            </div>

            {/* Campaign Objective */}
            <div className="space-y-2">
              <Label htmlFor="campaignObjective">Campaign Objective</Label>
              <Textarea
                id="campaignObjective"
                value={formData.campaignObjective}
                onChange={(e) => handleInputChange('campaignObjective', e.target.value)}
                placeholder="Define the goal or purpose of the campaign"
                className={errors.campaignObjective ? 'border-red-500' : ''}
                rows={3}
                maxLength={500}
                disabled={loading}
              />
              <div className="flex justify-between items-center">
                {errors.campaignObjective && (
                  <p className="text-sm text-red-500">{errors.campaignObjective}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.campaignObjective.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Hidden fields */}
          <input type="hidden" value={formData.orgid} />
          <input type="hidden" value={formData.addedby} />
          <input type="hidden" value={formData.modifiedby} />

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
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
        </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CampaignForm;
