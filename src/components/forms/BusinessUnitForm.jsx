import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/card';
import { toast } from 'react-toastify';

const BusinessUnitForm = ({ 
  businessUnit = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { user, logout } = useAuth();
  
  // Check if user ID, orgId, and email are available, if not logout
  useEffect(() => {
    if (!user?.id || !user?.orgId || !user?.email) {
      toast.error('User session invalid. Please login again.');
      logout();
      onCancel(); // Close the form
      return;
    }
  }, [user?.id, user?.orgId, user?.email, logout, onCancel]);

  const [formData, setFormData] = useState({
    buname: '',
    bucode: '',
    description: '',
    deliveryheadid: null,
    salesheadid: null,
    services: [],
    isactive: 1,
    regionid: null,
    statusreason: '',
    orgid: user?.orgId,
    addedby: user?.id,
    modifiedby: user?.id,
  });
  const [errors, setErrors] = useState({});

  // Mock dropdown data instead of API calls
  const employees = [
    { id: 1, fullname: 'John Smith', email: 'john.smith@company.com' },
    { id: 2, fullname: 'Jane Doe', email: 'jane.doe@company.com' },
    { id: 3, fullname: 'Mike Johnson', email: 'mike.johnson@company.com' },
    { id: 4, fullname: 'Sarah Wilson', email: 'sarah.wilson@company.com' },
    { id: 5, fullname: 'David Brown', email: 'david.brown@company.com' },
    { id: 6, fullname: 'Lisa Davis', email: 'lisa.davis@company.com' },
    { id: 7, fullname: 'Alex Thompson', email: 'alex.thompson@company.com' },
    { id: 8, fullname: 'Emma Garcia', email: 'emma.garcia@company.com' },
    { id: 9, fullname: 'Chris Lee', email: 'chris.lee@company.com' },
    { id: 10, fullname: 'Maria Rodriguez', email: 'maria.rodriguez@company.com' }
  ];

  const regions = [
    { id: 1, name: 'North America' },
    { id: 2, name: 'Europe' },
    { id: 3, name: 'Asia Pacific' },
    { id: 4, name: 'Middle East' },
    { id: 5, name: 'Africa' },
    { id: 6, name: 'South America' }
  ];

  const services = [
    { id: 1, name: 'Cloud Computing' },
    { id: 2, name: 'Data Analytics' },
    { id: 3, name: 'Software Development' },
    { id: 4, name: 'IT Consulting' },
    { id: 5, name: 'Digital Marketing' },
    { id: 6, name: 'Cybersecurity' },
    { id: 7, name: 'AI/ML Solutions' },
    { id: 8, name: 'Mobile App Development' },
    { id: 9, name: 'Web Development' },
    { id: 10, name: 'DevOps Services' }
  ];

  const employeesLoading = false;
  const regionsLoading = false;
  const servicesLoading = false;

  // Initialize form with business unit data if editing
  useEffect(() => {
    // Don't proceed if user ID, orgId, or email is not available
    if (!user?.id || !user?.orgId || !user?.email) {
      return;
    }

    if (businessUnit) {
      // Editing existing business unit - preserve original addedby, set modifiedby to current user
      setFormData({
        buname: businessUnit.buname || '',
        bucode: businessUnit.bucode || '',
        description: businessUnit.description || '',
        deliveryheadid: businessUnit.deliveryheadid || null,
        salesheadid: businessUnit.salesheadid || null,
        services: businessUnit.services || [],
        isactive: businessUnit.isactive !== undefined ? businessUnit.isactive : 1,
        regionid: businessUnit.regionid || null,
        statusreason: businessUnit.statusreason || '',
        orgid: user?.orgId,
        addedby: businessUnit.addedby,
        modifiedby: user?.id,
      });
    } else {
      // Creating new business unit - set defaults
      setFormData({
        buname: '',
        bucode: '',
        description: '',
        deliveryheadid: null,
        salesheadid: null,
        services: [],
        isactive: 1,
        regionid: null,
        statusreason: '',
        orgid: user?.orgId,
        addedby: user?.id,
        modifiedby: user?.id,
      });
    }
  }, [businessUnit, user]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.buname.trim()) {
      newErrors.buname = 'BU Name is required';
    } else if (formData.buname.length > 100) {
      newErrors.buname = 'BU Name must be 100 characters or less';
    }

    if (formData.bucode && formData.bucode.length > 20) {
      newErrors.bucode = 'BU Code must be 20 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    if (formData.statusreason && formData.statusreason.length > 200) {
      newErrors.statusreason = 'Status reason must be 200 characters or less';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'At least one service/product is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user ID, orgId, and email are still available before submitting
    if (!user?.id || !user?.orgId || !user?.email) {
      toast.error('User session invalid. Please login again.');
      logout();
      onCancel();
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    // Prepare form data for submission
    const submitData = { ...formData };
    
    // For updates, ensure modifiedby is set to current user and addedby is preserved
    if (businessUnit) {
      submitData.modifiedby = user?.id;
      submitData.addedby = businessUnit.addedby;
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
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle service selection
  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
    
    // Clear error when user starts selecting services
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: '' }));
    }
  };

  const isEditing = !!businessUnit;
  const title = isEditing ? 'Edit Business Unit' : 'Add New Business Unit';
  const submitText = isEditing ? 'Update' : 'Add';

  // Don't render the form if user ID, orgId, or email is not available
  if (!user?.id || !user?.orgId || !user?.email) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <Card
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        hover={false}
        onClick={(e) => e.stopPropagation()}
      >
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
            {/* BU Name */}
            <div className="space-y-2">
              <Label htmlFor="buname">
                BU Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="buname"
                value={formData.buname}
                onChange={(e) => handleInputChange('buname', e.target.value)}
                placeholder="Enter business unit name"
                className={errors.buname ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.buname && (
                <p className="text-sm text-red-500">{errors.buname}</p>
              )}
            </div>

            {/* BU Code */}
            <div className="space-y-2">
              <Label htmlFor="bucode">BU Code</Label>
              <Input
                id="bucode"
                value={formData.bucode}
                onChange={(e) => handleInputChange('bucode', e.target.value)}
                placeholder="Enter BU code (e.g., CLD01, KPO02)"
                className={errors.bucode ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.bucode && (
                <p className="text-sm text-red-500">{errors.bucode}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter BU description"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
                  errors.description ? 'border-red-500' : ''
                }`}
                rows={3}
                maxLength={500}
                disabled={loading}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Delivery Head */}
            <div className="space-y-2">
              <Label htmlFor="deliveryheadid">Delivery Business Head/Owner</Label>
              <select
                id="deliveryheadid"
                value={formData.deliveryheadid || ''}
                onChange={(e) => handleInputChange('deliveryheadid', e.target.value ? parseInt(e.target.value) : null)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`}
                disabled={loading || employeesLoading}
              >
                <option value="">Select Delivery Head</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullname} ({employee.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Sales Head */}
            <div className="space-y-2">
              <Label htmlFor="salesheadid">Sales Delivery Business Head/Owner</Label>
              <select
                id="salesheadid"
                value={formData.salesheadid || ''}
                onChange={(e) => handleInputChange('salesheadid', e.target.value ? parseInt(e.target.value) : null)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`}
                disabled={loading || employeesLoading}
              >
                <option value="">Select Sales Head</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullname} ({employee.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Services/Products */}
            <div className="space-y-2 md:col-span-2">
              <Label>
                Services/Products <span className="text-red-500">*</span>
              </Label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white dark:bg-gray-800 dark:border-gray-600">
                {servicesLoading ? (
                  <p className="text-sm text-gray-500">Loading services...</p>
                ) : services.length === 0 ? (
                  <p className="text-sm text-gray-500">No services available</p>
                ) : (
                  <div className="space-y-2">
                    {services.map((service) => (
                      <label key={service.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          disabled={loading}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {service.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.services && (
                <p className="text-sm text-red-500">{errors.services}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label htmlFor="isactive">Active Status</Label>
              <select
                id="isactive"
                value={formData.isactive}
                onChange={(e) => handleInputChange('isactive', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                disabled={loading}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {/* BU Region */}
            <div className="space-y-2">
              <Label htmlFor="regionid">BU Region</Label>
              <select
                id="regionid"
                value={formData.regionid || ''}
                onChange={(e) => handleInputChange('regionid', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                disabled={loading || regionsLoading}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Reason */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="statusreason">BU Status Reason</Label>
              <Input
                id="statusreason"
                value={formData.statusreason}
                onChange={(e) => handleInputChange('statusreason', e.target.value)}
                placeholder="Enter status reason (if inactive)"
                className={errors.statusreason ? 'border-red-500' : ''}
                disabled={loading}
                maxLength={200}
              />
              <div className="flex justify-between items-center">
                {errors.statusreason && (
                  <p className="text-sm text-red-500">{errors.statusreason}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.statusreason.length}/200
                </p>
              </div>
            </div>
          </div>

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
    </div>
  );
};

export default BusinessUnitForm;
