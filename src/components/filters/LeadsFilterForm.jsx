import React, { useState, useEffect } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { SearchableDropdown } from '../ui/searchable-dropdown';

const LeadsFilterForm = ({ onFilter, onClear, loading = false }) => {
  // Filter state
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    status: '',
    source: '',
    owner: '',
    company: '',
    product: '',
    country: '',
    city: '',
    valueMin: '',
    valueMax: '',
    leadScoreMin: '',
    leadScoreMax: ''
  });

  // Mock data for dropdowns - in a real app, these would come from API calls
  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  const sourceOptions = [
    { value: 'Website', label: 'Website' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Cold Call', label: 'Cold Call' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Trade Show', label: 'Trade Show' },
    { value: 'Email Campaign', label: 'Email Campaign' },
    { value: 'Advertisement', label: 'Advertisement' }
  ];

  const ownerOptions = [
    { value: 'Alice Johnson', label: 'Alice Johnson' },
    { value: 'Bob Smith', label: 'Bob Smith' },
    { value: 'Carol Davis', label: 'Carol Davis' },
    { value: 'David Wilson', label: 'David Wilson' },
    { value: 'Eva Brown', label: 'Eva Brown' },
    { value: 'Frank Miller', label: 'Frank Miller' },
    { value: 'Grace Lee', label: 'Grace Lee' },
    { value: 'Henry Kim', label: 'Henry Kim' },
    { value: 'Ivy Chen', label: 'Ivy Chen' }
  ];

  const companyOptions = [
    { value: 'Tech Solutions Inc.', label: 'Tech Solutions Inc.' },
    { value: 'Global Enterprises', label: 'Global Enterprises' },
    { value: 'StartupXYZ', label: 'StartupXYZ' },
    { value: 'Digital Marketing Co.', label: 'Digital Marketing Co.' },
    { value: 'Manufacturing Ltd.', label: 'Manufacturing Ltd.' },
    { value: 'Healthcare Systems', label: 'Healthcare Systems' },
    { value: 'Finance Corp', label: 'Finance Corp' },
    { value: 'Retail Solutions', label: 'Retail Solutions' },
    { value: 'Tech Innovations', label: 'Tech Innovations' }
  ];

  const productOptions = [
    { value: 'CRM Software', label: 'CRM Software' },
    { value: 'Marketing Automation', label: 'Marketing Automation' },
    { value: 'Analytics Dashboard', label: 'Analytics Dashboard' },
    { value: 'Cloud Services', label: 'Cloud Services' },
    { value: 'Data Analytics', label: 'Data Analytics' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'E-commerce Platform', label: 'E-commerce Platform' },
    { value: 'AI Solutions', label: 'AI Solutions' }
  ];

  const countryOptions = [
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'India', label: 'India' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Brazil', label: 'Brazil' }
  ];

  const cityOptions = [
    { value: 'New York', label: 'New York' },
    { value: 'Toronto', label: 'Toronto' },
    { value: 'London', label: 'London' },
    { value: 'Sydney', label: 'Sydney' },
    { value: 'Berlin', label: 'Berlin' },
    { value: 'Paris', label: 'Paris' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Tokyo', label: 'Tokyo' },
    { value: 'São Paulo', label: 'São Paulo' }
  ];

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    // Convert empty string to empty value for consistency
    const filterValue = value === '' ? '' : value;
    setFilters(prev => ({
      ...prev,
      [field]: filterValue
    }));
  };

  // Handle search
  const handleSearch = () => {
    // Convert filters to API parameters
    const filterParams = {};
    
    if (filters.fromDate) {
      filterParams.created_date_after = filters.fromDate;
    }
    if (filters.toDate) {
      filterParams.created_date_before = filters.toDate;
    }
    if (filters.status) {
      filterParams.status = filters.status;
    }
    if (filters.source) {
      filterParams.source = filters.source;
    }
    if (filters.owner) {
      filterParams.owner = filters.owner;
    }
    if (filters.company) {
      filterParams.company = filters.company;
    }
    if (filters.product) {
      filterParams.product = filters.product;
    }
    if (filters.country) {
      filterParams.country = filters.country;
    }
    if (filters.city) {
      filterParams.city = filters.city;
    }
    if (filters.valueMin) {
      filterParams.valueMin = filters.valueMin;
    }
    if (filters.valueMax) {
      filterParams.valueMax = filters.valueMax;
    }
    if (filters.leadScoreMin) {
      filterParams.leadScoreMin = filters.leadScoreMin;
    }
    if (filters.leadScoreMax) {
      filterParams.leadScoreMax = filters.leadScoreMax;
    }

    onFilter(filterParams);
  };

  // Handle clear filters
  const handleClear = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      status: '',
      source: '',
      owner: '',
      company: '',
      product: '',
      country: '',
      city: '',
      valueMin: '',
      valueMax: '',
      leadScoreMin: '',
      leadScoreMax: ''
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
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
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
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
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
            onValueChange={(value) => handleFilterChange('status', value)}
            placeholder="Select Status"
            searchPlaceholder="Search statuses..."
            emptyText="No statuses found"
            className="h-8 text-xs"
          />
        </div>

        {/* Source */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Source
          </label>
          <SearchableDropdown
            options={sourceOptions}
            value={filters.source}
            onValueChange={(value) => handleFilterChange('source', value)}
            placeholder="Select Source"
            searchPlaceholder="Search sources..."
            emptyText="No sources found"
            className="h-8 text-xs"
          />
        </div>

        {/* Owner */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Owner
          </label>
          <SearchableDropdown
            options={ownerOptions}
            value={filters.owner}
            onValueChange={(value) => handleFilterChange('owner', value)}
            placeholder="Select Owner"
            searchPlaceholder="Search owners..."
            emptyText="No owners found"
            className="h-8 text-xs"
          />
        </div>

        {/* Company */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Company
          </label>
          <SearchableDropdown
            options={companyOptions}
            value={filters.company}
            onValueChange={(value) => handleFilterChange('company', value)}
            placeholder="Select Company"
            searchPlaceholder="Search companies..."
            emptyText="No companies found"
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Row 2 - Product, Location, and Value Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Product */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Product
          </label>
          <SearchableDropdown
            options={productOptions}
            value={filters.product}
            onValueChange={(value) => handleFilterChange('product', value)}
            placeholder="Select Product"
            searchPlaceholder="Search products..."
            emptyText="No products found"
            className="h-8 text-xs"
          />
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Country
          </label>
          <SearchableDropdown
            options={countryOptions}
            value={filters.country}
            onValueChange={(value) => handleFilterChange('country', value)}
            placeholder="Select Country"
            searchPlaceholder="Search countries..."
            emptyText="No countries found"
            className="h-8 text-xs"
          />
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            City
          </label>
          <SearchableDropdown
            options={cityOptions}
            value={filters.city}
            onValueChange={(value) => handleFilterChange('city', value)}
            placeholder="Select City"
            searchPlaceholder="Search cities..."
            emptyText="No cities found"
            className="h-8 text-xs"
          />
        </div>

        {/* Value Min */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Value Min ($)
          </label>
          <Input
            type="number"
            value={filters.valueMin}
            onChange={(e) => handleFilterChange('valueMin', e.target.value)}
            placeholder="Min value"
            className="h-8 text-xs"
          />
        </div>

        {/* Value Max */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Value Max ($)
          </label>
          <Input
            type="number"
            value={filters.valueMax}
            onChange={(e) => handleFilterChange('valueMax', e.target.value)}
            placeholder="Max value"
            className="h-8 text-xs"
          />
        </div>

        {/* Lead Score Min */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Lead Score Min
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={filters.leadScoreMin}
            onChange={(e) => handleFilterChange('leadScoreMin', e.target.value)}
            placeholder="Min score"
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Row 3 - Lead Score Max and Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Lead Score Max */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Lead Score Max
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={filters.leadScoreMax}
            onChange={(e) => handleFilterChange('leadScoreMax', e.target.value)}
            placeholder="Max score"
            className="h-8 text-xs"
          />
        </div>

        {/* Empty space for alignment */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>

        {/* Action Buttons */}
        <div className="flex items-end justify-end space-x-2">
          <Button
            onClick={handleSearch}
            disabled={loading}
            size="sm"
            className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white h-8 px-3"
          >
            <Search className="w-3 h-3" />
            <span className="text-xs">Search</span>
          </Button>
          
          {hasActiveFilters && (
            <Button
              onClick={handleClear}
              variant="outline"
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

export default LeadsFilterForm;
