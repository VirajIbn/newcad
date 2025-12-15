import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useZodForm } from '../../hooks/useZodForm';
import { assetDetailsSchema } from '../../lib/validations';
import { dropdownAPI } from '../../services/api';
import { formatDateForInput } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import { useFinancialYearContext } from '../../context/FinancialYearContext';
import { useBranches, useDepartments } from '../../hooks';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SearchableDropdown } from '../ui/searchable-dropdown';
import { X, Save, Loader2, Package, Calendar, DollarSign, MapPin, User, Building2 } from 'lucide-react';

const AssetDetailsForm = ({ 
  asset, 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false,
  assetTypes = [],
  manufacturers = [],
  vendors = [],
  employees = [],
  assetTypesLoading = false,
  assetTypesError = null,
  manufacturersLoading = false,
  manufacturersError = null,
  vendorsLoading = false,
  vendorsError = null,
  employeesLoading = false,
  employeesError = null,
  loadDropdownData = null
}) => {
  const { user } = useAuth();
  const { selectedFinancialYear } = useFinancialYearContext();
  
  // Branch and Department hooks
  const { branches, loading: branchesLoading, error: branchesError } = useBranches(user?.orgId);
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(user?.orgId);
  
  // Manual dropdown data state (no auto-loading)
  const [assetStatuses, setAssetStatuses] = useState([]);
  const [assetConditions, setAssetConditions] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [conditionLoading, setConditionLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [conditionError, setConditionError] = useState(null);

  // State to track if dropdown data is being loaded
  const [isLoadingDropdownData, setIsLoadingDropdownData] = useState(false);

  // Load dropdown data when form opens
  useEffect(() => {
    if (isOpen && loadDropdownData) {
      setIsLoadingDropdownData(true);
      setStatusLoading(true);
      setConditionLoading(true);
      setStatusError(null);
      setConditionError(null);
      
      // Load all dropdown data including status and condition
      const loadAllDropdownData = async () => {
        try {
          // Load status and condition data using authenticated API service
          const [statusData, conditionData] = await Promise.all([
            dropdownAPI.getAssetStatus(),
            dropdownAPI.getAssetCondition()
          ]);
          
          // Filter out "Record Deleted" status for forms (add/update operations)
          const filteredStatusData = statusData.filter(status => status.codename !== 'Record Deleted');
          setAssetStatuses(filteredStatusData);
          setAssetConditions(conditionData);
          
          // Load other dropdown data
          await loadDropdownData();
        } catch (error) {
          console.error('❌ Error loading dropdown data:', error);
          setStatusError(error.message);
          setConditionError(error.message);
        } finally {
          setStatusLoading(false);
          setConditionLoading(false);
        }
      };
      
      loadAllDropdownData().finally(() => {
        setIsLoadingDropdownData(false);
      });
    }
  }, [isOpen, loadDropdownData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger
  } = useZodForm(assetDetailsSchema, {
    defaultValues: {
      orgid: user?.orgId || 962834,
      status: undefined, // Don't set default to trigger validation
      conditionid: undefined, // Don't set default to trigger validation
      financialyearid: selectedFinancialYear?.id ? parseInt(selectedFinancialYear.id) : new Date().getFullYear()
    }
  });

  // Update financial year ID when selectedFinancialYear changes
  useEffect(() => {
    if (selectedFinancialYear?.id && setValue) {
      setValue('financialyearid', parseInt(selectedFinancialYear.id));
    }
  }, [selectedFinancialYear, setValue]);

  const selectedAssetType = watch('assettypeid');
  const selectedManufacturer = watch('manufacturerid');
  const selectedVendor = watch('vendorid');
  const selectedStatus = watch('status');
  const purchaseDate = watch('purchasedate');
  const warrantyStartDate = watch('warrantystartdate');

  // Reset form when asset changes
  useEffect(() => {
    if (asset) {
      // Edit mode - populate form with existing data
      Object.keys(asset).forEach(key => {
        if (asset[key] !== null && asset[key] !== undefined) {
          // Format date fields for HTML date inputs
          if (key === 'purchasedate' || key === 'assignedondate' || key === 'warrantystartdate' || key === 'warrantyenddate') {
            const formattedDate = formatDateForInput(asset[key]);
            setValue(key, formattedDate);
          } else {
            setValue(key, asset[key]);
          }
        }
      });
    } else {
      // Add mode - reset form
      reset();
    }
  }, [asset, setValue, reset]);

  // Trigger validation for employeeid and storedlocation when status changes
  useEffect(() => {
    if (selectedStatus !== undefined) {
      trigger('employeeid');
      trigger('storedlocation');
    }
  }, [selectedStatus, trigger]);

  // Clear fields based on status changes
  useEffect(() => {
    if (selectedStatus === 481) {
      // If status is "In Stock", clear assigned employee
      setValue('employeeid', undefined);
      trigger('employeeid');
    } else if (selectedStatus === 484) {
      // If status is "Assigned", clear storage location
      setValue('storedlocation', '');
      trigger('storedlocation');
    }
  }, [selectedStatus, setValue, trigger]);

  // Trigger validation for warranty start date when purchase date changes
  useEffect(() => {
    if (purchaseDate) {
      trigger('warrantystartdate');
    }
  }, [purchaseDate, trigger]);

  // Trigger validation for warranty end date when warranty start date changes
  useEffect(() => {
    if (warrantyStartDate) {
      trigger('warrantyenddate');
    }
  }, [warrantyStartDate, trigger]);

  const handleFormSubmit = async (data) => {
    
    try {
      // Trigger validation for all fields before processing
      const isValid = await trigger();
      if (!isValid) {
        return;
      }
      
      // Convert string IDs to numbers for validation
      const processedData = {
        ...data,
        assettypeid: data.assettypeid ? parseInt(data.assettypeid) : undefined,
        manufacturerid: data.manufacturerid ? parseInt(data.manufacturerid) : undefined,
        vendorid: data.vendorid ? parseInt(data.vendorid) : undefined,
        employeeid: data.employeeid ? parseInt(data.employeeid) : undefined,
        branchid: data.branchid ? parseInt(data.branchid) : undefined,
        departmentid: data.departmentid ? parseInt(data.departmentid) : undefined,
        conditionid: data.conditionid ? parseInt(data.conditionid) : undefined,
        status: data.status ? parseInt(data.status) : undefined,
        financialyearid: data.financialyearid ? parseInt(data.financialyearid) : (selectedFinancialYear?.id || new Date().getFullYear()),
        // Add dynamic user fields
        addedby: asset ? asset.addedby : user?.id, // Preserve original addedby when editing, use current user for new records
        modifiedby: user?.id, // Always use current user for modifiedby
        orgid: user?.orgId
      };
      
      
      if (typeof onSubmit === 'function') {
        await onSubmit(processedData);
        reset();
        onClose();
      } else {
        console.error('❌ AssetDetailsForm: onSubmit is not a function:', onSubmit);
        throw new Error('onSubmit function is not available');
      }
    } catch (error) {
      console.error('❌ AssetDetailsForm: Form submission error:', error);
      
      // If it's a duplicate asset error, don't close the form
      if (error.message === 'DUPLICATE_ASSET') {
        return; // Don't close the form, let user modify the data
      }
      
      // For other errors, don't close the form either, let user fix it
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-xl">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {asset ? 'Edit Asset' : 'Add New Asset'}
              </h2>
            </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Hidden field for financial year ID */}
          <input
            type="hidden"
            {...register('financialyearid')}
            value={selectedFinancialYear?.id || new Date().getFullYear()}
          />
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Asset Type */}
              <div className="space-y-2">
                <Label htmlFor="assettypeid">Asset Type <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={assetTypes.map(type => ({
                    value: type.assettypeid,
                    label: type.assettypename
                  }))}
                  value={watch('assettypeid')}
                  onValueChange={(typeId) => {
                    setValue('assettypeid', typeId);
                    trigger('assettypeid'); // Trigger validation
                  }}
                  placeholder="Select Asset Type"
                  searchPlaceholder="Search asset types..."
                  emptyText="No asset types found."
                  loading={assetTypesLoading || isLoadingDropdownData}
                  loadingText={isLoadingDropdownData ? "Loading form data..." : "Loading asset types..."}
                  disabled={assetTypesLoading || isLoadingDropdownData}
                  className={errors.assettypeid || assetTypesError ? 'border-red-500' : ''}
                />
                {errors.assettypeid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.assettypeid.message}
                  </p>
                )}
                {assetTypesError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load asset types: {assetTypesError}
                  </p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                <Input
                  id="model"
                  {...register('model', {
                    onChange: () => trigger('model')
                  })}
                  placeholder="Enter model"
                  className={errors.model ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.model && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.model.message}
                  </p>
                )}
              </div>

              {/* Serial Number */}
              <div className="space-y-2">
                <Label htmlFor="serialnumber">Serial Number <span className="text-red-500">*</span></Label>
                <Input
                  id="serialnumber"
                  {...register('serialnumber', {
                    onChange: () => trigger('serialnumber')
                  })}
                  placeholder="Enter serial number"
                  className={errors.serialnumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.serialnumber && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.serialnumber.message}
                  </p>
                )}
              </div>

              {/* Manufacturer */}
              <div className="space-y-2">
                <Label htmlFor="manufacturerid">Manufacturer <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={manufacturers.map(manufacturer => ({
                    value: manufacturer.manufacturerid,
                    label: manufacturer.manufacturername
                  }))}
                  value={watch('manufacturerid')}
                  onValueChange={(manufacturerId) => {
                    setValue('manufacturerid', manufacturerId);
                    trigger('manufacturerid'); // Trigger validation
                  }}
                  placeholder="Select Manufacturer"
                  searchPlaceholder="Search manufacturers..."
                  emptyText="No manufacturers found."
                  loading={manufacturersLoading || isLoadingDropdownData}
                  loadingText={isLoadingDropdownData ? "Loading form data..." : "Loading manufacturers..."}
                  disabled={manufacturersLoading || isLoadingDropdownData}
                  className={errors.manufacturerid || manufacturersError ? 'border-red-500' : ''}
                />
                {errors.manufacturerid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.manufacturerid.message}
                  </p>
                )}
                {manufacturersError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load manufacturers: {manufacturersError}
                  </p>
                )}
              </div>

              {/* Vendor */}
              <div className="space-y-2">
                <Label htmlFor="vendorid">Vendor <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={vendors.map(vendor => ({
                    value: vendor.assetvendorid,
                    label: vendor.vendorname
                  }))}
                  value={watch('vendorid')}
                  onValueChange={(vendorId) => {
                    setValue('vendorid', vendorId);
                    trigger('vendorid'); // Trigger validation
                  }}
                  placeholder="Select Vendor"
                  searchPlaceholder="Search vendors..."
                  emptyText="No vendors found."
                  loading={vendorsLoading || isLoadingDropdownData}
                  loadingText={isLoadingDropdownData ? "Loading form data..." : "Loading vendors..."}
                  disabled={vendorsLoading || isLoadingDropdownData}
                  className={errors.vendorid || vendorsError ? 'border-red-500' : ''}
                />
                {errors.vendorid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.vendorid.message}
                  </p>
                )}
                {vendorsError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load vendors: {vendorsError}
                  </p>
                )}
              </div>

              {/* Asset Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Asset Status <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={assetStatuses.map(status => ({
                    value: status.codeid,
                    label: status.codename
                  }))}
                  value={watch('status')}
                  onValueChange={(statusId) => {
                    setValue('status', statusId);
                    trigger('status'); // Trigger validation
                  }}
                  placeholder="Select Asset Status"
                  searchPlaceholder="Search status..."
                  emptyText="No status options found."
                  loading={statusLoading}
                  loadingText="Loading status options..."
                  disabled={statusLoading}
                  className={errors.status || statusError ? 'border-red-500' : ''}
                />
                {errors.status && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.status.message}
                  </p>
                )}
                {statusError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load status options: {statusError}
                  </p>
                )}
              </div>

              {/* Asset Condition */}
              <div className="space-y-2">
                <Label htmlFor="conditionid">Asset Condition <span className="text-red-500">*</span></Label>
                <SearchableDropdown
                  options={assetConditions.map(condition => ({
                    value: condition.codeid,
                    label: condition.codename
                  }))}
                  value={watch('conditionid')}
                  onValueChange={(conditionId) => {
                    setValue('conditionid', conditionId);
                    trigger('conditionid'); // Trigger validation
                  }}
                  placeholder="Select Asset Condition"
                  searchPlaceholder="Search conditions..."
                  emptyText="No conditions found."
                  loading={conditionLoading}
                  loadingText="Loading conditions..."
                  disabled={conditionLoading}
                  className={errors.conditionid || conditionError ? 'border-red-500' : ''}
                />
                {errors.conditionid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.conditionid.message}
                  </p>
                )}
                {conditionError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load conditions: {conditionError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span>Financial Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Purchase Date */}
              <div className="space-y-2">
                <Label htmlFor="purchasedate">Purchase Date <span className="text-red-500">*</span></Label>
                <Input
                  id="purchasedate"
                  type="date"
                  {...register('purchasedate', {
                    onChange: () => trigger('purchasedate')
                  })}
                  max={new Date().toISOString().split('T')[0]} // Set max date to today
                  className={errors.purchasedate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.purchasedate && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.purchasedate.message}
                  </p>
                )}
              </div>

              {/* Purchase Cost */}
              <div className="space-y-2">
                <Label htmlFor="purchasecost">Purchase Cost <span className="text-red-500">*</span></Label>
                <Input
                  id="purchasecost"
                  type="number"
                  step="0.01"
                  {...register('purchasecost', {
                    onChange: () => trigger('purchasecost')
                  })}
                  placeholder="0.00"
                  className={errors.purchasecost ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.purchasecost && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.purchasecost.message}
                  </p>
                )}
              </div>

              {/* Current Value */}
              <div className="space-y-2">
                <Label htmlFor="currentvalue">Current Value</Label>
                <Input
                  id="currentvalue"
                  type="number"
                  step="0.01"
                  {...register('currentvalue')}
                  placeholder="0.00"
                  className={errors.currentvalue ? 'border-red-500' : ''}
                />
                {errors.currentvalue && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.currentvalue.message}
                  </p>
                )}
              </div>

              {/* Depreciation Rate */}
              <div className="space-y-2">
                <Label htmlFor="depreciationrate">Depreciation Rate (%)</Label>
                <Input
                  id="depreciationrate"
                  type="number"
                  step="0.01"
                  {...register('depreciationrate')}
                  placeholder="0.00"
                  className={errors.depreciationrate ? 'border-red-500' : ''}
                />
                {errors.depreciationrate && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.depreciationrate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500">
                <User className="w-4 h-4 text-white" />
              </div>
              <span>Assignment Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Assigned Employee */}
              <div className="space-y-2">
                <Label htmlFor="employeeid">
                  Assigned Employee
                  {watch('status') === 484 && <span className="text-red-500"> *</span>}
                </Label>
                <SearchableDropdown
                  options={employees.map(employee => ({
                    value: employee.employeeid,
                    label: employee.name || `${employee.firstname || ''} ${employee.lastname || ''}`.trim()
                  }))}
                  value={watch('status') === 481 ? undefined : watch('employeeid')}
                  onValueChange={(employeeId) => {
                    setValue('employeeid', employeeId);
                    trigger('employeeid'); // Trigger validation
                  }}
                  placeholder={watch('status') === 481 ? "Not applicable for In Stock status" : "Select Employee"}
                  searchPlaceholder="Search employees..."
                  emptyText="No employees found."
                  loading={employeesLoading || isLoadingDropdownData}
                  loadingText={isLoadingDropdownData ? "Loading form data..." : "Loading employees..."}
                  disabled={employeesLoading || isLoadingDropdownData || watch('status') === 481}
                  className={errors.employeeid || employeesError ? 'border-red-500' : ''}
                />
                {errors.employeeid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.employeeid.message}
                  </p>
                )}
                {employeesError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load employees: {employeesError}
                  </p>
                )}
              </div>

              {/* Assignment Date */}
              <div className="space-y-2">
                <Label htmlFor="assignedondate">Assignment Date</Label>
                <Input
                  id="assignedondate"
                  type="date"
                  {...register('assignedondate')}
                />
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <Label htmlFor="branchid">Branch</Label>
                <SearchableDropdown
                  options={branches.map(branch => ({
                    value: branch.branchid,
                    label: branch.branchname
                  }))}
                  value={watch('branchid')}
                  onValueChange={(branchId) => {
                    setValue('branchid', branchId);
                    trigger('branchid'); // Trigger validation
                  }}
                  placeholder="Select Branch"
                  searchPlaceholder="Search branches..."
                  emptyText="No branches found."
                  loading={branchesLoading || isLoadingDropdownData}
                  loadingText={isLoadingDropdownData ? "Loading form data..." : "Loading branches..."}
                  disabled={branchesLoading || isLoadingDropdownData}
                  className={errors.branchid || branchesError ? 'border-red-500' : ''}
                />
                {errors.branchid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.branchid.message}
                  </p>
                )}
                {branchesError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load branches: {branchesError}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="departmentid">Department</Label>
                <SearchableDropdown
                  options={departments.map(department => ({
                    value: department.departmentid,
                    label: department.departmentname
                  }))}
                  value={watch('departmentid')}
                  onValueChange={(departmentId) => {
                    setValue('departmentid', departmentId);
                    trigger('departmentid'); // Trigger validation
                  }}
                  placeholder="Select Department"
                  searchPlaceholder="Search departments..."
                  emptyText="No departments found."
                  loading={departmentsLoading || isLoadingDropdownData}
                  loadingText={isLoadingDropdownData ? "Loading form data..." : "Loading departments..."}
                  disabled={departmentsLoading || isLoadingDropdownData}
                  className={errors.departmentid || departmentsError ? 'border-red-500' : ''}
                />
                {errors.departmentid && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.departmentid.message}
                  </p>
                )}
                {departmentsError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load departments: {departmentsError}
                  </p>
                )}
              </div>

              {/* Storage Location */}
              <div className="space-y-2">
                <Label htmlFor="storedlocation">
                  Storage Location
                  {watch('status') === 481 && <span className="text-red-500"> *</span>}
                </Label>
                <Input
                  id="storedlocation"
                  {...register('storedlocation', {
                    onChange: () => trigger('storedlocation')
                  })}
                  value={watch('status') === 484 ? '' : watch('storedlocation') || ''}
                  placeholder={watch('status') === 484 ? "Not applicable for Assigned status" : "Enter storage location"}
                  disabled={watch('status') === 484}
                  className={errors.storedlocation ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.storedlocation && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.storedlocation.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span>Warranty Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Warranty Start Date */}
              <div className="space-y-2">
                <Label htmlFor="warrantystartdate">Warranty Start Date</Label>
                <Input
                  id="warrantystartdate"
                  type="date"
                  {...register('warrantystartdate', {
                    onChange: () => trigger('warrantystartdate')
                  })}
                  min={purchaseDate || undefined}
                  className={errors.warrantystartdate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.warrantystartdate && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.warrantystartdate.message}
                  </p>
                )}
              </div>

              {/* Warranty End Date */}
              <div className="space-y-2">
                <Label htmlFor="warrantyenddate">Warranty End Date</Label>
                <Input
                  id="warrantyenddate"
                  type="date"
                  {...register('warrantyenddate', {
                    onChange: () => trigger('warrantyenddate')
                  })}
                  min={warrantyStartDate || undefined}
                  className={errors.warrantyenddate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.warrantyenddate && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.warrantyenddate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-500">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span>Additional Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter asset description"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Insurance Details */}
              <div className="space-y-2">
                <Label htmlFor="insurancedetails">Insurance Details</Label>
                <Textarea
                  id="insurancedetails"
                  {...register('insurancedetails')}
                  placeholder="Enter insurance details"
                  rows={3}
                  className={errors.insurancedetails ? 'border-red-500' : ''}
                />
                {errors.insurancedetails && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.insurancedetails.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">

              {/* Acquisition Type */}
              <div className="space-y-2">
                <Label htmlFor="acquisitiontype">Acquisition Type</Label>
                <Input
                  id="acquisitiontype"
                  {...register('acquisitiontype')}
                  placeholder="e.g., Purchase, Lease, Donation"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="min-w-[120px]"
              onClick={() => {}}
            >
              {loading || isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {asset ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {asset ? 'Update Asset' : 'Create Asset'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssetDetailsForm;

