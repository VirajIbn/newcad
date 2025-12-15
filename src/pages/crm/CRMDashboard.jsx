import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Handshake, DollarSign, Target, Calendar, Phone, Mail } from 'lucide-react';
import Card from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Button from '../../components/ui/button';

const CRMDashboard = () => {
  // Mock data for CRM dashboard
  const stats = [
    {
      title: 'Total Leads',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Active Opportunities',
      value: '89',
      change: '+8%',
      changeType: 'positive',
      icon: Handshake,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Revenue',
      value: '$2.4M',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: '+3%',
      changeType: 'positive',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  const recentLeads = [
    {
      id: 1,
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      email: 'john@techsolutions.com',
      phone: '+1-555-0123',
      status: 'New',
      source: 'Website',
      value: '$15,000',
      createdDate: '2024-02-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Global Enterprises',
      email: 'sarah@globalent.com',
      phone: '+1-555-0456',
      status: 'Qualified',
      source: 'Referral',
      value: '$25,000',
      createdDate: '2024-02-14'
    },
    {
      id: 3,
      name: 'Mike Chen',
      company: 'StartupXYZ',
      email: 'mike@startupxyz.com',
      phone: '+1-555-0789',
      status: 'Contacted',
      source: 'Cold Call',
      value: '$8,500',
      createdDate: '2024-02-13'
    }
  ];

  const recentDeals = [
    {
      id: 1,
      title: 'Enterprise Software License',
      company: 'Tech Solutions Inc.',
      value: '$45,000',
      stage: 'Proposal',
      probability: 75,
      closeDate: '2024-03-15',
      owner: 'Alice Johnson'
    },
    {
      id: 2,
      title: 'Cloud Infrastructure Setup',
      company: 'Global Enterprises',
      value: '$32,000',
      stage: 'Negotiation',
      probability: 60,
      closeDate: '2024-03-20',
      owner: 'Bob Smith'
    },
    {
      id: 3,
      title: 'Custom Development',
      company: 'StartupXYZ',
      value: '$18,500',
      stage: 'Qualified',
      probability: 40,
      closeDate: '2024-04-01',
      owner: 'Carol Davis'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Proposal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your customer relationships and track sales performance
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Leads
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1" />
                        {lead.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {lead.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Opportunities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Opportunities
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{deal.title}</h4>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{deal.value}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{deal.company}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(deal.stage)}>
                      {deal.stage}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{deal.probability}% probability</p>
                      <p className="text-xs text-gray-400">Close: {deal.closeDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CRMDashboard;
