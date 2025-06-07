import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { projectService } from '../services';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, archived

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await projectService.getAll();
        setProjects(result);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [newProject, ...prev]);
      setShowCreateModal(false);
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleArchiveProject = async (projectId) => {
    try {
      const updatedProject = await projectService.update(projectId, { status: 'archived' });
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
      toast.success('Project archived');
    } catch (err) {
      toast.error('Failed to archive project');
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'active') return project.status === 'active';
    if (filter === 'archived') return project.status === 'archived';
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load projects</h3>
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
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Projects
          </h1>
          <p className="text-gray-600">
            Manage and organize your team projects
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          New Project
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-6"
      >
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {[
          { key: 'all', label: 'All Projects' },
          { key: 'active', label: 'Active' },
          { key: 'archived', label: 'Archived' }
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

      {filteredProjects.length === 0 ? (
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
          <h3 className="mt-4 text-lg font-medium">
            {filter === 'all' ? 'No projects yet' : `No ${filter} projects`}
          </h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all' 
              ? 'Get started by creating your first project'
              : `You don't have any ${filter} projects`
            }
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Project
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard 
                project={project} 
                onArchive={() => handleArchiveProject(project.id)}
                showActions={true}
              />
            </motion.div>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default Projects;