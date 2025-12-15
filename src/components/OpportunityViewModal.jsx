import React from 'react';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Building2, 
  User, 
  DollarSign, 
  Calendar,
  Target,
  TrendingUp,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Globe
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import Button from './ui/button';
import { Badge } from './ui/badge';
import Card from './ui/card';
import { formatDate, formatDateTime } from '../utils/formatDate';

const OpportunityViewModal = ({ isOpen, onClose, opportunity }) => {
  if (!opportunity) return null;

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Qualified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Proposal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Closed Won':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Closed Lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600 dark:text-green-400';
    if (probability >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (probability >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };


  const getOpportunityAge = (createdDate) => {
    const today = new Date();
    const created = new Date(createdDate);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOpportunityAgeColor = (createdDate) => {
    const days = getOpportunityAge(createdDate);
    if (days <= 7) return 'bg-green-500';
    else if (days <= 30) return 'bg-yellow-500';
    else if (days <= 90) return 'bg-orange-500';
    else return 'bg-red-500';
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
          <div className="flex items-center space-x-2">
            <div 
              className={`text-sm ${
                type === 'email' || type === 'phone' || type === 'website' 
                  ? 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer underline' 
                  : 'text-gray-900 dark:text-white'
              }`}
              onClick={() => {
                if (type === 'email' && value) {
                  window.open(`mailto:${value}`, '_blank');
                } else if (type === 'phone' && value) {
                  window.open(`tel:${value}`, '_blank');
                } else if (type === 'website' && value) {
                  window.open(value.startsWith('http') ? value : `https://${value}`, '_blank');
                }
              }}
              title={
                type === 'email' ? `Send email to ${value}` :
                type === 'phone' ? `Call ${value}` :
                type === 'website' ? `Open ${value}` : undefined
              }
            >
              {type === 'currency' && value ? (
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ${value.toLocaleString()}
                </span>
              ) : type === 'percentage' && value ? (
                <span className={`font-semibold ${getProbabilityColor(value)}`}>
                  {value}%
                </span>
              ) : (
                value || 'N/A'
              )}
            </div>
            {type === 'email' && value && (
              <button
                onClick={() => window.open(`mailto:${value}`, '_blank')}
                className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                title={`Send email to ${value}`}
              >
                <Mail className="w-4 h-4 text-blue-500 hover:text-blue-600" />
              </button>
            )}
            {type === 'phone' && value && (
              <button
                onClick={() => window.open(`tel:${value}`, '_blank')}
                className="p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                title={`Call ${value}`}
              >
                <Phone className="w-4 h-4 text-green-500 hover:text-green-600" />
              </button>
            )}
            {type === 'website' && value && (
              <button
                onClick={() => window.open(value.startsWith('http') ? value : `https://${value}`, '_blank')}
                className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                title={`Open ${value}`}
              >
                <Globe className="w-4 h-4 text-blue-500 hover:text-blue-600" />
              </button>
            )}
          </div>
        </div>
      );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95rem] max-h-[90vh] overflow-y-auto" style={{ maxWidth: '85rem' }}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Opportunity Details
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete information for {opportunity.title}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStageColor(opportunity.stage)} text-sm px-3 py-1`}>
                {opportunity.stage}
              </Badge>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold ${getOpportunityAgeColor(opportunity.createdDate)}`}>
                {getOpportunityAge(opportunity.createdDate)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Opportunity Information */}
          <InfoSection title="Opportunity Information" icon={Handshake}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField label="Opportunity Title" value={opportunity.title} />
              <InfoField label="Opportunity Value" value={opportunity.value} type="currency" icon={DollarSign} />
              <InfoField label="Stage" value={opportunity.stage} />
              <InfoField label="Probability" value={opportunity.probability} type="percentage" icon={TrendingUp} />
              <InfoField label="Close Date" value={formatDate(opportunity.closeDate)} icon={Calendar} />
              <InfoField label="Owner" value={opportunity.owner} icon={User} />
            </div>
          </InfoSection>

          {/* Company Information */}
          <InfoSection title="Company Information" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField label="Company Name" value={opportunity.company} />
              <InfoField label="Contact Person" value={opportunity.contact} />
              <InfoField label="Created Date" value={formatDate(opportunity.createdDate)} icon={Calendar} />
              <InfoField label="Last Activity" value={formatDate(opportunity.lastActivity)} icon={Activity} />
            </div>
          </InfoSection>

          {/* Opportunity Metrics */}
          <InfoSection title="Opportunity Metrics" icon={Target}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Opportunity Value</span>
                    <DollarSign className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${opportunity.value?.toLocaleString() || '0'}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Probability</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProbabilityColor(opportunity.probability).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`}
                        style={{ width: `${opportunity.probability || 0}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${getProbabilityColor(opportunity.probability)}`}>
                      {opportunity.probability || 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expected Close</span>
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatDate(opportunity.closeDate)}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Opportunity Age</span>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getOpportunityAge(opportunity.createdDate)} days
                  </div>
                </div>
              </div>
            </div>
          </InfoSection>

          {/* Additional Information */}
          <InfoSection title="Additional Information" icon={Activity}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Opportunity ID" value={`#${opportunity.id}`} />
              <InfoField label="Stage" value={opportunity.stage} />
              <InfoField label="Created" value={formatDateTime(opportunity.createdDate)} />
              <InfoField label="Last Updated" value={formatDateTime(opportunity.lastActivity)} />
            </div>
          </InfoSection>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityViewModal;

