import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isYesterday } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { projectService } from '../services';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, todos, messages, files

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
        
        // Mock activity data
        const mockActivities = [
          {
            id: 1,
            type: 'todo_completed',
            user: 'Sarah Chen',
            userId: 'user2',
            action: 'completed',
            item: 'Update homepage design',
            projectId: projectsData[0]?.id || 'project1',
            timestamp: new Date().toISOString(),
            metadata: { todoId: 'todo1' }
          },
          {
            id: 2,
            type: 'message_created',
            user: 'Mike Torres',
            userId: 'user3',
            action: 'posted',
            item: 'Sprint planning discussion',
            projectId: projectsData[1]?.id || 'project2',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            metadata: { messageId: 'msg1' }
          },
          {
            id: 3,
            type: 'file_uploaded',
            user: 'Alex Rodriguez',
            userId: 'user4',
            action: 'uploaded',
            item: 'design-mockups.pdf',
            projectId: projectsData[0]?.id || 'project1',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            metadata: { fileId: 'file1', fileSize: '2.4 MB' }
          },
          {
            id: 4,
            type: 'todo_created',
            user: 'Emma Wilson',
            userId: 'user5',
            action: 'created',
            item: 'Review API documentation',
            projectId: projectsData[2]?.id || 'project3',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            metadata: { todoId: 'todo2', assignee: 'John Doe' }
          },
          {
            id: 5,
            type: 'project_created',
            user: 'David Kim',
            userId: 'user6',
            action: 'created',
            item: 'Mobile App Redesign',
            projectId: projectsData[1]?.id || 'project2',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            metadata: {}
          },
          {
            id: 6,
            type: 'message_comment',
            user: 'Lisa Parker',
            userId: 'user7',
            action: 'commented on',
            item: 'Team meeting notes',
            projectId: projectsData[0]?.id || 'project1',
            timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
            metadata: { messageId: 'msg2', comment: 'Great points about the timeline' }
          }
        ];
        
        setActivities(mockActivities);
      } catch (err) {
        setError(err.message || 'Failed to load activity');
        toast.error('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'todo_completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'todo_created':
        return { icon: 'Plus', color: 'text-primary' };
      case 'message_created':
        return { icon: 'MessageCircle', color: 'text-info' };
      case 'message_comment':
        return { icon: 'MessageSquare', color: 'text-info' };
      case 'file_uploaded':
        return { icon: 'Upload', color: 'text-accent' };
      case 'project_created':
        return { icon: 'FolderPlus', color: 'text-primary' };
      default:
        return { icon: 'Activity', color: 'text-gray-500' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const filterActivities = (activities) => {
    switch (filter) {
      case 'todos':
        return activities.filter(a => a.type.startsWith('todo_'));
      case 'messages':
        return activities.filter(a => a.type.startsWith('message_'));
      case 'files':
        return activities.filter(a => a.type === 'file_uploaded');
      default:
        return activities;
    }
  };

  const filteredActivities = filterActivities(activities);

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      let key;
      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else {
        key = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(activity);
    });
    return groups;
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="flex gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load activity</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Activity
        </h1>
        <p className="text-gray-600">
          Recent updates and changes across all projects
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-4 mb-8"
      >
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {[
          { key: 'all', label: 'All Activity' },
          { key: 'todos', label: 'Todos' },
          { key: 'messages', label: 'Messages' },
          { key: 'files', label: 'Files' }
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setFilter(option.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === option.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </motion.div>

      {filteredActivities.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Activity" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium">No activity yet</h3>
          <p className="mt-2 text-gray-500">
            Activity from your projects will appear here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, dateActivities], index) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                {date}
              </h3>
              <div className="space-y-3">
                {dateActivities.map((activity) => {
                  const { icon, color } = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        color === 'text-success' ? 'bg-success/10' :
                        color === 'text-primary' ? 'bg-primary/10' :
                        color === 'text-info' ? 'bg-info/10' :
                        color === 'text-accent' ? 'bg-accent/10' :
                        'bg-gray-100'
                      }`}>
                        <ApperIcon name={icon} size={20} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 break-words">
                              <span className="font-medium">{activity.user}</span>{' '}
                              {activity.action}{' '}
                              <span className="font-medium">{activity.item}</span>{' '}
                              in{' '}
                              <span className="text-primary">{getProjectName(activity.projectId)}</span>
                            </p>
                            {activity.metadata?.assignee && (
                              <p className="text-sm text-gray-500 mt-1">
                                Assigned to {activity.metadata.assignee}
                              </p>
                            )}
                            {activity.metadata?.fileSize && (
                              <p className="text-sm text-gray-500 mt-1">
                                File size: {activity.metadata.fileSize}
                              </p>
                            )}
                            {activity.metadata?.comment && (
                              <p className="text-sm text-gray-600 mt-2 italic break-words">
                                "{activity.metadata.comment}"
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;