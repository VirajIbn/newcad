import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useZodForm } from '../../hooks/useZodForm';
import { vendorSchema } from '../../lib/validations';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SearchableDropdown } from '../ui/searchable-dropdown';
import { useAuth } from '../../context/AuthContext';
import { X, Save, Loader2, User, MapPin, FileText } from 'lucide-react';

const VendorForm = ({ 
  vendor, 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false,
  countries = [],
  states = [],
  cities = [],
  countriesLoading = false,
  countriesError = null,
  statesLoading = false,
  statesError = null,
  citiesLoading = false,
  citiesError = null,
  onCountryChange = null,
  onStateChange = null,
  clearStates = null,
  clearCities = null
}) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useZodForm(vendorSchema, {
    defaultValues: {
      orgid: user?.orgId,
      addedby: user?.id,
      modifiedby: user?.id
    }
  });

  const selectedCountry = watch('countryid');
  const selectedState = watch('stateid');

  // Reset form when vendor changes
  useEffect(() => {
    if (vendor) {
      // Edit mode - populate form with existing data
      Object.keys(vendor).forEach(key => {
        if (vendor[key] !== null && vendor[key] !== undefined) {
          setValue(key, vendor[key]);
        }
      });
      // Ensure dynamic fields are set for edit mode too
      setValue('addedby', vendor.addedby); // STRICTLY preserve original addedby value
      setValue('modifiedby', user?.id); // Always set to current user for updates
      setValue('orgid', user?.orgId);
    } else {
      // Add mode - reset form with dynamic defaults
      reset({
        orgid: user?.orgId,
        addedby: user?.id,
        modifiedby: user?.id
      });
    }
  }, [vendor, setValue, reset, user]);

  const handleFormSubmit = async (data) => {
    try {
      
      // Convert string IDs to numbers for validation and ensure dynamic fields
      const processedData = {
        ...data,
        countryid: data.countryid ? parseInt(data.countryid) : null,
        stateid: data.stateid ? parseInt(data.stateid) : null,
        cityid: data.cityid ? parseInt(data.cityid) : null,
        orgid: user?.orgId,
        addedby: vendor ? vendor.addedby : user?.id, // Preserve original addedby when editing, use current user for new records
        modifiedby: user?.id, // Always use current user for modifiedby
      };
      
      await onSubmit(processedData);
      reset();
      onClose();
    } catch (error) {
      console.error('❌ VendorForm: Form submission error:', error);
      
      // If it's a duplicate vendor error, don't close the form
      if (error.message === 'DUPLICATE_VENDOR') {
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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {vendor ? 'Edit Vendor' : 'Add New Vendor'}
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
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Basic Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor Name */}
              <div className="space-y-2">
                <Label htmlFor="vendorname">Vendor Name <span className="text-red-500">*</span></Label>
                <Input
                  id="vendorname"
                  {...register('vendorname')}
                  placeholder="Enter vendor name"
                  className={errors.vendorname ? 'border-red-500' : ''}
                />
                {errors.vendorname && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.vendorname.message}
                  </p>
                )}
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactperson">Contact Person</Label>
                <Input
                  id="contactperson"
                  {...register('contactperson')}
                  placeholder="Enter contact person name"
                />
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <Label htmlFor="gstno">GST Number</Label>
                <Input
                  id="gstno"
                  {...register('gstno')}
                  placeholder="Enter GST number"
                  className={errors.gstno ? 'border-red-500' : ''}
                />
                {errors.gstno && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.gstno.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobilenumber">Mobile Number</Label>
                <Input
                  id="mobilenumber"
                  {...register('mobilenumber')}
                  placeholder="Enter mobile number"
                  className={errors.mobilenumber ? 'border-red-500' : ''}
                />
                {errors.mobilenumber && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.mobilenumber.message}
                  </p>
                )}
              </div>


            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Address Information
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Enter complete address"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="countryid">Country</Label>
                  <SearchableDropdown
                    options={countries.map(country => ({
                      value: country.countryid,
                      label: country.countryname
                    }))}
                    value={watch('countryid')}
                    onValueChange={(countryId) => {
                      setValue('countryid', countryId);
                      setValue('stateid', '');
                      setValue('cityid', '');
                      
                      // Clear dependent dropdowns
                      if (clearStates) clearStates();
                      if (clearCities) clearCities();
                      
                      // Fetch states for selected country
                      if (onCountryChange && countryId) {
                        onCountryChange(countryId);
                      }
                    }}
                    placeholder="Select Country"
                    searchPlaceholder="Search countries..."
                    emptyText="No countries found."
                    loading={countriesLoading}
                    loadingText="Loading countries..."
                    disabled={countriesLoading}
                    className={countriesError ? 'border-red-500' : ''}
                  />
                  {countriesError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Failed to load countries: {countriesError}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="stateid">State</Label>
                  <SearchableDropdown
                    options={states.map(state => ({
                      value: state.stateid,
                      label: state.statename
                    }))}
                    value={watch('stateid')}
                    onValueChange={(stateId) => {
                      setValue('stateid', stateId);
                      setValue('cityid', '');
                      
                      // Clear cities dropdown
                      if (clearCities) clearCities();
                      
                      // Fetch cities for selected state
                      if (onStateChange && stateId) {
                        onStateChange(stateId);
                      }
                    }}
                    placeholder="Select State"
                    searchPlaceholder="Search states..."
                    emptyText="No states found."
                    loading={statesLoading}
                    loadingText="Loading states..."
                    disabled={!selectedCountry || statesLoading}
                    className={statesError ? 'border-red-500' : ''}
                  />
                  {statesError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Failed to load states: {statesError}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="cityid">City</Label>
                  <SearchableDropdown
                    options={cities.map(city => ({
                      value: city.cityid,
                      label: city.cityname
                    }))}
                    value={watch('cityid')}
                    onValueChange={(cityId) => {
                      setValue('cityid', cityId);
                    }}
                    placeholder="Select City"
                    searchPlaceholder="Search cities..."
                    emptyText="No cities found."
                    loading={citiesLoading}
                    loadingText="Loading cities..."
                    disabled={!selectedState || citiesLoading}
                    className={citiesError ? 'border-red-500' : ''}
                  />
                  {citiesError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Failed to load cities: {citiesError}
                    </p>
                  )}
                </div>
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  {...register('zip')}
                  placeholder="Enter ZIP code"
                  className={errors.zip ? 'border-red-500' : ''}
                />
                {errors.zip && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.zip.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Additional Information
              </h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter vendor description or notes"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
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
            >
              {loading || isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {vendor ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {vendor ? 'Update Vendor' : 'Create Vendor'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VendorForm;
