import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProjectCard from '../components/ProjectCard';
import QuickActions from '../components/QuickActions';
import { projectService } from '../services';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsData = await projectService.getAll();
        setProjects(projectsData.slice(0, 4)); // Show first 4 projects
        
        // Mock recent activity
        setRecentActivity([
          { id: 1, action: 'completed', item: 'Design mockups', project: 'Website Redesign', time: '2 hours ago', user: 'Sarah Chen' },
          { id: 2, action: 'created', item: 'New todo list', project: 'Mobile App', time: '4 hours ago', user: 'Mike Torres' },
          { id: 3, action: 'commented', item: 'Sprint planning notes', project: 'Platform Update', time: '6 hours ago', user: 'Alex Rodriguez' }
        ]);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
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
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </motion.div>

      <QuickActions />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-900">
            Active Projects
          </h2>
          <Link
            to="/projects"
            className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            View all
            <ApperIcon name="ArrowRight" size={16} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg border"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="FolderOpen" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first project</p>
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Project
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 border"
        >
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon
                      name={activity.action === 'completed' ? 'CheckCircle' : activity.action === 'created' ? 'Plus' : 'MessageCircle'}
                      size={16}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.item}</span> in{' '}
                      <span className="text-primary">{activity.project}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 border"
        >
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Projects</span>
              <span className="text-2xl font-bold text-primary">{projects.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tasks Completed Today</span>
              <span className="text-2xl font-bold text-success">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Team Members</span>
              <span className="text-2xl font-bold text-info">12</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;