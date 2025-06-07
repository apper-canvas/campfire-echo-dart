import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import TodoList from '../components/TodoList';
import MessageBoard from '../components/MessageBoard';
import FilesList from '../components/FilesList';
import { projectService, messageService, todoService, fileService } from '../services';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { key: 'todos', label: 'Todos', icon: 'CheckSquare' },
    { key: 'messages', label: 'Messages', icon: 'MessageCircle' },
    { key: 'files', label: 'Files', icon: 'FolderOpen' }
  ];

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await projectService.getById(id);
        setProject(result);
      } catch (err) {
        setError(err.message || 'Failed to load project');
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="flex gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-500 mb-4">{error || 'The project you are looking for does not exist'}</p>
          <Link
            to="/projects"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'todos':
        return <TodoList projectId={id} />;
      case 'messages':
        return <MessageBoard projectId={id} />;
      case 'files':
        return <FilesList projectId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/projects" className="hover:text-primary transition-colors">
            Projects
          </Link>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900 font-medium break-words">{project.name}</span>
        </nav>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2 break-words">
                {project.name}
              </h1>
              <p className="text-gray-600 break-words">{project.description}</p>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <div className="flex -space-x-2">
                {project.memberIds?.slice(0, 3).map((memberId, index) => (
                  <div
                    key={memberId}
                    className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                  >
                    {memberId.charAt(0).toUpperCase()}
                  </div>
                ))}
                {project.memberIds?.length > 3 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                    +{project.memberIds.length - 3}
                  </div>
                )}
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectDetail;