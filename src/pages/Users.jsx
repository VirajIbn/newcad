import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Search, Mail, Phone, Shield, Calendar, MapPin } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Administrator',
      department: 'IT',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      status: 'Active',
      lastLogin: '2 hours ago',
      avatar: 'JS',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Manager',
      department: 'Operations',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      status: 'Active',
      lastLogin: '1 day ago',
      avatar: 'SJ',
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'User',
      department: 'Sales',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      status: 'Active',
      lastLogin: '3 days ago',
      avatar: 'MC',
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Manager',
      department: 'Marketing',
      phone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      status: 'Inactive',
      lastLogin: '1 week ago',
      avatar: 'ED',
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      role: 'User',
      department: 'Finance',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      status: 'Active',
      lastLogin: '5 hours ago',
      avatar: 'DW',
    },
    {
      id: 6,
      name: 'Lisa Brown',
      email: 'lisa.brown@company.com',
      role: 'Administrator',
      department: 'HR',
      phone: '+1 (555) 678-9012',
      location: 'Seattle, WA',
      status: 'Active',
      lastLogin: '1 hour ago',
      avatar: 'LB',
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'User':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <Button icon={Plus} variant="primary">
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-medium transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Last login: {user.lastLogin}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage; 