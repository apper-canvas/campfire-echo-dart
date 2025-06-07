import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ProjectCard = ({ project, onArchive, showActions = false }) => {
  const getProgressPercentage = () => {
    // Mock progress calculation
    return Math.floor(Math.random() * 100);
  };

  const progress = getProgressPercentage();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-6 border hover:shadow-md transition-all cursor-pointer group"
    >
      <Link to={`/project/${project.id}`} className="block">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-gray-900 mb-1 break-words group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 break-words">
              {project.description}
            </p>
          </div>
          <div className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            project.status === 'active' 
              ? 'bg-success/10 text-success' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${
              project.status === 'active' ? 'bg-success' : 'bg-gray-400'
            }`}></div>
            {project.status === 'active' ? 'Active' : 'Archived'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-primary h-2 rounded-full"
            ></motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Member Avatars */}
          <div className="flex -space-x-2">
            {project.memberIds?.slice(0, 3).map((memberId, index) => (
              <div
                key={memberId}
                className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                style={{ zIndex: 10 - index }}
              >
                {memberId.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.memberIds?.length > 3 && (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                +{project.memberIds.length - 3}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      {showActions && (
        <div className="mt-4 pt-4 border-t flex items-center justify-end gap-2">
          {project.status === 'active' && onArchive && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                onArchive();
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Archive
            </motion.button>
          )}
          <Link to={`/project/${project.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
            >
              View
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;