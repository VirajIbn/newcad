import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Building2, Mail, Phone, MapPin, Calendar, User, Globe, FileText, User as UserIcon, MapPin as MapPinIcon, FileText as FileTextIcon, Info } from 'lucide-react';
import Button from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDate, formatDateTimeWithAmPm } from '../../utils/formatDate';
import { countriesAPI, statesAPI, citiesAPI } from '../../services/api';

const VendorDetailsModal = ({ vendor, isOpen, onClose }) => {
  const [locationData, setLocationData] = useState({
    countryName: '',
    stateName: '',
    cityName: '',
    loading: false
  });

  // Fetch location data when modal opens
  useEffect(() => {
    if (isOpen && vendor) {
      fetchLocationData();
    }
  }, [isOpen, vendor]);

  const fetchLocationData = async () => {
    setLocationData(prev => ({ ...prev, loading: true }));

    try {
      const promises = [];

      // Fetch country name if countryid exists
      if (vendor.countryid && vendor.countryid !== null && vendor.countryid !== '' && vendor.countryid !== 0) {
        promises.push(
          countriesAPI.getById(vendor.countryid)
            .then(response => response.countryname || 'Not specified')
            .catch(() => 'Not specified')
        );
      } else {
        promises.push(Promise.resolve('Not specified'));
      }

      // Fetch state name if stateid exists
      if (vendor.stateid && vendor.stateid !== null && vendor.stateid !== '') {
        promises.push(
          statesAPI.getById(vendor.stateid)
            .then(response => response.statename || 'Not specified')
            .catch(() => 'Not specified')
        );
      } else {
        promises.push(Promise.resolve('Not specified'));
      }

      // Fetch city name if cityid exists
      if (vendor.cityid && vendor.cityid !== null && vendor.cityid !== '') {
        promises.push(
          citiesAPI.getById(vendor.cityid)
            .then(response => response.cityname || 'Not specified')
            .catch(() => 'Not specified')
        );
      } else {
        promises.push(Promise.resolve('Not specified'));
      }

      const [countryName, stateName, cityName] = await Promise.all(promises);

      setLocationData({
        countryName,
        stateName,
        cityName,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLocationData({
        countryName: 'Not specified',
        stateName: 'Not specified',
        cityName: 'Not specified',
        loading: false
      });
    }
  };

  if (!vendor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
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
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Vendor Details For {vendor.vendorname || 'Unknown Vendor'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '0.8rem' }}>
                    Created By {vendor.addedby_name || 'Unknown'} on {vendor.addeddate ? formatDateTimeWithAmPm(vendor.addeddate) : 'Unknown Date'}, Last Modified By {vendor.modifiedby_name || 'Unknown'} on {vendor.modifieddate ? formatDateTimeWithAmPm(vendor.modifieddate) : (vendor.addeddate ? formatDateTimeWithAmPm(vendor.addeddate) : 'Unknown Date')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Vendor Name
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {vendor.vendorname}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contact Person
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {vendor.contactperson || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      GST Number
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {vendor.gstno || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Contact Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>Email</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {vendor.email || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Mobile Number</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {vendor.mobilenumber || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MapPinIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Address Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Address</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {vendor.address || 'Not specified'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        City
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {locationData.loading ? 'Loading...' : (locationData.cityName || 'Not specified')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        State
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {locationData.loading ? 'Loading...' : (locationData.stateName || 'Not specified')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Country
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {locationData.loading ? 'Loading...' : (locationData.countryName || 'Not specified')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ZIP Code
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {vendor.zip || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {vendor.description && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <FileTextIcon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Description
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>Details</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                      {vendor.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-xl">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VendorDetailsModal;
