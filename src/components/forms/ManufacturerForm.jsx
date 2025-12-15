import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/card';
import { toast } from 'react-toastify';

const ManufacturerForm = ({ 
  manufacturer = null, 
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
    manufacturername: '',
    description: '',
    orgid: user?.orgId, // Use logged-in user's organization ID (no fallback)
    addedby: user?.id, // Use logged-in user's ID (no fallback)
    modifiedby: user?.id, // Use logged-in user's ID (no fallback)
  });
  const [errors, setErrors] = useState({});

  // Initialize form with manufacturer data if editing
  useEffect(() => {
    // Don't proceed if user ID, orgId, or email is not available
    if (!user?.id || !user?.orgId || !user?.email) {
      return;
    }

    if (manufacturer) {
      // Editing existing manufacturer - preserve original addedby, set modifiedby to current user
      setFormData({
        manufacturername: manufacturer.manufacturername || '',
        description: manufacturer.description || '',
        orgid: user?.orgId, // Always use current user's organization ID
        addedby: manufacturer.addedby, // STRICTLY preserve original addedby value
        modifiedby: user?.id, // Always use current user for modifiedby when editing
      });
    } else {
      // Creating new manufacturer - set defaults
      setFormData({
        manufacturername: '',
        description: '',
        orgid: user?.orgId, // Use logged-in user's organization ID for new records
        addedby: user?.id, // Use logged-in user's ID for new records
        modifiedby: user?.id, // Use logged-in user's ID for new records
      });
    }
  }, [manufacturer, user]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.manufacturername.trim()) {
      newErrors.manufacturername = 'Manufacturer name is required';
    } else if (formData.manufacturername.length > 100) {
      newErrors.manufacturername = 'Manufacturer name must be 100 characters or less';
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
    if (manufacturer) {
      submitData.modifiedby = user?.id; // Always set to current user for updates
      submitData.addedby = manufacturer.addedby; // STRICTLY preserve original addedby
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // If it's a duplicate manufacturer error, don't close the form
      if (error.message === 'DUPLICATE_MANUFACTURER') {
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



  const isEditing = !!manufacturer;
  const title = isEditing ? 'Edit Manufacturer' : 'Add New Manufacturer';
  const submitText = isEditing ? 'Update' : 'Add';

  // Don't render the form if user ID, orgId, or email is not available
  if (!user?.id || !user?.orgId || !user?.email) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <Card
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
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
          {/* Manufacturer Name */}
          <div className="space-y-2">
            <Label htmlFor="manufacturername">
              Manufacturer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="manufacturername"
              value={formData.manufacturername}
              onChange={(e) => handleInputChange('manufacturername', e.target.value)}
              placeholder="Enter manufacturer name"
              className={errors.manufacturername ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.manufacturername && (
              <p className="text-sm text-red-500">{errors.manufacturername}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter manufacturer description"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
                errors.description ? 'border-red-500' : ''
              }`}
              rows={3}
              maxLength={300}
              disabled={loading}
            />
            <div className="flex justify-between items-center">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/300
              </p>
            </div>
          </div>



          {/* Organization ID (Hidden for now, can be made visible if needed) */}
          <input
            type="hidden"
            value={formData.orgid}
            onChange={(e) => handleInputChange('orgid', parseInt(e.target.value))}
          />

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
  );
};

export default ManufacturerForm;
