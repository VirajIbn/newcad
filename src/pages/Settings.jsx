import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, Bell } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';

const Settings = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center py-8">
              <User className="mx-auto h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Profile Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Update your personal information and preferences
              </p>
            </div>
          </Card>

          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center py-8">
              <Shield className="mx-auto h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Security
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Manage passwords and security settings
              </p>
            </div>
          </Card>

          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center py-8">
              <Bell className="mx-auto h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Configure email and push notifications
              </p>
            </div>
          </Card>

          <Card className="hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center py-8">
              <SettingsIcon className="mx-auto h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Application
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Configure application settings and preferences
              </p>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 