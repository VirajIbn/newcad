import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Edit, Trash2, Search, MapPin, Phone, Mail, Users, Globe } from 'lucide-react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const organizations = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      type: 'Technology',
      location: 'San Francisco, CA',
      phone: '+1 (415) 555-0123',
      email: 'contact@techcorp.com',
      website: 'www.techcorp.com',
      employees: 250,
      status: 'Active',
      description: 'Leading technology solutions provider specializing in cloud infrastructure and digital transformation.',
    },
    {
      id: 2,
      name: 'Global Manufacturing Inc.',
      type: 'Manufacturing',
      location: 'Detroit, MI',
      phone: '+1 (313) 555-0456',
      email: 'info@globalmfg.com',
      website: 'www.globalmfg.com',
      employees: 1200,
      status: 'Active',
      description: 'Industrial manufacturing company focused on automotive and aerospace components.',
    },
    {
      id: 3,
      name: 'Healthcare Partners',
      type: 'Healthcare',
      location: 'Boston, MA',
      phone: '+1 (617) 555-0789',
      email: 'contact@healthcarepartners.com',
      website: 'www.healthcarepartners.com',
      employees: 450,
      status: 'Active',
      description: 'Healthcare management and consulting services for hospitals and clinics.',
    },
    {
      id: 4,
      name: 'Financial Services Group',
      type: 'Finance',
      location: 'New York, NY',
      phone: '+1 (212) 555-0321',
      email: 'info@financialgroup.com',
      website: 'www.financialgroup.com',
      employees: 800,
      status: 'Active',
      description: 'Comprehensive financial services including investment, banking, and insurance.',
    },
    {
      id: 5,
      name: 'Retail Solutions Co.',
      type: 'Retail',
      location: 'Chicago, IL',
      phone: '+1 (312) 555-0654',
      email: 'contact@retailsolutions.com',
      website: 'www.retailsolutions.com',
      employees: 320,
      status: 'Active',
      description: 'Retail technology and supply chain management solutions.',
    },
  ];

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <Button icon={Plus} variant="primary">
          Add Organization
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-medium transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-blue-500">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {org.type}
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {org.description}
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{org.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{org.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{org.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>{org.website}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {org.employees} employees
                    </span>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400">
                    {org.status}
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

export default Organizations; 