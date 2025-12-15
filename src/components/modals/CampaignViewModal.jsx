import React from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  User, 
  FileText, 
  X,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Activity,
  Eye,
  MousePointer
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import Button from '../ui/button';
import { Badge } from '../ui/badge';
import Card from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { formatDate } from '../../utils/formatDate';

const CampaignViewModal = ({ isOpen, onClose, campaign }) => {
  if (!campaign) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCampaignTypeLabel = (type) => {
    const typeMap = {
      'email': 'Email Campaign',
      'sms': 'SMS Campaign',
      'telecalling': 'Telecalling',
      'whatsapp': 'WhatsApp Campaign',
      'event': 'Event / Webinar',
      'google_ads': 'Paid Ads – Google',
      'facebook_ads': 'Paid Ads – Facebook',
      'instagram_ads': 'Paid Ads – Instagram',
      'linkedin': 'LinkedIn Campaign',
      'referral': 'Referral Campaign',
      'organic_social': 'Organic Social Media',
      'seo': 'Inbound / SEO Campaign'
    };
    return typeMap[type] || type;
  };


  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getCampaignDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBudgetUtilization = (spent, budget) => {
    return ((spent / budget) * 100).toFixed(1);
  };

  const InfoSection = ({ title, icon: Icon, children }) => (
    <Card className="mb-6">
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  );

  const InfoField = ({ label, value, icon: Icon, type = 'text' }) => (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-1">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </label>
      </div>
      <div className="text-sm text-gray-900 dark:text-white">
        {value || 'N/A'}
      </div>
    </div>
  );

  const MetricCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95rem] max-h-[90vh] overflow-y-auto" style={{ maxWidth: '85rem' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Campaign Details
          </DialogTitle>
          <DialogDescription className="mt-1">
            View comprehensive information about this campaign
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {campaign.name}
                    </h2>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {campaign.description}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Megaphone className="w-4 h-4" />
                      <span>{getCampaignTypeLabel(campaign.type)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Created by {campaign.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(campaign.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>


          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InfoSection title="Campaign Information" icon={Megaphone}>
              <InfoField label="Campaign Type" value={getCampaignTypeLabel(campaign.type)} icon={Megaphone} />
                    <InfoField label="Status" value={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)} icon={CheckCircle} />
                    <InfoField label="Target Audience" value={campaign.targetAudience} icon={Target} />
                    <InfoField label="Created By" value={campaign.createdBy} icon={User} />
                  </InfoSection>

                  <InfoSection title="Timeline" icon={Calendar}>
                    <InfoField label="Start Date" value={formatDate(campaign.startDate)} icon={Calendar} />
                    <InfoField label="End Date" value={formatDate(campaign.endDate)} icon={Calendar} />
                    <InfoField label="Duration" value={`${getCampaignDuration(campaign.startDate, campaign.endDate)} days`} icon={Clock} />
                    <InfoField label="Created Date" value={formatDate(campaign.createdAt)} icon={Clock} />
                  </InfoSection>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <InfoSection title="Campaign Details" icon={FileText}>
                  <InfoField label="Campaign Name" value={campaign.name} icon={Megaphone} />
                  <InfoField label="Description" value={campaign.description} icon={FileText} />
                  <InfoField label="Campaign Type" value={getCampaignTypeLabel(campaign.type)} icon={Megaphone} />
                  <InfoField label="Status" value={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)} icon={CheckCircle} />
                  <InfoField label="Target Audience" value={campaign.targetAudience} icon={Target} />
                  <InfoField label="Created By" value={campaign.createdBy} icon={User} />
                </InfoSection>
              </motion.div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InfoSection title="Financial Performance" icon={DollarSign}>
                    <InfoField label="Total Budget" value={formatCurrency(campaign.budget)} icon={DollarSign} />
                    <InfoField label="Amount Spent" value={formatCurrency(campaign.spent)} icon={DollarSign} />
                    <InfoField label="Remaining Budget" value={formatCurrency(campaign.budget - campaign.spent)} icon={DollarSign} />
                    <InfoField label="Budget Utilization" value={`${getBudgetUtilization(campaign.spent, campaign.budget)}%`} icon={Activity} />
                  </InfoSection>

                  <InfoSection title="Lead Performance" icon={Users}>
                    <InfoField label="Total Leads" value={campaign.leads.toLocaleString()} icon={Users} />
                    <InfoField label="Conversions" value={campaign.conversions.toLocaleString()} icon={Target} />
                    <InfoField label="Conversion Rate" value={`${campaign.conversionRate.toFixed(2)}%`} icon={TrendingUp} />
                    <InfoField label="Cost per Lead" value={formatCurrency(campaign.leads > 0 ? campaign.spent / campaign.leads : 0)} icon={DollarSign} />
                  </InfoSection>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignViewModal;
