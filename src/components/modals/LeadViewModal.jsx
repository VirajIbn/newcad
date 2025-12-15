import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building2, 
  Package, 
  FileText, 
  X,
  Phone,
  Mail,
  Calendar,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Info,
  BarChart3,
  History,
  Brain,
  TrendingUp,
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

const LeadViewModal = ({ isOpen, onClose, lead }) => {
  if (!lead) return null;

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
      case 'Closed Won':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Closed Lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };


  const getLeadAge = (createdDate) => {
    const today = new Date();
    const created = new Date(createdDate);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getLeadAgeColor = (createdDate) => {
    const days = getLeadAge(createdDate);
    if (days === 0) return 'bg-blue-500';
    else if (days <= 3) return 'bg-green-500';
    else if (days <= 7) return 'bg-yellow-500';
    else if (days <= 14) return 'bg-orange-500';
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
              {value || 'N/A'}
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
                Lead Details
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete information for {lead.name}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-3">
                <Badge className={`${getStatusColor(lead.status)} text-sm px-3 py-1`}>
                  {lead.status}
                </Badge>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold ${getLeadAgeColor(lead.createdDate)}`}>
                  {getLeadAge(lead.createdDate)}
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
                      <li>{lead.leadScore >= 90 ? 'Call immediately and schedule executive meeting' : lead.leadScore >= 80 ? 'Send personalized email with proposal' : 'Send follow-up email with value proposition'}</li>
                      <li>{lead.leadScore >= 80 ? 'Prepare custom demo based on company needs' : 'Research company background and pain points'}</li>
                      <li>{lead.leadScore >= 90 ? 'Notify sales manager of high-priority lead' : 'Add to CRM with detailed notes'}</li>
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
                      <li>{lead.leadScore >= 80 ? 'Schedule product demonstration' : 'Send educational content and case studies'}</li>
                      <li>{lead.leadScore >= 70 ? 'Identify and contact additional stakeholders' : 'Qualify budget and decision timeline'}</li>
                      <li>{lead.leadScore >= 90 ? 'Prepare and send formal proposal' : 'Schedule discovery call to understand needs'}</li>
                      <li>{lead.leadScore >= 80 ? 'Follow up on proposal and address objections' : 'Continue nurturing with relevant content'}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          {/* 
          DESIGN OPTIONS - Uncomment the one you prefer:
          
          Option 1: Modern Pill Style (Currently Active)
          Option 2: Underline Style
          Option 3: Card Style with Borders
          Option 4: Minimal Clean Style
          Option 5: Vertical Sidebar Style
          */}
          
          {/* Design Option 1: Enhanced Modern Style with Better Selected State */}
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
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="ai-activities" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Activities
            </TabsTrigger>
          </TabsList>

          {/* 
          ALTERNATIVE DESIGNS - Replace the TabsList above with any of these:
          
          {/* Design Option 2: Underline Style
          <TabsList className="inline-flex h-10 items-center justify-start space-x-8 border-b border-gray-200 dark:border-gray-700 w-full bg-transparent p-0">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap px-1 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 gap-2"
            >
              <Info className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="inline-flex items-center justify-center whitespace-nowrap px-1 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 gap-2"
            >
              <User className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="scoring" 
              className="inline-flex items-center justify-center whitespace-nowrap px-1 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="inline-flex items-center justify-center whitespace-nowrap px-1 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 gap-2"
            >
              <History className="w-4 h-4" />
              Activities
            </TabsTrigger>
          </TabsList>
          */}

          {/* Design Option 3: Card Style with Borders
          <TabsList className="inline-flex h-auto items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 text-gray-500 dark:text-gray-400 w-full shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 gap-2"
            >
              <Info className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 gap-2"
            >
              <User className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="scoring" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 gap-2"
            >
              <History className="w-4 h-4" />
              Activities
            </TabsTrigger>
          </TabsList>
          */}

          {/* Design Option 4: Minimal Clean Style
          <TabsList className="inline-flex h-10 items-center justify-center space-x-1 bg-transparent p-0 w-full">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:rounded-lg gap-2"
            >
              <Info className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:rounded-lg gap-2"
            >
              <User className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="scoring" 
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:rounded-lg gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:rounded-lg gap-2"
            >
              <History className="w-4 h-4" />
              Activities
            </TabsTrigger>
          </TabsList>
          */}

          {/* Design Option 6: Premium Glass Effect
          <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/50 p-1 text-gray-600 dark:text-gray-300 w-full shadow-xl">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:via-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 gap-2"
            >
              <Info className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:via-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 gap-2"
            >
              <User className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="scoring" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:via-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:via-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 gap-2"
            >
              <History className="w-4 h-4" />
              Activities
            </TabsTrigger>
          </TabsList>
          */}

          {/* Design Option 7: Neon Glow Effect
          <TabsList className="inline-flex h-12 items-center justify-center rounded-2xl bg-gray-900 dark:bg-gray-950 p-1 text-gray-400 dark:text-gray-500 w-full border border-gray-800 dark:border-gray-700">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:ring-2 data-[state=active]:ring-cyan-400/50 hover:bg-gray-800 dark:hover:bg-gray-800 gap-2"
            >
              <Info className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:ring-2 data-[state=active]:ring-cyan-400/50 hover:bg-gray-800 dark:hover:bg-gray-800 gap-2"
            >
              <User className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="scoring" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:ring-2 data-[state=active]:ring-cyan-400/50 hover:bg-gray-800 dark:hover:bg-gray-800 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 data-[state=active]:transform data-[state=active]:scale-105 data-[state=active]:ring-2 data-[state=active]:ring-cyan-400/50 hover:bg-gray-800 dark:hover:bg-gray-800 gap-2"
            >
              <History className="w-4 h-4" />
              Activities
            </TabsTrigger>
          </TabsList>
          */}

          {/* Design Option 5: Vertical Sidebar Style (Complete Alternative Layout)
          <div className="flex h-[600px]">
            <TabsList className="flex flex-col h-full w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 space-y-1">
              <TabsTrigger 
                value="overview" 
                className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm gap-3"
              >
                <Info className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm gap-3"
              >
                <User className="w-4 h-4" />
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger 
                value="scoring" 
                className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm gap-3"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Scoring</span>
              </TabsTrigger>
              <TabsTrigger 
                value="activities" 
                className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm gap-3"
              >
                <History className="w-4 h-4" />
                <span>Activities</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="p-6">
                // ... same content as horizontal tabs
              </TabsContent>
              <TabsContent value="contact" className="p-6">
                // ... same content as horizontal tabs
              </TabsContent>
              <TabsContent value="scoring" className="p-6">
                // ... same content as horizontal tabs
              </TabsContent>
              <TabsContent value="activities" className="p-6">
                // ... same content as horizontal tabs
              </TabsContent>
            </div>
          </div>
          */}

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <InfoSection title="Lead Overview" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField label="Lead ID" value={`#${lead.id}`} />
              <InfoField label="Lead Status" value={lead.status} />
              <InfoField label="Lead Value" value={lead.value ? `$${lead.value.toLocaleString()}` : 'N/A'} icon={DollarSign} />
              <InfoField label="Created Date" value={formatDate(lead.createdDate)} icon={Calendar} />
              <InfoField label="Last Contact" value={formatDate(lead.lastContact)} icon={Clock} />
              <InfoField label="Lead Age" value={`${getLeadAge(lead.createdDate)} days`} />
                <InfoField label="Source" value={lead.source} />
                <InfoField label="Owner" value={lead.owner} icon={User} />
                <InfoField label="Created" value={formatDateTime(lead.createdDate)} />
              </div>
            </InfoSection>

            <InfoSection title="Company Information" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Company" value={lead.company} icon={Building2} />
                <InfoField label="Industry" value={lead.industry || 'N/A'} />
                <InfoField label="Company Size" value={lead.companySize || 'N/A'} />
                <InfoField label="Website" value={lead.website} type="website" icon={Globe} />
              </div>
            </InfoSection>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6 mt-6">
            <InfoSection title="Primary Contact" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField label="Full Name" value={`${lead.name}`} />
                <InfoField label="Email" value={lead.email} type="email" icon={Mail} />
                <InfoField label="Phone" value={lead.phone} type="phone" icon={Phone} />
                <InfoField label="Job Title" value={lead.jobTitle || 'N/A'} />
                <InfoField label="Department" value={lead.department || 'N/A'} />
                <InfoField label="Preferred Contact" value={lead.preferredContact || 'N/A'} />
              </div>
            </InfoSection>

            <InfoSection title="Address Information" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Address" value={lead.address || 'N/A'} />
                <InfoField label="City" value={lead.city || 'N/A'} />
                <InfoField label="State" value={lead.state || 'N/A'} />
                <InfoField label="Country" value={lead.country || 'N/A'} />
                <InfoField label="Postal Code" value={lead.postalCode || 'N/A'} />
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
          <InfoSection title="Lead Scoring" icon={Target}>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Lead Score</span>
                  <span className={`text-2xl font-bold ${
                    lead.leadScore >= 90 ? 'text-green-600 dark:text-green-400' :
                    lead.leadScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                    lead.leadScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                    lead.leadScore >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {lead.leadScore || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        lead.leadScore >= 90 ? 'bg-green-500' :
                        lead.leadScore >= 80 ? 'bg-blue-500' :
                        lead.leadScore >= 70 ? 'bg-yellow-500' :
                        lead.leadScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${lead.leadScore || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {lead.leadScore >= 90 ? 'Excellent' :
                     lead.leadScore >= 80 ? 'Very Good' :
                     lead.leadScore >= 70 ? 'Good' :
                     lead.leadScore >= 60 ? 'Fair' : 'Poor'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Scoring Factors</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Company Size:</span>
                      <span className="font-medium">+15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Level:</span>
                      <span className="font-medium">+20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget Fit:</span>
                      <span className="font-medium">+25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="font-medium">+15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision Authority:</span>
                      <span className="font-medium">+10</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {lead.leadScore >= 90 ? (
                      <p className="text-green-600 dark:text-green-400">🎯 High priority - Immediate follow-up recommended</p>
                    ) : lead.leadScore >= 80 ? (
                      <p className="text-blue-600 dark:text-blue-400">📞 Schedule a call within 24 hours</p>
                    ) : lead.leadScore >= 70 ? (
                      <p className="text-yellow-600 dark:text-yellow-400">📧 Send follow-up email and nurture</p>
                    ) : lead.leadScore >= 60 ? (
                      <p className="text-orange-600 dark:text-orange-400">⏰ Add to nurture campaign</p>
                    ) : (
                      <p className="text-red-600 dark:text-red-400">❌ Consider disqualifying or long-term nurture</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </InfoSection>

            <InfoSection title="Lead Qualification" icon={Target}>
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
            {lead.activities ? (
              <InfoSection title="Activity History" icon={Activity}>
              <div className="space-y-4">
                {/* Manual Activities */}
                {lead.activities.manual && lead.activities.manual.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                      Manual Activities ({lead.activities.manual.length})
                    </h4>
                    <div className="space-y-2">
                      {lead.activities.manual.map((activity, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
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
                )}

                {/* AI Activities */}
                {lead.activities.ai && lead.activities.ai.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-purple-500" />
                      AI Activities ({lead.activities.ai.length})
                    </h4>
                    <div className="space-y-2">
                      {lead.activities.ai.map((activity, index) => (
                        <div key={index} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                              {activity.type}
                            </span>
                            <span className="text-xs text-purple-600 dark:text-purple-400">
                              {formatDate(activity.date)}
                            </span>
                          </div>
                          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                            {activity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!lead.activities.manual || lead.activities.manual.length === 0) && 
                 (!lead.activities.ai || lead.activities.ai.length === 0) && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No activities recorded yet</p>
                  </div>
                )}
              </div>
            </InfoSection>
            ) : (
              <InfoSection title="Activity History" icon={Activity}>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No activities recorded yet</p>
              </div>
            </InfoSection>
          )}

            <InfoSection title="Communication Log" icon={Mail}>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No communication logs available</p>
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
                      <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Lead Analysis</h4>
                      <div className="text-sm text-purple-700 dark:text-purple-300 space-y-2">
                        <p>• <strong>Engagement Level:</strong> {lead.leadScore >= 80 ? 'High' : lead.leadScore >= 60 ? 'Medium' : 'Low'} - Based on interaction patterns and response rates</p>
                        <p>• <strong>Buying Intent:</strong> {lead.leadScore >= 70 ? 'Strong' : lead.leadScore >= 50 ? 'Moderate' : 'Weak'} - Indicated by content consumption and behavior</p>
                        <p>• <strong>Decision Timeline:</strong> {lead.leadScore >= 80 ? 'Immediate (1-2 weeks)' : lead.leadScore >= 60 ? 'Short-term (1-3 months)' : 'Long-term (3+ months)'}</p>
                        <p>• <strong>Risk Assessment:</strong> {lead.leadScore >= 80 ? 'Low risk, high value' : lead.leadScore >= 60 ? 'Medium risk, good potential' : 'Higher risk, requires nurturing'}</p>
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
                        <p>• <strong>Best Contact Time:</strong> {lead.leadScore >= 80 ? 'Morning (9-11 AM) - High engagement period' : 'Afternoon (2-4 PM) - Optimal response window'}</p>
                        <p>• <strong>Communication Style:</strong> {lead.leadScore >= 80 ? 'Direct and solution-focused' : lead.leadScore >= 60 ? 'Educational with clear value proposition' : 'Relationship-building approach'}</p>
                        <p>• <strong>Content Strategy:</strong> {lead.leadScore >= 80 ? 'Case studies and ROI demonstrations' : lead.leadScore >= 60 ? 'Product demos and feature comparisons' : 'Educational content and industry insights'}</p>
                        <p>• <strong>Follow-up Frequency:</strong> {lead.leadScore >= 80 ? 'Every 2-3 days' : lead.leadScore >= 60 ? 'Weekly' : 'Bi-weekly'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Activities History */}
                {lead.activities && lead.activities.ai && lead.activities.ai.length > 0 ? (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Activity History</h4>
                        <div className="space-y-2">
                          {lead.activities.ai.map((activity, index) => (
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
                          No AI activities recorded yet. AI will automatically track and analyze lead interactions as they occur.
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
                        <p>• <strong>Conversion Probability:</strong> {lead.leadScore >= 80 ? '85-95%' : lead.leadScore >= 60 ? '60-80%' : '30-50%'} - Based on behavioral patterns</p>
                        <p>• <strong>Expected Deal Size:</strong> {lead.leadScore >= 80 ? 'High value opportunity' : lead.leadScore >= 60 ? 'Medium value opportunity' : 'Standard value opportunity'}</p>
                        <p>• <strong>Sales Cycle Length:</strong> {lead.leadScore >= 80 ? 'Short (2-4 weeks)' : lead.leadScore >= 60 ? 'Medium (1-3 months)' : 'Long (3-6 months)'}</p>
                        <p>• <strong>Key Success Factors:</strong> {lead.leadScore >= 80 ? 'Focus on ROI and implementation speed' : lead.leadScore >= 60 ? 'Emphasize features and support' : 'Build relationship and trust first'}</p>
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
                        <li>{lead.leadScore >= 90 ? 'Call immediately and schedule executive meeting' : lead.leadScore >= 80 ? 'Send personalized email with proposal' : 'Send follow-up email with value proposition'}</li>
                        <li>{lead.leadScore >= 80 ? 'Prepare custom demo based on company needs' : 'Research company background and pain points'}</li>
                        <li>{lead.leadScore >= 90 ? 'Notify sales manager of high-priority lead' : 'Add to CRM with detailed notes'}</li>
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
                        <li>{lead.leadScore >= 80 ? 'Schedule product demonstration' : 'Send educational content and case studies'}</li>
                        <li>{lead.leadScore >= 70 ? 'Identify and contact additional stakeholders' : 'Qualify budget and decision timeline'}</li>
                        <li>{lead.leadScore >= 90 ? 'Prepare and send formal proposal' : 'Schedule discovery call to understand needs'}</li>
                        <li>{lead.leadScore >= 80 ? 'Follow up on proposal and address objections' : 'Continue nurturing with relevant content'}</li>
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

export default LeadViewModal;
