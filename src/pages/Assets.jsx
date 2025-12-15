import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Filter } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';

const Assets = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
          </div>
          <Button icon={Plus}>
            Add Asset
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" icon={Filter}>
                Filters
              </Button>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Assets Management
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This page will contain the assets table, filters, and management features.
            </p>
            <div className="mt-6">
              <Button icon={Plus}>
                Add Your First Asset
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Assets; 