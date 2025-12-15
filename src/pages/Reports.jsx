import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, FileText } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';

const Reports = () => {
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
          <Button icon={Download}>
            Export Report
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Reports & Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This page will contain charts, analytics, and report generation features.
            </p>
            <div className="mt-6">
              <Button icon={FileText}>
                Generate Report
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports; 