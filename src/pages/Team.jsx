import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { projectService } from '../services';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeamData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
        
        // Mock team member data
        const mockTeamMembers = [
          {
            id: 'user1',
            name: 'Alex Rodriguez',
            email: 'alex.rodriguez@company.com',
            role: 'Product Manager',
            avatar: '/avatars/alex.jpg',
            status: 'online',
            projectCount: 3,
            tasksCompleted: 24,
            joinDate: '2023-01-15'
          },
          {
            id: 'user2',
            name: 'Sarah Chen',
            email: 'sarah.chen@company.com',
            role: 'UX Designer',
            avatar: '/avatars/sarah.jpg',
            status: 'online',
            projectCount: 2,
            tasksCompleted: 18,
            joinDate: '2023-02-20'
          },
          {
            id: 'user3',
            name: 'Mike Torres',
            email: 'mike.torres@company.com',
            role: 'Frontend Developer',
            avatar: '/avatars/mike.jpg',
            status: 'away',
            projectCount: 4,
            tasksCompleted: 32,
            joinDate: '2022-11-10'
          },
          {
            id: 'user4',
            name: 'Emma Wilson',
            email: 'emma.wilson@company.com',
            role: 'Backend Developer',
            avatar: '/avatars/emma.jpg',
            status: 'online',
            projectCount: 3,
            tasksCompleted: 28,
            joinDate: '2023-03-05'
          },
          {
            id: 'user5',
            name: 'David Kim',
            email: 'david.kim@company.com',
            role: 'DevOps Engineer',
            avatar: '/avatars/david.jpg',
            status: 'offline',
            projectCount: 2,
            tasksCompleted: 15,
            joinDate: '2023-04-12'
          },
          {
            id: 'user6',
            name: 'Lisa Parker',
            email: 'lisa.parker@company.com',
            role: 'QA Engineer',
            avatar: '/avatars/lisa.jpg',
            status: 'online',
            projectCount: 3,
            tasksCompleted: 21,
            joinDate: '2023-01-30'
          }
        ];
        
        setTeamMembers(mockTeamMembers);
      } catch (err) {
        setError(err.message || 'Failed to load team data');
        toast.error('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'away':
        return 'bg-accent';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="bg-white rounded-lg p-6 border animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load team data</h3>
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
          Team
        </h1>
        <p className="text-gray-600">
          Meet your team members and see their contributions
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-primary mb-1">{teamMembers.length}</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        <div className="bg-white rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {teamMembers.filter(m => m.status === 'online').length}
          </div>
          <div className="text-sm text-gray-600">Online Now</div>
        </div>
        <div className="bg-white rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-info mb-1">{projects.length}</div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </div>
        <div className="bg-white rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
          </div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>
      </motion.div>

      {teamMembers.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium">No team members yet</h3>
          <p className="mt-2 text-gray-500">Invite team members to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Invite Members
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 border hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-lg font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-gray-900 break-words">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 break-words">{member.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`}></div>
                    <span className="text-xs text-gray-500">{getStatusText(member.status)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900 break-words text-right">{member.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium text-primary">{member.projectCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tasks Done</span>
                  <span className="font-medium text-success">{member.tasksCompleted}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Joined {member.joinDate}</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                    >
                      <ApperIcon name="Mail" size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                    >
                      <ApperIcon name="MessageCircle" size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;