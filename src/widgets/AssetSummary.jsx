import React from 'react';
import { motion } from 'framer-motion';
import { Package, Monitor, Car, Building, Wrench, Truck } from 'lucide-react';
import Card from '../components/ui/card';
import { formatNumber } from '../utils/formatDate';

const assetTypes = [
  {
    name: 'Equipment',
    count: 1247,
    icon: Wrench,
    color: 'bg-blue-500',
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Vehicles',
    count: 89,
    icon: Car,
    color: 'bg-green-500',
    change: '+5%',
    changeType: 'positive',
  },
  {
    name: 'Computers',
    count: 456,
    icon: Monitor,
    color: 'bg-purple-500',
    change: '+8%',
    changeType: 'positive',
  },
  {
    name: 'Buildings',
    count: 23,
    icon: Building,
    color: 'bg-orange-500',
    change: '+2%',
    changeType: 'positive',
  },
  {
    name: 'Machinery',
    count: 234,
    icon: Truck,
    color: 'bg-red-500',
    change: '-3%',
    changeType: 'negative',
  },
  {
    name: 'Other',
    count: 156,
    icon: Package,
    color: 'bg-gray-500',
    change: '+1%',
    changeType: 'positive',
  },
];

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

const AssetSummary = () => {
  const totalAssets = assetTypes.reduce((sum, type) => sum + type.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Asset Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Total assets: {formatNumber(totalAssets)}
          </p>
        </div>
      </div>

      {/* Asset Type Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {assetTypes.map((type) => {
          const Icon = type.icon;
          const percentage = ((type.count / totalAssets) * 100).toFixed(1);
          
          return (
            <motion.div key={type.name} variants={itemVariants}>
              <Card className="hover:shadow-medium transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${type.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {type.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {formatNumber(type.count)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      type.changeType === 'positive' 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-danger-600 dark:text-danger-400'
                    }`}>
                      {type.change}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}% of total
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${type.color.replace('bg-', 'bg-')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AssetSummary; 