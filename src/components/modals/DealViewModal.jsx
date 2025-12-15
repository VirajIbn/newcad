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
  Globe,
  FileText,
  MapPin,
  Users,
  X,
  Info,
  BarChart3,
  History,
  Brain,
  Lightbulb,
  Shield,
  Zap,
  Star,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import Button from '../ui/button';
import { Badge } from '../ui/badge';
import Card from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { formatDate, formatDateTime } from '../../utils/formatDate';

const DealViewModal = ({ isOpen, onClose, deal }) => {
  if (!deal) return null;

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

  const getDealAge = (createdDate) => {
    const today = new Date();
    const created = new Date(createdDate);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDealAgeColor = (createdDate) => {
    const days = getDealAge(createdDate);
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
                Deal Details
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete information for {deal.title}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStageColor(deal.stage)} text-sm px-3 py-1`}>
                {deal.stage}
              </Badge>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold ${getDealAgeColor(deal.createdDate)}`}>
                {getDealAge(deal.createdDate)}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* AI-Generated Next Steps - Above Tabs */}
        <Card className="mb-6">
          <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              AI-Generated Next Steps
            </h3>
            </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Immediate Actions (Next 24 hours)</h4>
                    <ol className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1 list-decimal list-inside">
                      <li>{deal.probability >= 80 ? 'Schedule final negotiation meeting' : deal.probability >= 60 ? 'Send updated proposal with pricing' : 'Follow up on proposal and address concerns'}</li>
                      <li>{deal.probability >= 80 ? 'Prepare contract documents and terms' : 'Research competitor pricing and positioning'}</li>
                      <li>{deal.probability >= 90 ? 'Notify management of high-probability deal' : 'Update CRM with latest developments'}</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">Follow-up Strategy (Next 7 days)</h4>
                    <ol className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1 list-decimal list-inside">
                      <li>{deal.probability >= 80 ? 'Finalize contract terms and pricing' : 'Schedule product demonstration'}</li>
                      <li>{deal.probability >= 70 ? 'Identify and address final objections' : 'Qualify decision timeline and budget'}</li>
                      <li>{deal.probability >= 90 ? 'Prepare for contract signing' : 'Send case studies and references'}</li>
                      <li>{deal.probability >= 80 ? 'Coordinate with legal and finance teams' : 'Continue nurturing relationship'}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-1 text-gray-500 dark:text-gray-400 w-full shadow-inner border border-gray-200 dark:border-gray-700">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <Info className="w-4 h-4" />
              Snapshot
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <User className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="scoring" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger 
              value="ai-activities" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Activities
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <InfoSection title="Deal Overview" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField label="Deal ID" value={`#${deal.id}`} />
              <InfoField label="Deal Title" value={deal.title} />
              <InfoField label="Deal Value" value={deal.expectedRevenue} type="currency" icon={DollarSign} />
              <InfoField label="Stage" value={deal.stage} />
              <InfoField label="Probability" value={deal.probability || 50} type="percentage" icon={TrendingUp} />
              <InfoField label="Close Date" value={formatDate(deal.closeDate)} icon={Calendar} />
              <InfoField label="Owner" value={deal.owner} icon={User} />
                <InfoField label="Created" value={formatDateTime(deal.createdDate)} />
                <InfoField label="Last Activity" value={formatDateTime(deal.lastActivity)} icon={Activity} />
            </div>
          </InfoSection>

          <InfoSection title="Company Information" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Company" value={deal.company} icon={Building2} />
                <InfoField label="Contact Person" value={deal.contact} icon={User} />
                <InfoField label="Industry" value={deal.industry || 'N/A'} />
                <InfoField label="Company Size" value={deal.companySize || 'N/A'} />
                <InfoField label="Website" value={deal.website} type="website" icon={Globe} />
                <InfoField label="Phone" value={deal.phone} type="phone" icon={Phone} />
              </div>
            </InfoSection>

            {/* Products or Services Section */}
            {deal.productLineItems && deal.productLineItems.length > 0 && (
              <InfoSection title="Products or Services" icon={FileText}>
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-700 dark:text-gray-300 pb-2 border-b-2 border-gray-300 dark:border-gray-600">
                    <div className="col-span-3">Product/Service</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Currency</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Discount</div>
                    <div className="col-span-1 text-right">Total</div>
                  </div>

                  {/* Line Items */}
                  {deal.productLineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="col-span-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.productService || 'N/A'}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.quantity || 0}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.currency || 'USD'}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.price ? parseFloat(item.price).toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.discount || 0}%
                        </span>
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {item.totalAmount ? item.totalAmount.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Grand Total */}
                  <div className="flex justify-end pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grand Total</div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${deal.grandTotal ? deal.grandTotal.toFixed(2) : '0.00'}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {deal.productLineItems.length} line item{deal.productLineItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </InfoSection>
            )}
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6 mt-6">
            <InfoSection title="Primary Contact" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField label="Full Name" value={deal.contact} />
                <InfoField label="Email" value={deal.email} type="email" icon={Mail} />
                <InfoField label="Phone" value={deal.phone} type="phone" icon={Phone} />
                <InfoField label="Job Title" value={deal.jobTitle || 'N/A'} />
                <InfoField label="Department" value={deal.department || 'N/A'} />
                <InfoField label="Preferred Contact" value={deal.preferredContact || 'N/A'} />
            </div>
          </InfoSection>

            <InfoSection title="Address Information" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Address" value={deal.address || 'N/A'} />
                <InfoField label="City" value={deal.city || 'N/A'} />
                <InfoField label="State" value={deal.state || 'N/A'} />
                <InfoField label="Country" value={deal.country || 'N/A'} />
                <InfoField label="Postal Code" value={deal.postalCode || 'N/A'} />
              </div>
            </InfoSection>

            <InfoSection title="Additional Contacts" icon={Users}>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No additional contacts recorded</p>
              </div>
            </InfoSection>
          </TabsContent>

          {/* Scoring Tab */}
          <TabsContent value="scoring" className="space-y-6 mt-6">
            <InfoSection title="Deal Scoring" icon={Target}>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Deal Score</span>
                    <span className={`text-2xl font-bold ${
                      deal.probability >= 90 ? 'text-green-600 dark:text-green-400' :
                      deal.probability >= 80 ? 'text-blue-600 dark:text-blue-400' :
                      deal.probability >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                      deal.probability >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {deal.probability || 50}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          deal.probability >= 90 ? 'bg-green-500' :
                          deal.probability >= 80 ? 'bg-blue-500' :
                          deal.probability >= 70 ? 'bg-yellow-500' :
                          deal.probability >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${deal.probability || 50}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {deal.probability >= 90 ? 'Excellent' :
                       deal.probability >= 80 ? 'Very Good' :
                       deal.probability >= 70 ? 'Good' :
                       deal.probability >= 60 ? 'Fair' : 'Poor'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Scoring Factors</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Deal Size:</span>
                        <span className="font-medium">+20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stage Progress:</span>
                        <span className="font-medium">+25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-medium">+15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Decision Authority:</span>
                        <span className="font-medium">+20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Competition:</span>
                        <span className="font-medium">+10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {deal.probability >= 90 ? (
                        <p className="text-green-600 dark:text-green-400">🎯 High priority - Immediate follow-up recommended</p>
                      ) : deal.probability >= 80 ? (
                        <p className="text-blue-600 dark:text-blue-400">📞 Schedule a call within 24 hours</p>
                      ) : deal.probability >= 70 ? (
                        <p className="text-yellow-600 dark:text-yellow-400">📧 Send follow-up email and nurture</p>
                      ) : deal.probability >= 60 ? (
                        <p className="text-orange-600 dark:text-orange-400">⏰ Add to nurture campaign</p>
                      ) : (
                        <p className="text-red-600 dark:text-red-400">❌ Consider disqualifying or long-term nurture</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Deal Qualification" icon={Target}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Qualification Status</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Budget Confirmed:</span>
                      <span className="font-medium text-green-600">✓ Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision Maker:</span>
                      <span className="font-medium text-green-600">✓ Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline Defined:</span>
                      <span className="font-medium text-yellow-600">⚠ Partial</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Need Identified:</span>
                      <span className="font-medium text-green-600">✓ Yes</span>
                  </div>
                </div>
              </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Steps</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <p>• Schedule product demonstration</p>
                    <p>• Send detailed proposal</p>
                    <p>• Follow up on timeline clarification</p>
                    <p>• Prepare contract terms</p>
                  </div>
                </div>
              </div>
            </InfoSection>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6 mt-6">
            {/* Lead History Section */}
            <InfoSection title="Lead History" icon={TrendingUp}>
                    <div>
                {/* Lead Score Evolution - Moved to Top */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> updated lead score from <span className="font-medium text-blue-600 dark:text-blue-400">45/100</span> to <span className="font-medium text-blue-600 dark:text-blue-400">72/100</span> to <span className="font-medium text-blue-600 dark:text-blue-400">{deal.dealScore || deal.probability || 85}/100</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Updated By Id: 25110</div>
                          <div>Updated By: System</div>
                          <div>Updated Via: -</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.convertedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Lead Created */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> created lead for <span className="font-medium text-blue-600 dark:text-blue-400">{deal.company}</span> with contact <span className="font-medium text-blue-600 dark:text-blue-400">{deal.contact}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Created By Id: 25110</div>
                          <div>Created By: System</div>
                          <div>Created Via: Website Form</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.createdDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Lead Qualified */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">{deal.owner}</span> qualified lead and approved for conversion
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Qualified By Id: 25110</div>
                          <div>Qualified By: {deal.owner}</div>
                          <div>Qualified Via: Manual Review</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.convertedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Converted to Deal */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> converted lead to deal <span className="font-medium text-blue-600 dark:text-blue-400">"{deal.title}"</span> with value <span className="font-medium text-blue-600 dark:text-blue-400">${deal.expectedRevenue?.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Converted By Id: 25110</div>
                          <div>Converted By: System</div>
                          <div>Converted Via: Auto Process</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.convertedDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Deal History Section */}
            <InfoSection title="Deal History" icon={Handshake}>
              <div>
                {/* Deal Stage Progression */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> moved deal to <span className="font-medium text-blue-600 dark:text-blue-400">Qualified</span> stage after lead conversion
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Stage Changed By Id: 25110</div>
                          <div>Stage Changed By: System</div>
                          <div>Stage Changed Via: Auto Process</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.convertedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Proposal Stage */}
                {(deal.stage === 'Proposal' || deal.stage === 'Negotiation' || deal.stage === 'Closed Won' || deal.stage === 'Closed Lost') && (
                  <div className="flex items-start space-x-2">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">System</span> moved deal to <span className="font-medium text-blue-600 dark:text-blue-400">Proposal</span> stage with detailed pricing
                        </p>
                      </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <div className="relative inline-block">
                          <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                            <div>Stage Changed By Id: 25110</div>
                            <div>Stage Changed By: System</div>
                            <div>Stage Changed Via: Auto Process</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(new Date(new Date(deal.convertedDate).getTime() + 5 * 24 * 60 * 60 * 1000))}
                               </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Negotiation Stage */}
                {(deal.stage === 'Negotiation' || deal.stage === 'Closed Won' || deal.stage === 'Closed Lost') && (
                  <div className="flex items-start space-x-2">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">System</span> moved deal to <span className="font-medium text-blue-600 dark:text-blue-400">Negotiation</span> stage for pricing discussions
                        </p>
                      </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <div className="relative inline-block">
                          <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                            <div>Stage Changed By Id: 25110</div>
                            <div>Stage Changed By: System</div>
                            <div>Stage Changed Via: Auto Process</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(new Date(new Date(deal.convertedDate).getTime() + 13 * 24 * 60 * 60 * 1000))}
                               </span>
                            </div>
                    </div>
                  </div>
                )}

                {/* Closed Won Stage */}
                {deal.stage === 'Closed Won' && (
                  <div className="flex items-start space-x-2">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">System</span> closed deal as <span className="font-medium text-blue-600 dark:text-blue-400">Won</span> with final value <span className="font-medium text-blue-600 dark:text-blue-400">${deal.actualCloseRevenue?.toLocaleString() || deal.expectedRevenue?.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="relative inline-block">
                          <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                            <div>Closed By Id: 25110</div>
                            <div>Closed By: System</div>
                            <div>Closed Via: Contract Signed</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.closeDate)}</span>
                      </div>
                      </div>
                    </div>
                  )}

                {/* Closed Lost Stage */}
                {deal.stage === 'Closed Lost' && (
                  <div className="flex items-start space-x-2">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </div>
                            </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">System</span> closed deal as <span className="font-medium text-blue-600 dark:text-blue-400">Lost</span> due to budget constraints
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="relative inline-block">
                          <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                            <div>Closed By Id: 25110</div>
                            <div>Closed By: System</div>
                            <div>Closed Via: Budget Constraints</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.closeDate)}</span>
                      </div>
                      </div>
                    </div>
                  )}

                {/* Value Changes */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> updated deal value from <span className="font-medium text-blue-600 dark:text-blue-400">${(deal.expectedRevenue * 0.85)?.toLocaleString()}</span> to <span className="font-medium text-blue-600 dark:text-blue-400">${deal.expectedRevenue?.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Value Updated By Id: 25110</div>
                          <div>Value Updated By: System</div>
                          <div>Value Updated Via: Auto Process</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(new Date(new Date(deal.convertedDate).getTime() + 10 * 24 * 60 * 60 * 1000))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Milestones */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-600 mt-1"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> completed key milestone: <span className="font-medium text-blue-600 dark:text-blue-400">Demo Completed</span> with stakeholders
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Milestone By Id: 25110</div>
                          <div>Milestone By: System</div>
                          <div>Milestone Via: Demo Session</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(new Date(new Date(deal.convertedDate).getTime() + 3 * 24 * 60 * 60 * 1000))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner Assignment */}
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Activity className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">System</span> assigned deal owner to <span className="font-medium text-blue-600 dark:text-blue-400">{deal.owner}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="relative inline-block">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors peer" />
                        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                          <div>Assigned By Id: 25110</div>
                          <div>Assigned By: System</div>
                          <div>Assigned Via: Auto Assignment</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(deal.createdDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </InfoSection>

          </TabsContent>

          {/* AI Activities Tab */}
          <TabsContent value="ai-activities" className="space-y-6 mt-6">
            <InfoSection title="AI-Generated Insights" icon={Brain}>
              <div className="space-y-4">
                {/* AI Analysis */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Deal Analysis</h4>
                      <div className="text-sm text-purple-700 dark:text-purple-300 space-y-2">
                        <p>• <strong>Deal Health:</strong> {deal.probability >= 80 ? 'Excellent' : deal.probability >= 60 ? 'Good' : 'Needs Attention'} - Based on stage progression and engagement</p>
                        <p>• <strong>Closing Probability:</strong> {deal.probability >= 70 ? 'High' : deal.probability >= 50 ? 'Medium' : 'Low'} - Indicated by current stage and timeline</p>
                        <p>• <strong>Sales Cycle:</strong> {deal.probability >= 80 ? 'On track for quick close' : deal.probability >= 60 ? 'Normal progression' : 'May require extended timeline'}</p>
                        <p>• <strong>Risk Assessment:</strong> {deal.probability >= 80 ? 'Low risk, high confidence' : deal.probability >= 60 ? 'Medium risk, good potential' : 'Higher risk, requires monitoring'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">AI Recommendations</h4>
                      <div className="text-sm text-emerald-700 dark:text-emerald-300 space-y-2">
                        <p>• <strong>Best Contact Time:</strong> {deal.probability >= 80 ? 'Morning (9-11 AM) - High engagement period' : 'Afternoon (2-4 PM) - Optimal response window'}</p>
                        <p>• <strong>Communication Style:</strong> {deal.probability >= 80 ? 'Direct and solution-focused' : deal.probability >= 60 ? 'Educational with clear value proposition' : 'Relationship-building approach'}</p>
                        <p>• <strong>Content Strategy:</strong> {deal.probability >= 80 ? 'Case studies and ROI demonstrations' : deal.probability >= 60 ? 'Product demos and feature comparisons' : 'Educational content and industry insights'}</p>
                        <p>• <strong>Follow-up Frequency:</strong> {deal.probability >= 80 ? 'Every 2-3 days' : deal.probability >= 60 ? 'Weekly' : 'Bi-weekly'}</p>
                      </div>
                  </div>
                  </div>
                </div>
                
                {/* AI Activities History */}
                {deal.activities && deal.activities.ai && deal.activities.ai.length > 0 ? (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Activity History</h4>
                        <div className="space-y-2">
                          {deal.activities.ai.map((activity, index) => (
                            <div key={index} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                  {activity.type}
                                </span>
                                <span className="text-xs text-blue-600 dark:text-blue-400">
                                  {formatDate(activity.date)}
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                {activity.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">AI Activity History</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No AI activities recorded yet. AI will automatically track and analyze deal interactions as they occur.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Predictions */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">AI Predictions</h4>
                      <div className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
                        <p>• <strong>Closing Probability:</strong> {deal.probability >= 80 ? '85-95%' : deal.probability >= 60 ? '60-80%' : '30-50%'} - Based on behavioral patterns</p>
                        <p>• <strong>Expected Deal Size:</strong> {deal.probability >= 80 ? 'High value opportunity' : deal.probability >= 60 ? 'Medium value opportunity' : 'Standard value opportunity'}</p>
                        <p>• <strong>Sales Cycle Length:</strong> {deal.probability >= 80 ? 'Short (2-4 weeks)' : deal.probability >= 60 ? 'Medium (1-3 months)' : 'Long (3-6 months)'}</p>
                        <p>• <strong>Key Success Factors:</strong> {deal.probability >= 80 ? 'Focus on ROI and implementation speed' : deal.probability >= 60 ? 'Emphasize features and support' : 'Build relationship and trust first'}</p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </InfoSection>

            <InfoSection title="AI-Generated Next Steps" icon={Star}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Immediate Actions (Next 24 hours)</h4>
                      <ol className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1 list-decimal list-inside">
                        <li>{deal.probability >= 90 ? 'Call immediately and schedule executive meeting' : deal.probability >= 80 ? 'Send personalized email with proposal' : 'Send follow-up email with value proposition'}</li>
                        <li>{deal.probability >= 80 ? 'Prepare custom demo based on company needs' : 'Research company background and pain points'}</li>
                        <li>{deal.probability >= 90 ? 'Notify sales manager of high-priority deal' : 'Add to CRM with detailed notes'}</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">Follow-up Strategy (Next 7 days)</h4>
                      <ol className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1 list-decimal list-inside">
                        <li>{deal.probability >= 80 ? 'Schedule product demonstration' : 'Send educational content and case studies'}</li>
                        <li>{deal.probability >= 70 ? 'Identify and contact additional stakeholders' : 'Qualify budget and decision timeline'}</li>
                        <li>{deal.probability >= 90 ? 'Prepare and send formal proposal' : 'Schedule discovery call to understand needs'}</li>
                        <li>{deal.probability >= 80 ? 'Follow up on proposal and address objections' : 'Continue nurturing with relevant content'}</li>
                      </ol>
                    </div>
                  </div>
                </div>
            </div>
          </InfoSection>
          </TabsContent>

        </Tabs>

        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealViewModal;
