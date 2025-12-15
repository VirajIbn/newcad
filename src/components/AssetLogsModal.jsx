import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, FileText, Calendar, User, Building, Package } from 'lucide-react';
import { assetLogsAPI } from '../services/api';
import { toast } from 'react-toastify';
import Card from './ui/card';
import Button from './ui/button';
import { Table } from './ui/table';
import { Badge } from './ui/badge';
import { formatDate } from '../utils/formatDate';

const AssetLogsModal = ({ asset, isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch logs when modal opens
  useEffect(() => {
    if (isOpen && (asset?.assetdetailsid || asset?.assetid)) {
      fetchLogs();
    }
  }, [isOpen, asset?.assetdetailsid, asset?.assetid]);

  const fetchLogs = async () => {
    // Try to get asset ID from either field
    const assetId = asset?.assetdetailsid || asset?.assetid;
    if (!assetId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await assetLogsAPI.getByAssetId(assetId);
      
      // Handle the actual response structure: { count: 6, results: [...] }
      const logsData = response.results || [];
      setLogs(logsData);
      setTotalCount(response.count || logsData.length);
    } catch (error) {
      console.error('❌ Error fetching asset logs:', error);
      setError(error.message || 'Failed to fetch asset logs');
      toast.error('Failed to load asset logs');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const getStatusBadge = (statusId) => {
    const statusMap = {
      481: { text: 'In Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      482: { text: 'In Repair', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      483: { text: 'Retired', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
      484: { text: 'Assigned', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      485: { text: 'Scrapped', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
      486: { text: 'Record Deleted', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
      1: { text: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      0: { text: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
    };
    
    const status = statusMap[statusId] || { text: `Status ${statusId}`, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    
    return (
      <Badge variant="outline" className={`${status.color} font-medium`}>
        {status.text}
      </Badge>
    );
  };

  const formatLogDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDate(dateString);
    } catch (error) {
      return dateString;
    }
  };

  const formatLogDateWithTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      const time = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return `${day}-${month}-${year} ${time}`;
    } catch (error) {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Asset Logs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {asset?.assetnumber ? `Asset: ${asset.assetnumber}` : 'Asset Logs'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">Loading logs...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
                    <FileText className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Error Loading Logs
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <Button onClick={handleRefresh} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No Logs Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No logs are available for this asset.
                  </p>
                </div>
              </div>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                     <thead className="bg-gray-50 dark:bg-gray-800">
                       <tr>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Sr No
                         </th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Description
                         </th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Added By
                         </th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Added Date
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                       {logs.map((log, index) => (
                         <tr key={log.assetlogid || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                             {index + 1}
                           </td>
                           <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                             <div 
                               className="truncate" 
                               title={log.description}
                               dangerouslySetInnerHTML={{ 
                                 __html: log.description || 'N/A' 
                               }}
                             />
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                             {log.addedby_username || 'N/A'}
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                             {formatLogDateWithTime(log.addeddate)}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                  </Table>
                </div>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount > 0 && `Showing ${logs.length} of ${totalCount} log${totalCount === 1 ? '' : 's'}`}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetLogsModal;
