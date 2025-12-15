import React, { useState, useEffect } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import Button from './ui/button';
import { Input } from './ui/input';
import { SearchableDropdown } from './ui/searchable-dropdown';

const CampaignFilterForm = ({ onFilter, onClear, loading = false }) => {
  // Filter state
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    status: '',
    type: '',
    createdBy: '',
    targetAudience: '',
    budgetMin: '',
    budgetMax: '',
    spentMin: '',
    spentMax: '',
    leadsMin: '',
    leadsMax: '',
    conversionRateMin: '',
    conversionRateMax: ''
  });

  // Mock data for dropdowns - in a real app, these would come from API calls
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'draft', label: 'Draft' }
  ];

  const typeOptions = [
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
    { value: 'seo', label: 'Inbound / SEO Campaign' }
  ];

  const createdByOptions = [
    { value: 'John Smith', label: 'John Smith' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Mike Chen', label: 'Mike Chen' },
    { value: 'Emily Davis', label: 'Emily Davis' },
    { value: 'David Wilson', label: 'David Wilson' },
    { value: 'Lisa Anderson', label: 'Lisa Anderson' },
    { value: 'Robert Taylor', label: 'Robert Taylor' },
    { value: 'Jennifer Brown', label: 'Jennifer Brown' }
  ];

  const targetAudienceOptions = [
    { value: 'Existing Customers', label: 'Existing Customers' },
    { value: 'Tech Enthusiasts', label: 'Tech Enthusiasts' },
    { value: 'Business Professionals', label: 'Business Professionals' },
    { value: 'General Audience', label: 'General Audience' },
    { value: 'Industry Professionals', label: 'Industry Professionals' },
    { value: 'Existing Leads', label: 'Existing Leads' },
    { value: 'Search Users', label: 'Search Users' }
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle filter application
  const handleApplyFilters = () => {
    // Remove empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onFilter(activeFilters);
  };

  // Handle filter clear
  const handleClearFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      status: '',
      type: '',
      createdBy: '',
      targetAudience: '',
      budgetMin: '',
      budgetMax: '',
      spentMin: '',
      spentMax: '',
      leadsMin: '',
      leadsMax: '',
      conversionRateMin: '',
      conversionRateMax: ''
    });
    onClear();
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Row 1 - Date Range and Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Date Range Container */}
        <div className="md:col-span-2">
          <div className="flex items-end space-x-2">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  className="pl-8 h-8 text-xs"
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>
            
            {/* To Label */}
            <div className="flex items-end">
              <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded mb-1">
                To
              </div>
            </div>
            
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  className="pl-8 h-8 text-xs"
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <SearchableDropdown
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleInputChange('status', value)}
            placeholder="Select Status"
            searchPlaceholder="Search statuses..."
            emptyText="No statuses found"
            className="h-8 text-xs"
          />
        </div>

        {/* Campaign Type */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <SearchableDropdown
            options={typeOptions}
            value={filters.type}
            onChange={(value) => handleInputChange('type', value)}
            placeholder="Select Type"
            searchPlaceholder="Search types..."
            emptyText="No types found"
            className="h-8 text-xs"
          />
        </div>

        {/* Created By */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Created By
          </label>
          <SearchableDropdown
            options={createdByOptions}
            value={filters.createdBy}
            onChange={(value) => handleInputChange('createdBy', value)}
            placeholder="Select Creator"
            searchPlaceholder="Search creators..."
            emptyText="No creators found"
            className="h-8 text-xs"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Target Audience
          </label>
          <SearchableDropdown
            options={targetAudienceOptions}
            value={filters.targetAudience}
            onChange={(value) => handleInputChange('targetAudience', value)}
            placeholder="Select Audience"
            searchPlaceholder="Search audiences..."
            emptyText="No audiences found"
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Row 2 - Financial and Leads Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Budget Min */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Budget Min (₹)
          </label>
          <Input
            type="number"
            value={filters.budgetMin}
            onChange={(e) => handleInputChange('budgetMin', e.target.value)}
            placeholder="Min budget"
            className="h-8 text-xs"
          />
        </div>

        {/* Budget Max */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Budget Max (₹)
          </label>
          <Input
            type="number"
            value={filters.budgetMax}
            onChange={(e) => handleInputChange('budgetMax', e.target.value)}
            placeholder="Max budget"
            className="h-8 text-xs"
          />
        </div>

        {/* Spent Min */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Spent Min (₹)
          </label>
          <Input
            type="number"
            value={filters.spentMin}
            onChange={(e) => handleInputChange('spentMin', e.target.value)}
            placeholder="Min spent"
            className="h-8 text-xs"
          />
        </div>

        {/* Spent Max */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Spent Max (₹)
          </label>
          <Input
            type="number"
            value={filters.spentMax}
            onChange={(e) => handleInputChange('spentMax', e.target.value)}
            placeholder="Max spent"
            className="h-8 text-xs"
          />
        </div>

        {/* Leads Min */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Leads Min
          </label>
          <Input
            type="number"
            value={filters.leadsMin}
            onChange={(e) => handleInputChange('leadsMin', e.target.value)}
            placeholder="Min leads"
            className="h-8 text-xs"
          />
        </div>

        {/* Leads Max */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Leads Max
          </label>
          <Input
            type="number"
            value={filters.leadsMax}
            onChange={(e) => handleInputChange('leadsMax', e.target.value)}
            placeholder="Max leads"
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Row 3 - Performance Filters and Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Conversion Rate Min */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Conversion Rate Min
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={filters.conversionRateMin}
            onChange={(e) => handleInputChange('conversionRateMin', e.target.value)}
            placeholder="Min rate"
            className="h-8 text-xs"
          />
        </div>

        {/* Conversion Rate Max */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Conversion Rate Max
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={filters.conversionRateMax}
            onChange={(e) => handleInputChange('conversionRateMax', e.target.value)}
            placeholder="Max rate"
            className="h-8 text-xs"
          />
        </div>

        {/* Empty space for alignment */}
        <div></div>
        <div></div>

        {/* Action Buttons */}
        <div className="flex items-end justify-end space-x-2">
          <Button
            onClick={handleApplyFilters}
            disabled={loading}
            size="sm"
            className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white h-8 px-3"
          >
            <Search className="w-3 h-3" />
            <span className="text-xs">Search</span>
          </Button>

           {hasActiveFilters && (
             <Button
               variant="outline"
               onClick={handleClearFilters}
               size="sm"
               className="flex items-center space-x-1 h-8 px-3"
             >
               <X className="w-3 h-3" />
               <span className="text-xs">Clear</span>
             </Button>
           )}
        </div>
      </div>
    </div>
  );
};

export default CampaignFilterForm;
