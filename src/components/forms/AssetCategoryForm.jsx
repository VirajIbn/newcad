import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/card';

const AssetCategoryForm = ({ 
  assetCategory = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    categoryname: '',
    description: '',
    isactive: 1,
    isdeleted: 0,
  });
  const [errors, setErrors] = useState({});

  // Initialize form with asset category data if editing
  useEffect(() => {
    if (assetCategory) {
      // Editing existing asset category
      setFormData({
        categoryname: assetCategory.categoryname || '',
        description: assetCategory.description || '',
        isactive: assetCategory.isactive !== undefined ? assetCategory.isactive : 1,
        isdeleted: 0, // Always 0 for editing (can't edit deleted items)
      });
    } else {
      // Creating new asset category - set defaults
      setFormData({
        categoryname: '',
        description: '',
        isactive: 1,
        isdeleted: 0,
      });
    }
  }, [assetCategory]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryname.trim()) {
      newErrors.categoryname = 'Asset category name is required';
    } else if (formData.categoryname.length > 100) {
      newErrors.categoryname = 'Asset category name must be 100 characters or less';
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

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // If it's a duplicate asset category error, don't close the form
      if (error.message === 'DUPLICATE_ASSET_CATEGORY') {
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

  const isEditing = !!assetCategory;
  const title = isEditing ? 'Edit Asset Category' : 'Add New Asset Category';
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
            {/* Asset Category Name */}
            <div className="space-y-2">
              <Label htmlFor="categoryname" className="text-sm font-medium">
                Asset Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="categoryname"
                type="text"
                value={formData.categoryname}
                onChange={(e) => handleInputChange('categoryname', e.target.value)}
                placeholder="Enter asset category name (e.g., IT Equipment, Furniture, Vehicles)"
                className={errors.categoryname ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.categoryname && (
                <p className="text-sm text-red-500">{errors.categoryname}</p>
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
                placeholder="Enter description for this asset category"
                rows={4}
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

export default AssetCategoryForm;

