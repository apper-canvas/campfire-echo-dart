import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import ProjectCard from './ProjectCard';
import TodoItem from './TodoItem';
import { projectService, todoService } from '../services';

const MainFeature = () => {
  const [projects, setProjects] = useState([]);
  const [recentTodos, setRecentTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectsData, todosData] = await Promise.all([
          projectService.getAll(),
          todoService.getAll()
        ]);
        
        setProjects(projectsData.slice(0, 3)); // Show first 3 projects
        setRecentTodos(todosData.slice(0, 5)); // Show first 5 todos
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleTodo = async (todoId) => {
    try {
      const todo = recentTodos.find(t => t.id === todoId);
      const updatedTodo = await todoService.update(todoId, { 
        completed: !todo.completed 
      });
      
      setRecentTodos(prev => prev.map(t => t.id === todoId ? updatedTodo : t));
      toast.success(updatedTodo.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects skeleton */}
          <div className="lg:col-span-2">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Todos skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Recent Projects
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
              className="text-center py-8 bg-white rounded-lg border"
            >
              <ApperIcon name="FolderOpen" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Create your first project to get started</p>
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Project
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Recent Todos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Recent Tasks
            </h2>
            <Link
              to="/my-assignments"
              className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
            >
              View all
              <ApperIcon name="ArrowRight" size={16} />
            </Link>
          </div>

          {recentTodos.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 bg-white rounded-lg border"
            >
              <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium mb-2">No tasks yet</h3>
              <p className="text-gray-500 text-sm">Tasks will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {recentTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TodoItem
                    todo={todo}
                    onToggle={handleToggleTodo}
                    compact={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFeature;