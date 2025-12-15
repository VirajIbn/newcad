import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Building2, Mail, Phone, MapPin, Calendar, User, Globe, FileText, DollarSign, Shield, Clock, Info, Tag, IndianRupee } from 'lucide-react';
import Button from './ui/button';
import { Badge } from './ui/badge';
import { formatDate } from '../utils/formatDate';
import { useFinancialYearContext } from '../context/FinancialYearContext';
import { useBranches, useDepartments } from '../hooks';

const AssetDetailsModal = ({ asset, isOpen, onClose, assetStatuses = [], assetConditions = [], orgId }) => {
  if (!asset) return null;

  // Get financial years data from context
  const { financialYears } = useFinancialYearContext();
  
  // Get branches and departments data
  const { branches } = useBranches(orgId);
  const { departments } = useDepartments(orgId);

  // Helper function to find financial year name by ID
  const getFinancialYearName = (financialYearId) => {
    if (!financialYearId || !financialYears || !Array.isArray(financialYears)) return 'Not specified';
    const financialYear = financialYears.find(fy => fy.id === financialYearId);
    return financialYear ? financialYear.shortName || financialYear.displayName || 'Unknown' : 'Not specified';
  };

  // Helper function to find status text by ID
  const getStatusText = (statusId) => {
    if (!assetStatuses || !Array.isArray(assetStatuses)) return 'Unknown';
    const status = assetStatuses.find(s => s.codeid === statusId);
    return status ? status.codename : 'Unknown';
  };

  // Helper function to find condition text by ID
  const getConditionText = (conditionId) => {
    if (!conditionId) return 'Unknown';

    // Prefer values from dropdown list when available
    if (assetConditions && Array.isArray(assetConditions) && assetConditions.length > 0) {
      const condition = assetConditions.find((c) => c.codeid === conditionId);
      if (condition) return condition.codename;
    }

    // Fallback mapping based on known mock codes (1–5)
    switch (Number(conditionId)) {
      case 1:
        return 'Excellent';
      case 2:
        return 'Good';
      case 3:
        return 'Fair';
      case 4:
        return 'Poor';
      case 5:
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  // Helper function to find branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId || !branches || !Array.isArray(branches)) return 'Not specified';
    const branch = branches.find(b => b.branchid === branchId);
    return branch ? branch.branchname : 'Not specified';
  };

  // Helper function to find department name by ID
  const getDepartmentName = (departmentId) => {
    if (!departmentId || !departments || !Array.isArray(departments)) return 'Not specified';
    const department = departments.find(d => d.departmentid === departmentId);
    return department ? department.departmentname : 'Not specified';
  };

  // Helper function to get status badge with proper text and colors
  const getStatusBadge = (statusId) => {
    const statusText = getStatusText(statusId);
    
    // Handle unknown status
    if (statusText === 'Unknown') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{statusText}</Badge>;
    }
    
    // Color mapping for specific status codes
    const getStatusColor = (statusId) => {
      switch (statusId) {
        case 481: // In Stock
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700";
        case 482: // In Repair
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700";
        case 483: // Retired
          return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-700";
        case 484: // Assigned
          return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-700";
        case 485: // Scrapped
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
        case 486: // Record Deleted
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
      }
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${getStatusColor(statusId)} font-medium`}
      >
        {statusText}
      </Badge>
    );
  };

  // Helper function to get condition badge with proper text and colors
  const getConditionBadge = (conditionId) => {
    const conditionText = getConditionText(conditionId);
    
    // Handle unknown condition
    if (conditionText === 'Unknown') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{conditionText}</Badge>;
    }
    
    // Color mapping for specific condition codes
    const getConditionColor = (conditionId) => {
      switch (conditionId) {
        case 1: // Excellent
          return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700";
        case 2: // Good
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700";
        case 3: // Fair
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
        case 4: // Poor
          return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-700";
        case 5: // Critical
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
        case 6: // Damaged
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
        case 7: // Out of Service
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
      }
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${getConditionColor(conditionId)} font-medium`}
      >
        {conditionText}
      </Badge>
    );
  };

  const isWarrantyExpired = (warrantyEndDate) => {
    if (!warrantyEndDate) return false;
    return new Date(warrantyEndDate) < new Date();
  };

  const isWarrantyExpiringSoon = (warrantyEndDate) => {
    if (!warrantyEndDate) return false;
    const endDate = new Date(warrantyEndDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate > new Date();
  };

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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Asset Details
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete information about {asset.assetnumber}
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
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Asset Number
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {asset.assetnumber}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Model
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.model || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Serial Number
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.serialnumber || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <div>
                      {getStatusBadge(asset.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Type & Manufacturer */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Asset Classification
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Asset Type
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.assettype_name || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Manufacturer
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.manufacturer_name || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Vendor
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.vendor_name || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <IndianRupee className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Financial Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Purchase Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.purchasedate ? formatDate(asset.purchasedate) : 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Purchase Cost
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      ₹{asset.purchasecost || '0.00'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Value
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      ₹{asset.currentvalue || '0.00'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Depreciation Rate
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.depreciationrate || '0.00'}%
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Acquisition Type
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.acquisitiontype || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Financial Year
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getFinancialYearName(asset.financialyearid)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Assignment Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assigned Employee
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.assigned_employee_name || 'Unassigned'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assignment Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.assignedondate ? formatDate(asset.assignedondate) : 'Not assigned'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Branch
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getBranchName(asset.branchid)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {getDepartmentName(asset.departmentid)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Storage Location</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.storedlocation || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Condition
                    </label>
                    <div>
                      {getConditionBadge(asset.conditionid)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Warranty Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Warranty Start Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.warrantystartdate ? formatDate(asset.warrantystartdate) : 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Warranty End Date
                    </label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 dark:text-gray-100">
                        {asset.warrantyenddate ? formatDate(asset.warrantyenddate) : 'Not specified'}
                      </p>
                      {asset.warrantyenddate && (
                        <>
                          {isWarrantyExpired(asset.warrantyenddate) && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                          {isWarrantyExpiringSoon(asset.warrantyenddate) && (
                            <Badge variant="warning">Expiring Soon</Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              {asset.insurancedetails && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Insurance Information
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Insurance Details
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                      {asset.insurancedetails}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {asset.description && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Description
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>Details</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                      {asset.description}
                    </p>
                  </div>
                </div>
              )}

              {/* System Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    System Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Added Date</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {formatDate(asset.addeddate)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Added By</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.addedby_username || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span>Organization ID</span>
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.orgid || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Modified Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {asset.modifieddate ? formatDate(asset.modifieddate) : 'Never modified'}
                    </p>
                  </div>
                </div>
              </div>
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

export default AssetDetailsModal;
