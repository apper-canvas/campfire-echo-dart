import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import TodoItem from '../components/TodoItem';
import { todoService, projectService } from '../services';

const MyAssignments = () => {
  const [todos, setTodos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, overdue, today, upcoming

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [todosData, projectsData] = await Promise.all([
          todoService.getAll(),
          projectService.getAll()
        ]);
        
        // Filter todos assigned to current user (mock user ID)
        const myTodos = todosData.filter(todo => todo.assigneeId === 'user1');
        setTodos(myTodos);
        setProjects(projectsData);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const filterTodos = (todos) => {
    switch (filter) {
      case 'overdue':
        return todos.filter(todo => 
          !todo.completed && todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate))
        );
      case 'today':
        return todos.filter(todo => 
          !todo.completed && todo.dueDate && isToday(new Date(todo.dueDate))
        );
      case 'upcoming':
        return todos.filter(todo => 
          !todo.completed && todo.dueDate && (isTomorrow(new Date(todo.dueDate)) || isThisWeek(new Date(todo.dueDate)))
        );
      default:
        return todos;
    }
  };

  const groupTodosByProject = (todos) => {
    const grouped = {};
    todos.forEach(todo => {
      const projectName = getProjectName(todo.projectId);
      if (!grouped[projectName]) {
        grouped[projectName] = [];
      }
      grouped[projectName].push(todo);
    });
    return grouped;
  };

  const filteredTodos = filterTodos(todos);
  const groupedTodos = groupTodosByProject(filteredTodos);

  const getFilterCounts = () => {
    return {
      all: todos.length,
      overdue: filterTodos(todos).length,
      today: todos.filter(todo => 
        !todo.completed && todo.dueDate && isToday(new Date(todo.dueDate))
      ).length,
      upcoming: todos.filter(todo => 
        !todo.completed && todo.dueDate && (isTomorrow(new Date(todo.dueDate)) || isThisWeek(new Date(todo.dueDate)))
      ).length
    };
  };

  const filterCounts = getFilterCounts();

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="flex gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
          ))}
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load assignments</h3>
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
          My Assignments
        </h1>
        <p className="text-gray-600">
          All tasks assigned to you across projects
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
          { key: 'all', label: 'All Tasks', count: filterCounts.all },
          { key: 'overdue', label: 'Overdue', count: filterCounts.overdue },
          { key: 'today', label: 'Due Today', count: filterCounts.today },
          { key: 'upcoming', label: 'Upcoming', count: filterCounts.upcoming }
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
      </motion.div>

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
            {filter === 'all' ? 'No assignments yet' : `No ${filter} tasks`}
          </h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all' 
              ? 'Tasks assigned to you will appear here'
              : `You don't have any ${filter} tasks`
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTodos).map(([projectName, projectTodos], index) => (
            <motion.div
              key={projectName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border overflow-hidden"
            >
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-heading font-semibold text-gray-900 break-words">
                  {projectName}
                </h3>
                <p className="text-sm text-gray-500">
                  {projectTodos.length} {projectTodos.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {projectTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggleTodo}
                      showProject={false}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssignments;