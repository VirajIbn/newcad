import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Wrench } from 'lucide-react';
import Card from '../components/ui/card';
import { formatDate, formatRelativeTime } from '../utils/formatDate';

const maintenanceTasks = [
  {
    id: '1',
    assetName: 'Server Room AC Unit',
    assetType: 'HVAC',
    scheduledDate: '2024-01-15',
    status: 'scheduled',
    priority: 'high',
    technician: 'Mike Johnson',
    description: 'Annual maintenance and filter replacement',
  },
  {
    id: '2',
    assetName: 'Forklift #3',
    assetType: 'Vehicle',
    scheduledDate: '2024-01-12',
    status: 'in-progress',
    priority: 'medium',
    technician: 'Sarah Wilson',
    description: 'Oil change and brake inspection',
  },
  {
    id: '3',
    assetName: 'Production Line Machine',
    assetType: 'Machinery',
    scheduledDate: '2024-01-10',
    status: 'completed',
    priority: 'high',
    technician: 'David Chen',
    description: 'Preventive maintenance completed',
  },
  {
    id: '4',
    assetName: 'Office Printer Network',
    assetType: 'Equipment',
    scheduledDate: '2024-01-18',
    status: 'overdue',
    priority: 'low',
    technician: 'Alex Thompson',
    description: 'Software update and calibration',
  },
  {
    id: '5',
    assetName: 'Security Camera System',
    assetType: 'Electronics',
    scheduledDate: '2024-01-20',
    status: 'scheduled',
    priority: 'medium',
    technician: 'Lisa Park',
    description: 'System check and lens cleaning',
  },
];

const statusConfig = {
  scheduled: {
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Scheduled',
  },
  'in-progress': {
    icon: Wrench,
    color: 'text-warning-600 dark:text-warning-400',
    bgColor: 'bg-warning-100 dark:bg-warning-900/20',
    label: 'In Progress',
  },
  completed: {
    icon: CheckCircle,
    color: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-100 dark:bg-success-900/20',
    label: 'Completed',
  },
  overdue: {
    icon: AlertTriangle,
    color: 'text-danger-600 dark:text-danger-400',
    bgColor: 'bg-danger-100 dark:bg-danger-900/20',
    label: 'Overdue',
  },
};

const priorityConfig = {
  high: {
    color: 'text-danger-600 dark:text-danger-400',
    bgColor: 'bg-danger-100 dark:bg-danger-900/20',
  },
  medium: {
    color: 'text-warning-600 dark:text-warning-400',
    bgColor: 'bg-warning-100 dark:bg-warning-900/20',
  },
  low: {
    color: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-100 dark:bg-success-900/20',
  },
};

const MaintenanceSchedule = () => {
  const sortedTasks = [...maintenanceTasks].sort((a, b) => {
    const statusOrder = { overdue: 0, 'in-progress': 1, scheduled: 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <Card.Title>Maintenance Schedule</Card.Title>
            <Card.Subtitle>Upcoming and recent maintenance tasks</Card.Subtitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {maintenanceTasks.filter(task => task.status === 'overdue').length} overdue
            </span>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="space-y-4">
          {sortedTasks.map((task, index) => {
            const status = statusConfig[task.status];
            const priority = priorityConfig[task.priority];
            const StatusIcon = status.icon;
            const isOverdue = task.status === 'overdue';
            
            return (
              <motion.div
                key={task.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Status Icon */}
                <div className={`p-2 rounded-lg ${status.bgColor}`}>
                  <StatusIcon className={`w-5 h-5 ${status.color}`} />
                </div>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {task.assetName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priority.bgColor} ${priority.color}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(task.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(task.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>👤</span>
                        <span>{task.technician}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};

export default MaintenanceSchedule; 