import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Settings,
  FileText,
  BarChart3,
  Table,
  Calendar,
  Filter,
  Wand2,
  RefreshCw,
  Eye,
  Save,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';

const AIReportGenerator = () => {
  const [reportConfig, setReportConfig] = useState({
    title: 'Custom CRM Report',
    description: 'AI-generated report based on your preferences',
    dateRange: 'last_month',
    dataTypes: ['leads', 'deals', 'activities'],
    format: 'table',
    filters: {
      leadStatus: [],
      dealStage: [],
      activityType: [],
      dateFrom: '',
      dateTo: '',
    },
    columns: {
      leads: ['name', 'company', 'email', 'status', 'value', 'createdDate'],
      deals: ['dealName', 'company', 'value', 'stage', 'probability', 'expectedClose'],
      activities: ['type', 'subject', 'contact', 'date', 'outcome', 'nextAction'],
      revenue: ['period', 'amount', 'type', 'source', 'growth'],
      conversion: ['stage', 'count', 'percentage', 'change', 'avgDuration'],
    },
    sorting: {
      field: 'createdDate',
      order: 'desc',
    },
    grouping: {
      enabled: false,
      field: 'status',
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    leads: [
      { id: 1, name: 'John Smith', company: 'Acme Corp', email: 'john@acme.com', status: 'Qualified', value: 15000, createdDate: '2024-01-15', source: 'Website' },
      { id: 2, name: 'Sarah Johnson', company: 'Tech Solutions Inc', email: 'sarah@techsolutions.com', status: 'Proposal Sent', value: 25000, createdDate: '2024-01-10', source: 'Referral' },
      { id: 3, name: 'Mike Wilson', company: 'Global Industries', email: 'mike@global.com', status: 'Negotiation', value: 35000, createdDate: '2024-01-05', source: 'Social Media' },
      { id: 4, name: 'Emily Davis', company: 'StartupXYZ', email: 'emily@startupxyz.com', status: 'Closed Won', value: 12000, createdDate: '2023-12-20', source: 'Email Campaign' },
      { id: 5, name: 'Robert Brown', company: 'Enterprise Ltd', email: 'robert@enterprise.com', status: 'Closed Lost', value: 45000, createdDate: '2023-12-15', source: 'Website' },
    ],
    deals: [
      { id: 1, dealName: 'Enterprise Software License', company: 'Acme Corp', value: 150000, stage: 'Proposal', probability: 75, expectedClose: '2024-02-15', owner: 'John Smith', createdDate: '2024-01-01' },
      { id: 2, dealName: 'Cloud Migration Project', company: 'Tech Solutions Inc', value: 250000, stage: 'Negotiation', probability: 60, expectedClose: '2024-03-01', owner: 'Sarah Johnson', createdDate: '2023-12-15' },
      { id: 3, dealName: 'Custom Development', company: 'Global Industries', value: 180000, stage: 'Qualification', probability: 40, expectedClose: '2024-04-15', owner: 'Mike Wilson', createdDate: '2024-01-05' },
      { id: 4, dealName: 'SaaS Subscription', company: 'StartupXYZ', value: 50000, stage: 'Closed Won', probability: 100, expectedClose: '2024-01-15', owner: 'Emily Davis', createdDate: '2023-12-20' },
    ],
    activities: [
      { id: 1, type: 'Call', subject: 'Follow-up call with John Smith', contact: 'John Smith - Acme Corp', date: '2024-01-20', time: '10:30 AM', duration: '30 min', outcome: 'Positive response, interested in demo', nextAction: 'Schedule product demo' },
      { id: 2, type: 'Email', subject: 'Proposal sent to Sarah Johnson', contact: 'Sarah Johnson - Tech Solutions Inc', date: '2024-01-18', time: '2:15 PM', duration: '5 min', outcome: 'Proposal delivered successfully', nextAction: 'Follow up in 3 days' },
      { id: 3, type: 'Meeting', subject: 'Product demonstration', contact: 'Mike Wilson - Global Industries', date: '2024-01-19', time: '3:00 PM', duration: '60 min', outcome: 'Very interested, asked for pricing', nextAction: 'Send detailed pricing proposal' },
    ],
    revenue: [
      { id: 1, period: 'January 2024', amount: 45000, type: 'Recurring', source: 'SaaS Subscriptions', growth: 15, previousPeriod: 39130 },
      { id: 2, period: 'February 2024', amount: 52000, type: 'Recurring', source: 'SaaS Subscriptions', growth: 18, previousPeriod: 44068 },
      { id: 3, period: 'March 2024', amount: 48000, type: 'Recurring', source: 'SaaS Subscriptions', growth: 12, previousPeriod: 42857 },
      { id: 4, period: 'Q1 2024', amount: 145000, type: 'One-time', source: 'Enterprise Deals', growth: 25, previousPeriod: 116000 },
      { id: 5, period: 'Q1 2024', amount: 95000, type: 'Professional Services', source: 'Consulting', growth: 30, previousPeriod: 73077 },
    ],
    conversion: [
      { id: 1, stage: 'Lead to Qualified', count: 45, percentage: 65, previousPeriod: 42, change: 7.1, avgDuration: '2.5 days' },
      { id: 2, stage: 'Qualified to Proposal', count: 28, percentage: 62, previousPeriod: 25, change: 12.0, avgDuration: '5 days' },
      { id: 3, stage: 'Proposal to Negotiation', count: 18, percentage: 64, previousPeriod: 15, change: 20.0, avgDuration: '8 days' },
      { id: 4, stage: 'Negotiation to Closed Won', count: 12, percentage: 67, previousPeriod: 10, change: 20.0, avgDuration: '12 days' },
      { id: 5, stage: 'Overall Conversion', count: 12, percentage: 18, previousPeriod: 10, change: 20.0, avgDuration: '27.5 days' },
    ],
  };

  const dataTypeOptions = [
    { value: 'leads', label: 'Leads', icon: '👥' },
    { value: 'deals', label: 'Deals', icon: '🤝' },
    { value: 'activities', label: 'Activities', icon: '📞' },
    { value: 'revenue', label: 'Revenue', icon: '💰' },
    { value: 'conversion', label: 'Conversion', icon: '📈' },
  ];

  const formatOptions = [
    { value: 'table', label: 'Table', icon: Table, description: 'Structured data in rows and columns' },
    { value: 'summary', label: 'Summary', icon: FileText, description: 'Key metrics and insights' },
    { value: 'chart', label: 'Chart', icon: BarChart3, description: 'Visual representation of data' },
  ];

  const dateRangeOptions = [
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const columnOptions = {
    leads: [
      { value: 'name', label: 'Name' },
      { value: 'company', label: 'Company' },
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'status', label: 'Status' },
      { value: 'source', label: 'Source' },
      { value: 'value', label: 'Value' },
      { value: 'createdDate', label: 'Created Date' },
      { value: 'lastContact', label: 'Last Contact' },
    ],
    deals: [
      { value: 'dealName', label: 'Deal Name' },
      { value: 'company', label: 'Company' },
      { value: 'value', label: 'Value' },
      { value: 'stage', label: 'Stage' },
      { value: 'probability', label: 'Probability' },
      { value: 'expectedClose', label: 'Expected Close' },
      { value: 'owner', label: 'Owner' },
      { value: 'createdDate', label: 'Created Date' },
    ],
    activities: [
      { value: 'type', label: 'Type' },
      { value: 'subject', label: 'Subject' },
      { value: 'contact', label: 'Contact' },
      { value: 'date', label: 'Date' },
      { value: 'time', label: 'Time' },
      { value: 'duration', label: 'Duration' },
      { value: 'outcome', label: 'Outcome' },
      { value: 'nextAction', label: 'Next Action' },
    ],
    revenue: [
      { value: 'period', label: 'Period' },
      { value: 'amount', label: 'Amount' },
      { value: 'type', label: 'Type' },
      { value: 'source', label: 'Source' },
      { value: 'growth', label: 'Growth %' },
      { value: 'previousPeriod', label: 'Previous Period' },
    ],
    conversion: [
      { value: 'stage', label: 'Stage' },
      { value: 'count', label: 'Count' },
      { value: 'percentage', label: 'Conversion %' },
      { value: 'previousPeriod', label: 'Previous Period' },
      { value: 'change', label: 'Change %' },
      { value: 'avgDuration', label: 'Avg Duration' },
    ],
  };

  const handleDataTypeToggle = (dataType) => {
    setReportConfig(prev => {
      const isAdding = !prev.dataTypes.includes(dataType);
      
      return {
      ...prev,
        dataTypes: isAdding
          ? [...prev.dataTypes, dataType]
          : prev.dataTypes.filter(type => type !== dataType),
        // Initialize columns if adding a new data type and it doesn't have columns yet
        columns: !isAdding || (prev.columns[dataType] && prev.columns[dataType].length > 0)
          ? prev.columns
          : {
              ...prev.columns,
              [dataType]: columnOptions[dataType]?.slice(0, 6).map(col => col.value) || []
            }
      };
    });
  };

  const handleColumnToggle = (dataType, column) => {
    setReportConfig(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [dataType]: (prev.columns[dataType] || []).includes(column)
          ? (prev.columns[dataType] || []).filter(col => col !== column)
          : [...(prev.columns[dataType] || []), column]
      }
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter and process data based on configuration
    let filteredData = {};
    
    reportConfig.dataTypes.forEach(dataType => {
      if (sampleData[dataType]) {
        const columns = reportConfig.columns[dataType] || [];
        filteredData[dataType] = sampleData[dataType].map(item => {
          const filteredItem = {};
          columns.forEach(column => {
            if (item[column] !== undefined) {
              filteredItem[column] = item[column];
            }
          });
          return filteredItem;
        });
      }
    });

    const report = {
      id: Date.now(),
      title: reportConfig.title,
      description: reportConfig.description,
      generatedAt: new Date().toISOString(),
      config: reportConfig,
      data: filteredData,
      summary: {
        totalRecords: Object.values(filteredData).reduce((sum, arr) => sum + arr.length, 0),
        dataTypes: reportConfig.dataTypes,
        dateRange: reportConfig.dateRange,
      }
    };

    setGeneratedReport(report);
    setIsGenerating(false);
  };

  const exportReport = (format) => {
    console.log(`Exporting report as ${format}...`);
    // Implement export functionality
  };

  const saveReportTemplate = () => {
    console.log('Saving report template...');
    // Implement save functionality
  };

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
          icon={Settings}
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
        </Button>
        <Button
          onClick={generateReport}
          disabled={isGenerating || reportConfig.dataTypes.length === 0}
          icon={isGenerating ? RefreshCw : Wand2}
          className={isGenerating ? 'animate-pulse' : ''}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Report Configuration
            </h3>
            
            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportConfig.title}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={reportConfig.dateRange}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Format
                </label>
                <div className="space-y-2">
                  {formatOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value={option.value}
                          checked={reportConfig.format === option.value}
                          onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                          className="mr-3"
                        />
                        <Icon className="w-5 h-5 mr-3 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Data Types Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Types
            </h3>
            <div className="space-y-2">
              {dataTypeOptions.map(option => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportConfig.dataTypes.includes(option.value)}
                    onChange={() => handleDataTypeToggle(option.value)}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Column Selection */}
          {reportConfig.dataTypes.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Columns to Include
              </h3>
              <div className="space-y-4">
                {reportConfig.dataTypes.map(dataType => (
                  <div key={dataType}>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {dataType} Columns
                    </h4>
                    <div className="space-y-1">
                      {columnOptions[dataType]?.map(column => (
                        <label key={column.value} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={reportConfig.columns[dataType]?.includes(column.value)}
                            onChange={() => handleColumnToggle(dataType, column.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{column.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Generated Report Display */}
        <div className="lg:col-span-2">
          {generatedReport ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Report Header */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {generatedReport.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {generatedReport.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Generated on {new Date(generatedReport.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      icon={Eye}
                      onClick={() => console.log('Preview report')}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      icon={Save}
                      onClick={saveReportTemplate}
                    >
                      Save Template
                    </Button>
                    <Button
                      icon={Download}
                      onClick={() => exportReport('pdf')}
                    >
                      Export PDF
                    </Button>
                  </div>
                </div>
                
                {/* Report Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{generatedReport.summary.totalRecords}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{generatedReport.summary.dataTypes.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Data Types</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {generatedReport.summary.dateRange.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Date Range</div>
                  </div>
                </div>
              </Card>

              {/* Generated Data - Rendered according to selected format */}
              {generatedReport.config.format === 'table' && (
                Object.entries(generatedReport.data).map(([dataType, data]) => (
                <Card key={dataType} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                    {dataType} Report
                  </h3>
                    {data.length > 0 ? (
                      <div className="overflow-x-auto max-md:overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          {Object.keys(data[0] || {}).map(column => (
                            <th key={column} className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, index) => (
                              <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                                {typeof value === 'number' && value > 1000 ? `$${value.toLocaleString()}` : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No data available for {dataType}
                      </div>
                    )}
                  </Card>
                ))
              )}

              {generatedReport.config.format === 'summary' && (
                Object.entries(generatedReport.data).map(([dataType, data]) => (
                  <Card key={dataType} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {dataType} Summary
                    </h3>
                    {data.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.keys(data[0]).slice(0, 6).map(key => {
                          const values = data.map(item => item[key]);
                          const numberValues = values.filter(v => typeof v === 'number');
                          const avg = numberValues.length > 0 ? numberValues.reduce((a, b) => a + b, 0) / numberValues.length : null;
                          const sum = numberValues.reduce((a, b) => a + b, 0);
                          const max = numberValues.length > 0 ? Math.max(...numberValues) : null;
                          const min = numberValues.length > 0 ? Math.min(...numberValues) : null;

                          return (
                            <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              {avg !== null && (
                                <div className="text-2xl font-bold text-blue-600">
                                  {avg.toFixed(2)}
                                </div>
                              )}
                              {avg === null && (
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                  {values.length} items
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Insights</div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div>Total Records: <span className="font-semibold text-gray-900 dark:text-white">{data.length}</span></div>
                            <div>Generated: <span className="font-semibold text-gray-900 dark:text-white">{new Date(generatedReport.generatedAt).toLocaleString()}</span></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No data available for {dataType}
                      </div>
                    )}
                </Card>
                ))
              )}

              {generatedReport.config.format === 'chart' && (
                Object.entries(generatedReport.data).map(([dataType, data]) => (
                  <Card key={dataType} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {dataType} Analytics
                    </h3>
                    {data.length > 0 ? (
                      <div className="space-y-6">
                        {/* Simple bar chart representation */}
                        {Object.keys(data[0]).filter(key => typeof data[0][key] === 'number').slice(0, 3).map((key, idx) => {
                        const values = data.map(item => item[key]);
                        const maxValue = Math.max(...values);
                        const minValue = Math.min(...values);
                        const range = maxValue - minValue;

                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Max: {typeof maxValue === 'number' && maxValue > 1000 ? `$${maxValue.toLocaleString()}` : maxValue}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {data.slice(0, 5).map((row, rowIndex) => (
                                <div key={rowIndex} className="flex items-center gap-2">
                                  <div className="text-xs text-gray-600 dark:text-gray-400 w-12 truncate">
                                    {Object.values(row)[0] || 'Item'}
                                  </div>
                                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                                    <div
                                      className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2 transition-all"
                                      style={{
                                        width: `${((row[key] - minValue) / range) * 100}%`
                                      }}
                                    >
                                      <span className="text-xs text-white font-semibold">
                                        {typeof row[key] === 'number' && row[key] > 1000 ? `$${row[key].toLocaleString()}` : row[key]}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                        })}
                        
                        {/* Legend/Summary */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Total Data Points</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{data.length}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Visualization Type</div>
                            <div className="text-xl font-bold text-blue-600">Bar Chart</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No data available for {dataType}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </motion.div>
          ) : (
            <Card className="p-12 text-center">
              <Wand2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Report Generated Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Configure your preferences and click "Generate Report" to create your custom report
              </p>
              <Button
                onClick={generateReport}
                disabled={reportConfig.dataTypes.length === 0}
                icon={Wand2}
                size="lg"
              >
                Generate Your First Report
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReportGenerator;
