import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Wrench, 
  Users, 
  CheckCircle, 
  Settings,
  Trash2,
  Archive
} from 'lucide-react';
import { useAssetDetails, useAssetTypes, useAssetStatus } from '../../hooks';
import Card from '../../components/ui/card';
import { AssetDistributionChart } from '../../components/charts';
import { useFinancialYearContext } from '../../context/FinancialYearContext';

const AssetDashboard = () => {
  // Fetch real asset data
  const { assets, loading, pagination, fetchAssets } = useAssetDetails();
  const { assetTypes } = useAssetTypes();
  const { assetStatuses, loading: statusLoading, refetch: fetchAssetStatuses } = useAssetStatus();
  
  // Financial year context
  const { selectedFinancialYear, loading: financialYearLoading } = useFinancialYearContext();

  // Load data on component mount - wait for financial year to be loaded
  useEffect(() => {
    // Don't fetch assets until we have financial year context loaded
    if (selectedFinancialYear === null) {
      return;
    }

    const params = { page_size: 1000 }; // Get all assets for dashboard stats
    
    // Add financial year filter if specific year is selected (not "All Financial Year")
    if (selectedFinancialYear && selectedFinancialYear.id !== 0) {
      params.financialyearid = selectedFinancialYear.id;
    }
    // If selectedFinancialYear.id === 0, it means "All Financial Year" so no filter needed
    
    fetchAssets(params);
    
    // Only fetch statuses if the API is available
    if (fetchAssetStatuses) {
      fetchAssetStatuses().catch(err => {
        console.warn('Status API not available, using fallback data:', err);
      });
    }
  }, [fetchAssets, fetchAssetStatuses, selectedFinancialYear]);

  // Listen for financial year changes from MainLayout
  useEffect(() => {
    const handleFinancialYearChange = async (event) => {
      const { selectedYear } = event.detail;
      
      try {
        // Prepare API parameters
        const params = {
          page_size: 1000 // Get all assets for dashboard stats
        };

        // Add financial year filter if specific year is selected
        if (selectedYear && selectedYear.id !== 0) {
          params.financialyearid = selectedYear.id;
        }

        
        // Fetch assets with the new financial year filter
        await fetchAssets(params);
        
      } catch (error) {
        console.error('❌ AssetDashboard: Error fetching assets for FY:', error);
      }
    };

    // Add event listener
    window.addEventListener('financialYearChanged', handleFinancialYearChange);

    // Cleanup
    return () => {
      window.removeEventListener('financialYearChanged', handleFinancialYearChange);
    };
  }, [fetchAssets]);

  // Create dynamic status mapping from API data
  const statusMapping = assetStatuses.reduce((acc, status) => {
    acc[status.codeid] = status.codename;
    return acc;
  }, {});

  // Fallback status mapping in case API fails
  const fallbackStatusMapping = {
    481: 'In Stock',
    482: 'In Repair', 
    483: 'Retired',
    484: 'Assigned',
    485: 'Scrapped',
    486: 'Record Deleted'
  };

  // Use API data if available, otherwise use fallback
  const finalStatusMapping = Object.keys(statusMapping).length > 0 ? statusMapping : fallbackStatusMapping;

  // Calculate stats from real data dynamically
  const totalAssets = pagination.count || 0;
  const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.currentvalue || 0), 0);

  // Calculate status counts dynamically based on available statuses
  const calculateStatusCount = (statusCode) => {
    return assets.filter(asset => asset.status === statusCode).length;
  };

  // Get status counts for all available statuses
  const statusCounts = assetStatuses.reduce((acc, status) => {
    acc[status.codeid] = calculateStatusCount(status.codeid);
    return acc;
  }, {});

  // Fallback counts for hardcoded statuses if API fails
  const fallbackCounts = {
    481: calculateStatusCount(481), // In Stock
    482: calculateStatusCount(482), // Under Maintenance
    483: calculateStatusCount(483), // Retired
    484: calculateStatusCount(484), // Assigned
    485: calculateStatusCount(485)  // Scrapped
  };

  // Use API data if available, otherwise use fallback
  const finalStatusCounts = Object.keys(statusCounts).length > 0 ? statusCounts : fallbackCounts;

  // Calculate asset distribution by type dynamically
  const assetDistribution = {};
  
  // Function to extract asset type name from any possible field structure
  const getAssetTypeName = (asset) => {
    // Try the correct field first - assettype_name
    if (asset.assettype_name && typeof asset.assettype_name === 'string' && asset.assettype_name.trim() !== '') {
      return asset.assettype_name.trim();
    }
    
    // Fallback to other possible field combinations
    const possibleFields = [
      asset.assettypename,
      asset.assettype?.name,
      asset.asset_type?.name,
      asset.type?.name,
      asset.assettype,
      asset.assetType?.name,
      asset.assetType,
      asset.type,
      asset.category?.name,
      asset.category,
      asset.name,
      asset.title
    ];
    
    // Find the first non-empty string value
    for (const field of possibleFields) {
      if (field && typeof field === 'string' && field.trim() !== '') {
        return field.trim();
      }
    }
    
    // If no valid field found, try to extract from nested objects
    if (asset.assettype && typeof asset.assettype === 'object') {
      return asset.assettype.name || asset.assettype.type || asset.assettype.title || 'Unknown';
    }
    
    if (asset.type && typeof asset.type === 'object') {
      return asset.type.name || asset.type.type || asset.type.title || 'Unknown';
    }
    
    return 'Unknown';
  };
  
  
  assets.forEach(asset => {
    const typeName = getAssetTypeName(asset);
    
    if (!assetDistribution[typeName]) {
      assetDistribution[typeName] = {
        total: 0,
        ...Object.keys(finalStatusMapping).reduce((acc, statusCode) => {
          acc[statusCode] = 0;
          return acc;
        }, {})
      };
    }
    assetDistribution[typeName].total++;
    
    // Map status using the dynamic status mapping from API
    let statusCode = null;
    
    if (asset.status) {
      // Use the status code directly if available
      statusCode = asset.status;
    }
    else if (asset.status_name) {
      // Find the status code by matching status name with our API data
      const statusEntry = assetStatuses.find(status => status.codename === asset.status_name);
      if (statusEntry) {
        statusCode = statusEntry.codeid;
      }
    }
    
    // Use the mapped status code
    if (statusCode) {
      assetDistribution[typeName][statusCode] = (assetDistribution[typeName][statusCode] || 0) + 1;
    }
  });
  

  // Create dynamic stats array based on API data
  const createStatsArray = () => {
    const stats = [
      {
        title: 'Total Assets',
        value: totalAssets.toLocaleString('en-IN'),
        change: '100%',
        changeType: 'positive',
        icon: Package,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-600 dark:text-purple-400'
      }
    ];

    // Define status icons and order
    const statusIcons = {
      484: { icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' }, // Assigned
      481: { icon: CheckCircle, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-600 dark:text-green-400' }, // In Stock
      482: { icon: Wrench, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', textColor: 'text-cyan-600 dark:text-cyan-400' }, // Under Maintenance
      483: { icon: Archive, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20', textColor: 'text-orange-600 dark:text-orange-400' }, // Retired
      485: { icon: Trash2, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/20', textColor: 'text-pink-600 dark:text-pink-400' } // Scrapped
    };

    // Define the order: Assigned, In Stock, Under Maintenance, Retired, Scrapped
    const statusOrder = [484, 481, 482, 483, 485];

    // Add stats in the specified order
    statusOrder.forEach(statusCode => {
      const statusName = finalStatusMapping[statusCode];
      if (statusName) {
        const count = finalStatusCounts[statusCode] || 0;
        const iconConfig = statusIcons[statusCode] || { icon: Package, color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20', textColor: 'text-gray-600 dark:text-gray-400' };
        
        const percentage = totalAssets > 0 ? ((count / totalAssets) * 100).toFixed(1) : 0;
        stats.push({
          title: statusName,
          value: count.toLocaleString('en-IN'),
          change: count > 0 ? `${percentage}%` : '0%',
          changeType: count > 0 ? 'positive' : 'neutral',
          icon: iconConfig.icon,
          color: iconConfig.color,
          bgColor: iconConfig.bgColor,
          textColor: iconConfig.textColor
        });
      }
    });

    return stats;
  };

  const stats = createStatsArray();



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Show loading state only while financial year is actually loading
  if (financialYearLoading) {
    return (
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading financial year data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Enhanced Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`relative overflow-hidden ${stat.bgColor} rounded-2xl border-2 border-opacity-20 shadow-lg cursor-pointer transition-all duration-150 hover:shadow-xl hover:border-opacity-40`}
            style={{
              borderColor: stat.textColor.includes('purple') ? '#a855f7' :
                          stat.textColor.includes('orange') ? '#f97316' :
                          stat.textColor.includes('cyan') ? '#06b6d4' :
                          stat.textColor.includes('blue') ? '#3b82f6' :
                          stat.textColor.includes('pink') ? '#ec4899' :
                          stat.textColor.includes('red') ? '#ef4444' :
                          stat.textColor.includes('green') ? '#10b981' :
                          '#6b7280'
            }}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.1 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
          >
            <div className="relative p-3">
              <div className="flex items-center justify-between mb-2">
                <motion.div 
                  className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                >
                  <stat.icon className="w-4 h-4 text-white" />
                </motion.div>
                <motion.div 
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' :
                    stat.changeType === 'warning' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' :
                    'text-red-600 bg-red-100 dark:bg-red-900/30'
                  }`}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.1 }
                  }}
                >
                  {stat.change}
                </motion.div>
              </div>
              <h3 className={`text-xs font-medium ${stat.textColor} mb-1`}>
                {stat.title}
              </h3>
              <p className={`text-xl font-bold ${stat.textColor}`}>
                {loading ? '...' : stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Analytics Section */}
      <motion.div 
        className="grid grid-cols-1 gap-6"
        variants={itemVariants}
      >
        {/* Asset Distribution Chart */}
        <AssetDistributionChart 
          data={assetDistribution} 
          loading={loading}
          statusMapping={finalStatusMapping}
        />
      </motion.div>


    </motion.div>
  );
};

export default AssetDashboard; 