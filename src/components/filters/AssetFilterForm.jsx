import React, { useState, useEffect } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { SearchableDropdown } from '../ui/searchable-dropdown';
import { useAssetTypes, useAssetStatus, useEmployees, useBranches, useDepartments, useAssetCategories } from '../../hooks';
import { dropdownAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Convert API parameters back to form state
const convertAPIToFormState = (apiFilters) => {
  return {
    fromDate: apiFilters.purchase_date_after || '',
    toDate: apiFilters.purchase_date_before || '',
    assetCategory: apiFilters.assetcategoryid || '',
    assetType: apiFilters.assettypeid || '',
    status: apiFilters.status || '',
    assignedTo: apiFilters.employeeid || '',
    branch: apiFilters.branchid || '',
    department: apiFilters.departmentid || '',
    condition: apiFilters.conditionid || ''
  };
};

const AssetFilterForm = ({ onFilter, onClear, loading = false, activeFilters = {} }) => {
  const { user } = useAuth();
  
  // Filter state - initialize from activeFilters if provided
  const [filters, setFilters] = useState(() => convertAPIToFormState(activeFilters));

  // Dropdown data state
  const [conditions, setConditions] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [employeesLoadAttempted, setEmployeesLoadAttempted] = useState(false);

  // Existing hooks
  const { assetCategories, loading: assetCategoriesLoading } = useAssetCategories();
  const { assetTypes, loading: assetTypesLoading } = useAssetTypes();
  const { assetStatuses, loading: statusLoading } = useAssetStatus();
  const { employees, loading: employeesLoading, fetchEmployees } = useEmployees();
  const { branches, loading: branchesLoading, error: branchesError } = useBranches(user?.orgId);
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(user?.orgId);

  // Sync filters with activeFilters from parent when they change
  useEffect(() => {
    setFilters(convertAPIToFormState(activeFilters));
  }, [activeFilters]);

  // Debug: Log employees data changes
  useEffect(() => {
  }, [employees, employeesLoading]);

  // Load dropdown data on component mount
  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        // Load conditions and employees
        const conditionsData = await dropdownAPI.getAssetCondition();
        setConditions(conditionsData || []);
        
        // Load employees data
        try {
          setEmployeesLoadAttempted(true);
          await fetchEmployees();
        } catch (employeeError) {
          console.error('❌ AssetFilterForm: Failed to load employees:', employeeError);
          // Don't throw the error, just log it and continue
          // The employees array will remain empty and the dropdown will show "No employees found"
        }
      } catch (error) {
        console.error('Error loading filter dropdown data:', error);
        setConditions([]);
      } finally {
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [fetchEmployees]);

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
      filterParams.purchase_date_after = filters.fromDate;
    }
    if (filters.toDate) {
      filterParams.purchase_date_before = filters.toDate;
    }
    if (filters.assetCategory) {
      filterParams.assetcategoryid = filters.assetCategory;
    }
    if (filters.assetType) {
      filterParams.assettypeid = filters.assetType;
    }
    if (filters.status) {
      filterParams.status = filters.status;
    }
    if (filters.assignedTo) {
      filterParams.employeeid = filters.assignedTo;
    }
    if (filters.branch) {
      filterParams.branchid = filters.branch;
    }
    if (filters.department) {
      filterParams.departmentid = filters.department;
    }
    if (filters.condition) {
      filterParams.conditionid = filters.condition;
    }

    onFilter(filterParams);
  };

  // Handle clear filters
  const handleClear = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      assetCategory: '',
      assetType: '',
      status: '',
      assignedTo: '',
      branch: '',
      department: '',
      condition: ''
    });
    onClear();
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-3">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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

        {/* Asset Category */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Asset Category
          </label>
          <SearchableDropdown
            options={assetCategories.map((category) => ({
              value: category.assetcategoryid.toString(),
              label: category.categoryname
            }))}
            value={filters.assetCategory}
            onValueChange={(value) => handleFilterChange('assetCategory', value)}
            placeholder="Select Asset Category"
            searchPlaceholder="Search asset categories..."
            emptyText="No asset categories found"
            loading={assetCategoriesLoading}
            loadingText="Loading asset categories..."
            className="h-8 text-xs"
          />
        </div>

        {/* Asset Type */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Asset Type
          </label>
          <SearchableDropdown
            options={assetTypes.map((type) => ({
              value: type.assettypeid.toString(),
              label: type.assettypename
            }))}
            value={filters.assetType}
            onValueChange={(value) => handleFilterChange('assetType', value)}
            placeholder="Select Asset Type"
            searchPlaceholder="Search asset types..."
            emptyText="No asset types found"
            loading={assetTypesLoading}
            loadingText="Loading asset types..."
            className="h-8 text-xs"
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <SearchableDropdown
            options={assetStatuses.map((status) => ({
              value: status.codeid.toString(),
              label: status.codename
            }))}
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
            placeholder="Select Status"
            searchPlaceholder="Search statuses..."
            emptyText="No statuses found"
            loading={statusLoading}
            loadingText="Loading statuses..."
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Assigned To */}
        <div className="space-y-1 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Assigned To
            </label>
            {employees.length === 0 && !employeesLoading && employeesLoadAttempted && (
              <button
                type="button"
                onClick={() => fetchEmployees()}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                title="Retry loading employees"
              >
                Retry
              </button>
            )}
          </div>
          <SearchableDropdown
            options={employees.map((employee) => ({
              value: employee.employeeid.toString(),
              label: employee.name || employee.employeename || `${employee.firstname || ''} ${employee.lastname || ''}`.trim()
            }))}
            value={filters.assignedTo}
            onValueChange={(value) => handleFilterChange('assignedTo', value)}
            placeholder="Select Assigned To"
            searchPlaceholder="Search employees..."
            emptyText={employeesLoading ? "Loading employees..." : employeesLoadAttempted ? "No employees found. Click 'Retry' to reload." : "Loading employees..."}
            loading={employeesLoading}
            loadingText="Loading employees..."
            className="h-8 text-xs"
          />
        </div>
        {/* Branch */}
        <div className="space-y-1 flex flex-col justify-center">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Branch
          </label>
          <SearchableDropdown
            options={branches.map((branch) => ({
              value: branch.branchid.toString(),
              label: branch.branchname
            }))}
            value={filters.branch}
            onValueChange={(value) => handleFilterChange('branch', value)}
            placeholder="Select Branch"
            searchPlaceholder="Search branches..."
            emptyText="No branches found"
            loading={branchesLoading}
            loadingText="Loading branches..."
            className="h-8 text-xs"
          />
        </div>

        {/* Department */}
        <div className="space-y-1 flex flex-col justify-center">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Department
          </label>
          <SearchableDropdown
            options={departments.map((department) => ({
              value: department.departmentid.toString(),
              label: department.departmentname
            }))}
            value={filters.department}
            onValueChange={(value) => handleFilterChange('department', value)}
            placeholder="Select Department"
            searchPlaceholder="Search departments..."
            emptyText="No departments found"
            loading={departmentsLoading}
            loadingText="Loading departments..."
            className="h-8 text-xs"
          />
        </div>

        {/* Asset Condition */}
        <div className="space-y-1 flex flex-col justify-center">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Asset Condition
          </label>
          <SearchableDropdown
            options={conditions.map((condition) => ({
              value: condition.codeid.toString(),
              label: condition.codename
            }))}
            value={filters.condition}
            onValueChange={(value) => handleFilterChange('condition', value)}
            placeholder="Select Asset Condition"
            searchPlaceholder="Search conditions..."
            emptyText="No conditions found"
            loading={loadingDropdowns}
            loadingText="Loading conditions..."
            className="h-8 text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end space-x-2">
          <Button
            onClick={handleSearch}
            disabled={loading || loadingDropdowns || branchesLoading || departmentsLoading}
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

export default AssetFilterForm;
