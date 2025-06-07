import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import TodoItem from './TodoItem';
import CreateTodoModal from './CreateTodoModal';
import { todoService } from '../services';

const TodoList = ({ projectId }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await todoService.getAll();
        const projectTodos = result.filter(todo => todo.projectId === projectId);
        setTodos(projectTodos);
      } catch (err) {
        setError(err.message || 'Failed to load todos');
        toast.error('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadTodos();
    }
  }, [projectId]);

  const handleCreateTodo = async (todoData) => {
    try {
      const newTodo = await todoService.create({
        ...todoData,
        projectId,
        completed: false,
        order: todos.length
      });
      setTodos(prev => [...prev, newTodo]);
      setShowCreateModal(false);
      toast.success('Todo created successfully!');
    } catch (err) {
      toast.error('Failed to create todo');
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      const updatedTodo = await todoService.update(todoId, { 
        completed: !todo.completed 
      });
      
      setTodos(prev => prev.map(t => t.id === todoId ? updatedTodo : t));
      toast.success(updatedTodo.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await todoService.delete(todoId);
      setTodos(prev => prev.filter(t => t.id !== todoId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getFilterCounts = () => {
    return {
      all: todos.length,
      pending: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  };

  const filterCounts = getFilterCounts();

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex gap-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load todos</h3>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Todo Lists
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Task
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {[
          { key: 'all', label: 'All Tasks', count: filterCounts.all },
          { key: 'pending', label: 'Pending', count: filterCounts.pending },
          { key: 'completed', label: 'Completed', count: filterCounts.completed }
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setFilter(option.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              filter === option.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === option.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {option.count}
            </span>
          </button>
        ))}
      </div>

      {filteredTodos.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all' 
              ? 'Create your first task to get started'
              : `You don't have any ${filter} tasks`
            }
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Task
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4"
              >
                <TodoItem
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <CreateTodoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTodo}
      />
    </div>
  );
};

export default TodoList;