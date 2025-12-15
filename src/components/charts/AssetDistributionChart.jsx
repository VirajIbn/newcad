import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/card';

const AssetDistributionChart = ({ data, loading = false, statusMapping = {} }) => {
  // Calculate dynamic text angle based on number of labels and label length
  const calculateTextAngle = (labelCount, maxLabelLength) => {
    // Base angle calculation from label count
    let baseAngle = 0;
    if (labelCount <= 6) baseAngle = 0; // No rotation for 6 or fewer labels
    else if (labelCount <= 8) baseAngle = -30;
    else if (labelCount <= 12) baseAngle = -45;
    else if (labelCount <= 16) baseAngle = -60;
    else baseAngle = -75;

    // Adjust angle based on label length (longer labels need more rotation)
    // Only apply length adjustment if we have more than 6 labels
    const lengthAdjustment = labelCount > 6 ? Math.min(maxLabelLength * 2, 15) : 0;
    const finalAngle = baseAngle - lengthAdjustment;
    
    // Ensure angle doesn't go beyond -45 degrees
    return Math.max(finalAngle, -45);
  };

  // Calculate dynamic margin based on angle and label count
  const calculateBottomMargin = (angle, labelCount) => {
    const baseMargin = 20;
    const angleMultiplier = Math.abs(angle) / 45; // Scale based on angle
    const labelCountMultiplier = Math.min(labelCount * 2, 20); // Additional margin for more labels
    return baseMargin + (angleMultiplier * 40) + labelCountMultiplier;
  };

  // Transform data for Recharts
  const chartData = (() => {
    // If no data or data is empty, return empty array
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    // Get all unique status codes from the data
    const allStatusCodes = new Set();
    Object.values(data).forEach(typeData => {
      Object.keys(typeData).forEach(key => {
        if (key !== 'total' && !isNaN(key)) {
          allStatusCodes.add(parseInt(key));
        }
      });
    });

    // Transform real data dynamically
    const transformedData = Object.entries(data).map(([typeName, typeData]) => {
      const result = { name: typeName, total: typeData.total };
      
      // Add all status codes dynamically
      allStatusCodes.forEach(statusCode => {
        const statusName = statusMapping[statusCode] || `Status ${statusCode}`;
        const fieldName = statusName.toLowerCase().replace(/\s+/g, '');
        result[fieldName] = typeData[statusCode] || 0;
        // Also store the original status name for color mapping
        result[`${fieldName}_original`] = statusName;
      });
      
      return result;
    });

    return transformedData;
  })();

  // Dynamic color mapping for statuses
  const getStatusColor = (statusName) => {
    const colorMap = {
      'assigned': '#f97316',
      'instock': '#3b82f6',
      'in stock': '#3b82f6',
      'inrepair': '#10b981',
      'in repair': '#10b981',
      'scrapped': '#ef4444',
      'retired': '#8b5cf6',
      'recorddeleted': '#6b7280',
      'record deleted': '#6b7280'
    };
    return colorMap[statusName.toLowerCase()] || colorMap[statusName.toLowerCase().replace(/\s+/g, '')] || '#6b7280';
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Create dynamic status data from the payload
      const statusData = payload
        .filter(item => item.value > 0)
        .map(item => {
          // Get the original status name from the data
          const originalStatusName = data[`${item.dataKey}_original`] || item.name;
          return {
            name: originalStatusName,
            value: item.value,
            color: getStatusColor(originalStatusName)
          };
        });

      // Calculate actual total from visible segments
      const actualTotal = statusData.reduce((sum, item) => sum + item.value, 0);

      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-[200px]">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
            {label} (Total: {actualTotal})
          </p>
          <div className="space-y-2">
            {statusData.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {status.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };


  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Asset Distribution by Type</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // If no data available, show message
  if (chartData.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Asset Distribution by Type</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-2">No asset data available</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                {loading ? 'Loading asset data...' : 'Please add some assets to see the distribution chart'}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Calculate dynamic values based on data
  const labelCount = chartData.length;
  const maxLabelLength = chartData.length > 0 ? Math.max(...chartData.map(item => item.name.length)) : 0;
  const textAngle = calculateTextAngle(labelCount, maxLabelLength);
  const bottomMargin = calculateBottomMargin(textAngle, labelCount);
  const xAxisHeight = Math.max(60, Math.abs(textAngle) * 0.8); // Dynamic height based on angle


  // Get unique status names for the legend
  const uniqueStatuses = new Set();
  Object.values(data).forEach(typeData => {
    Object.keys(typeData).forEach(key => {
      if (key !== 'total' && !isNaN(key)) {
        const statusName = statusMapping[key] || `Status ${key}`;
        uniqueStatuses.add(statusName);
      }
    });
  });

  const legendItems = Array.from(uniqueStatuses).map(statusName => ({
    name: statusName,
    color: getStatusColor(statusName)
  }));

  return (
    <Card>
      <Card.Header>
        <Card.Title>Asset Distribution by Type</Card.Title>
        {/* Color palette above the chart */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Card.Header>
      <Card.Content>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: bottomMargin,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ 
                  fontSize: textAngle === 0 ? 13 : 12, // Larger font for horizontal labels
                  fontWeight: 500,
                  angle: textAngle,
                  textAnchor: textAngle === 0 ? 'middle' : 'end',
                  height: xAxisHeight
                }}
                axisLine={{ stroke: '#9ca3af' }}
                tickLine={{ stroke: '#9ca3af' }}
                interval={0}
                height={xAxisHeight + 20}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af' }}
                tickLine={{ stroke: '#9ca3af' }}
                domain={[0, 'dataMax + 2']}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />
              {chartData.length > 0 && Object.keys(chartData[0])
                .filter(key => key !== 'name' && key !== 'total' && !key.endsWith('_original'))
                .map((dataKey, index, array) => {
                  // Find the original status name from the data
                  const originalStatusName = chartData[0][`${dataKey}_original`] || dataKey;
                  const isLast = index === array.length - 1;
                  return (
                    <Bar 
                      key={dataKey}
                      dataKey={dataKey} 
                      stackId="a" 
                      fill={getStatusColor(originalStatusName)} 
                      name={originalStatusName}
                      radius={isLast ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  );
                })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  );
};

export default AssetDistributionChart;
