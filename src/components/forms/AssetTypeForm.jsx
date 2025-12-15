import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Tag } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SearchableDropdown } from '../ui/searchable-dropdown';
import { useAuth } from '../../context/AuthContext';
import { useAssetCategories } from '../../hooks/useAssetCategories';
import Card from '../ui/card';

const AssetTypeForm = ({ 
  assetType = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { user } = useAuth();
  const { assetCategories, loading: categoriesLoading } = useAssetCategories();
  const [formData, setFormData] = useState({
    assettypename: '',
    assettypeprefix: '',
    assetcategoryid: '',
    assetdepreciationrate: '',
    description: '',
    orgid: user?.orgId,
    addedby: user?.id,
    modifiedby: user?.id,
  });
  const [errors, setErrors] = useState({});

  // Initialize form with asset type data if editing
  useEffect(() => {
    if (assetType) {
      // Editing existing asset type - preserve original addedby, set modifiedby to current user
      setFormData({
        assettypename: assetType.assettypename || '',
        assettypeprefix: assetType.assettypeprefix || '',
        assetcategoryid: assetType.assetcategoryid || '',
        assetdepreciationrate: assetType.assetdepreciationrate || '',
        description: assetType.description || '',
        orgid: assetType.orgid || user?.orgId,
        addedby: assetType.addedby, // STRICTLY preserve original addedby value
        modifiedby: user?.id, // Always set to current user when editing
      });
    } else {
      // Creating new asset type - set defaults
      setFormData({
        assettypename: '',
        assettypeprefix: '',
        assetcategoryid: '',
        assetdepreciationrate: '',
        description: '',
        orgid: user?.orgId,
        addedby: user?.id,
        modifiedby: user?.id,
      });
    }
  }, [assetType, user]); // Add user to dependency array

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.assettypename.trim()) {
      newErrors.assettypename = 'Asset type name is required';
    } else if (formData.assettypename.length > 100) {
      newErrors.assettypename = 'Asset type name must be 100 characters or less';
    }

    if (!formData.assettypeprefix.trim()) {
      newErrors.assettypeprefix = 'Asset type prefix is required';
    } else if (formData.assettypeprefix.length > 100) {
      newErrors.assettypeprefix = 'Asset type prefix must be 100 characters or less';
    }

    if (!formData.assetcategoryid) {
      newErrors.assetcategoryid = 'Asset category is required';
    }

    if (formData.assetdepreciationrate && formData.assetdepreciationrate.length > 100) {
      newErrors.assetdepreciationrate = 'Depreciation rate must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 300) {
      newErrors.description = 'Description must be 300 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare form data for submission
    const submitData = { ...formData };
    
    // For updates, ensure modifiedby is set to current user and addedby is preserved
    if (assetType) {
      submitData.modifiedby = user?.id; // Always set to current user for updates
      submitData.addedby = assetType.addedby; // STRICTLY preserve original addedby
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // If it's a duplicate asset type error, don't close the form
      if (error.message === 'DUPLICATE_ASSET_TYPE') {
        return; // Don't close the form, let user modify the data
      }
      
      // For other errors, don't close the form either, let user fix it
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

  const isEditing = !!assetType;
  const title = isEditing ? 'Edit Asset Type' : 'Add New Asset Type';
  const submitText = isEditing ? 'Update' : 'Add';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-none">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Asset Type Name */}
            <div className="space-y-2">
              <Label htmlFor="assettypename" className="text-sm font-medium">
                Asset Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assettypename"
                type="text"
                value={formData.assettypename}
                onChange={(e) => handleInputChange('assettypename', e.target.value)}
                placeholder="Enter asset type name"
                className={errors.assettypename ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.assettypename && (
                <p className="text-sm text-red-500">{errors.assettypename}</p>
              )}
            </div>

            {/* Asset Type Prefix */}
            <div className="space-y-2">
              <Label htmlFor="assettypeprefix" className="text-sm font-medium">
                Asset Type Prefix <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assettypeprefix"
                type="text"
                value={formData.assettypeprefix}
                onChange={(e) => handleInputChange('assettypeprefix', e.target.value)}
                placeholder="Enter asset type prefix (e.g., CE for Computer Equipment)"
                className={errors.assettypeprefix ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.assettypeprefix && (
                <p className="text-sm text-red-500">{errors.assettypeprefix}</p>
              )}
            </div>

            {/* Asset Category */}
            <div className="space-y-2">
              <Label htmlFor="assetcategoryid" className="text-sm font-medium">
                Asset Category <span className="text-red-500">*</span>
              </Label>
              <SearchableDropdown
                options={assetCategories.map(category => ({
                  value: category.assetcategoryid,
                  label: category.categoryname
                }))}
                value={formData.assetcategoryid}
                onValueChange={(value) => handleInputChange('assetcategoryid', value)}
                placeholder="Select Asset Category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found."
                loading={categoriesLoading}
                loadingText="Loading categories..."
                disabled={loading || categoriesLoading}
                className={errors.assetcategoryid ? 'border-red-500' : ''}
              />
              {errors.assetcategoryid && (
                <p className="text-sm text-red-500">{errors.assetcategoryid}</p>
              )}
            </div>

            {/* Depreciation Rate */}
            <div className="space-y-2">
              <Label htmlFor="assetdepreciationrate" className="text-sm font-medium">
                Depreciation Rate (%)
              </Label>
              <Input
                id="assetdepreciationrate"
                type="text"
                value={formData.assetdepreciationrate}
                onChange={(e) => handleInputChange('assetdepreciationrate', e.target.value)}
                placeholder="Enter depreciation rate (e.g., 20)"
                className={errors.assetdepreciationrate ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.assetdepreciationrate && (
                <p className="text-sm text-red-500">{errors.assetdepreciationrate}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description for this asset type"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
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
    </motion.div>
  );
};

export default AssetTypeForm;

