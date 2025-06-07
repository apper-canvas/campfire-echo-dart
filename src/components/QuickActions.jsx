import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import CreateProjectModal from './CreateProjectModal';

const QuickActions = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const actions = [
    {
      id: 'create-project',
      label: 'Create Project',
      icon: 'Plus',
      color: 'bg-primary',
      onClick: () => setShowCreateModal(true)
    },
    {
      id: 'view-assignments',
      label: 'My Tasks',
      icon: 'CheckSquare',
      color: 'bg-success',
      to: '/my-assignments'
    },
    {
      id: 'team-activity',
      label: 'Activity',
      icon: 'Activity',
      color: 'bg-info',
      to: '/activity'
    },
    {
      id: 'team-members',
      label: 'Team',
      icon: 'Users',
      color: 'bg-accent',
      to: '/team'
    }
  ];

  const handleCreateProject = (projectData) => {
    // This will be handled by the modal
    setShowCreateModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const ActionWrapper = action.to ? Link : 'button';
            return (
              <ActionWrapper
                key={action.id}
                to={action.to}
                onClick={action.onClick}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg p-4 border hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <ApperIcon name={action.icon} size={24} className="text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm break-words">
                    {action.label}
                  </h3>
                </motion.div>
              </ActionWrapper>
            );
          })}
        </div>
      </motion.div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
};

export default QuickActions;