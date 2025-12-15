import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import Card from '../../components/ui/card';

const AssetMaintenance = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <div className="text-center py-20">
            <Wrench className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Coming Soon
            </h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We're working hard to bring you comprehensive asset maintenance management features.
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Stay tuned for updates!
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AssetMaintenance;
