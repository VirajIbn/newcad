import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Filter,
  FileText,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';

const CRMReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for reports
  const leadsData = [
    {
      id: 1,
      name: 'John Smith',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '+1-555-0123',
      source: 'Website',
      status: 'Qualified',
      value: 15000,
      createdDate: '2024-01-15',
      lastContact: '2024-01-20',
      notes: 'Interested in enterprise package, follow up next week'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Tech Solutions Inc',
      email: 'sarah@techsolutions.com',
      phone: '+1-555-0456',
      source: 'Referral',
      status: 'Proposal Sent',
      value: 25000,
      createdDate: '2024-01-10',
      lastContact: '2024-01-18',
      notes: 'Waiting for budget approval, decision expected by month end'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      company: 'Global Industries',
      email: 'mike@global.com',
      phone: '+1-555-0789',
      source: 'Social Media',
      status: 'Negotiation',
      value: 35000,
      createdDate: '2024-01-05',
      lastContact: '2024-01-19',
      notes: 'Price negotiation in progress, competitor involved'
    },
    {
      id: 4,
      name: 'Emily Davis',
      company: 'StartupXYZ',
      email: 'emily@startupxyz.com',
      phone: '+1-555-0321',
      source: 'Email Campaign',
      status: 'Closed Won',
      value: 12000,
      createdDate: '2023-12-20',
      lastContact: '2024-01-15',
      notes: 'Contract signed, implementation scheduled for next month'
    },
    {
      id: 5,
      name: 'Robert Brown',
      company: 'Enterprise Ltd',
      email: 'robert@enterprise.com',
      phone: '+1-555-0654',
      source: 'Website',
      status: 'Closed Lost',
      value: 45000,
      createdDate: '2023-12-15',
      lastContact: '2024-01-10',
      notes: 'Went with competitor due to pricing concerns'
    }
  ];

  const dealsData = [
    {
      id: 1,
      dealName: 'Enterprise Software License',
      company: 'Acme Corp',
      value: 150000,
      stage: 'Proposal',
      probability: 75,
      expectedClose: '2024-02-15',
      owner: 'John Smith',
      createdDate: '2024-01-01',
      lastActivity: '2024-01-20'
    },
    {
      id: 2,
      dealName: 'Cloud Migration Project',
      company: 'Tech Solutions Inc',
      value: 250000,
      stage: 'Negotiation',
      probability: 60,
      expectedClose: '2024-03-01',
      owner: 'Sarah Johnson',
      createdDate: '2023-12-15',
      lastActivity: '2024-01-18'
    },
    {
      id: 3,
      dealName: 'Custom Development',
      company: 'Global Industries',
      value: 180000,
      stage: 'Qualification',
      probability: 40,
      expectedClose: '2024-04-15',
      owner: 'Mike Wilson',
      createdDate: '2024-01-05',
      lastActivity: '2024-01-19'
    },
    {
      id: 4,
      dealName: 'SaaS Subscription',
      company: 'StartupXYZ',
      value: 50000,
      stage: 'Closed Won',
      probability: 100,
      expectedClose: '2024-01-15',
      owner: 'Emily Davis',
      createdDate: '2023-12-20',
      lastActivity: '2024-01-15'
    }
  ];

  const activitiesData = [
    {
      id: 1,
      type: 'Call',
      subject: 'Follow-up call with John Smith',
      contact: 'John Smith - Acme Corp',
      date: '2024-01-20',
      time: '10:30 AM',
      duration: '30 min',
      outcome: 'Positive response, interested in demo',
      nextAction: 'Schedule product demo'
    },
    {
      id: 2,
      type: 'Email',
      subject: 'Proposal sent to Sarah Johnson',
      contact: 'Sarah Johnson - Tech Solutions Inc',
      date: '2024-01-18',
      time: '2:15 PM',
      duration: '5 min',
      outcome: 'Proposal delivered successfully',
      nextAction: 'Follow up in 3 days'
    },
    {
      id: 3,
      type: 'Meeting',
      subject: 'Product demonstration',
      contact: 'Mike Wilson - Global Industries',
      date: '2024-01-19',
      time: '3:00 PM',
      duration: '60 min',
      outcome: 'Very interested, asked for pricing',
      nextAction: 'Send detailed pricing proposal'
    }
  ];

  const statsCards = [
    {
      title: 'Total Leads',
      value: leadsData.length.toString(),
      change: '+12.5%',
      icon: Users,
      color: 'bg-blue-500',
      trend: 'up',
    },
    {
      title: 'Active Deals',
      value: dealsData.filter(deal => deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost').length.toString(),
      change: '+5.2%',
      icon: Target,
      color: 'bg-green-500',
      trend: 'up',
    },
    {
      title: 'Total Pipeline Value',
      value: `$${dealsData.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`,
      change: '+18.3%',
      icon: DollarSign,
      color: 'bg-yellow-500',
      trend: 'up',
    },
    {
      title: 'Recent Activities',
      value: activitiesData.length.toString(),
      change: '+8.1%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: 'up',
    },
  ];

  const handleExportReport = () => {
    // Implement export functionality
    console.log('Exporting CRM Report...');
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredLeads = leadsData.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-end gap-2"
      >
        <Button
          variant="outline"
          icon={Filter}
        >
          Filter
        </Button>
        <Button
          onClick={handleExportReport}
          icon={Download}
        >
          Export Report
        </Button>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2"
      >
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm mt-2 flex items-center ${
                      stat.trend === 'up'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 mr-1 ${
                        stat.trend === 'down' && 'rotate-180'
                      }`}
                    />
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Leads Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Leads Report
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Source
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Last Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-gray-500 dark:text-gray-400">{lead.email}</div>
                          <div className="text-gray-500 dark:text-gray-400">{lead.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        {lead.company}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          lead.status === 'Qualified' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          lead.status === 'Proposal Sent' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          lead.status === 'Negotiation' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                          lead.status === 'Closed Won' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        ${lead.value.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        {lead.lastContact}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRowExpansion(lead.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            {expandedRows.has(lead.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(lead.id) && (
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                        <td colSpan="7" className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="font-medium mb-2">Notes:</div>
                          <div>{lead.notes}</div>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                            Created: {lead.createdDate}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Deals Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Deals Report
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Deal Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Stage
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Probability
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Expected Close
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {dealsData.map((deal) => (
                  <tr key={deal.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {deal.dealName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {deal.company}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        deal.stage === 'Qualification' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        deal.stage === 'Proposal' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        deal.stage === 'Negotiation' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span>{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {deal.expectedClose}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {deal.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Activities Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities Report
            </h3>
          </div>
          <div className="space-y-4">
            {activitiesData.map((activity) => (
              <div key={activity.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'Call' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        activity.type === 'Email' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                      }`}>
                        {activity.type}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.subject}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div>Contact: {activity.contact}</div>
                      <div>Date: {activity.date} at {activity.time} ({activity.duration})</div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <div className="font-medium mb-1">Outcome:</div>
                      <div className="mb-2">{activity.outcome}</div>
                      <div className="font-medium mb-1">Next Action:</div>
                      <div>{activity.nextAction}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CRMReports;