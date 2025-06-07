import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';

const TodoItem = ({ todo, onToggle, onDelete, showActions = false, showProject = true, compact = false }) => {
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'text-error';
    if (isToday(date)) return 'text-accent';
    return 'text-gray-500';
  };

  const formattedDueDate = formatDueDate(todo.dueDate);
  const dueDateColor = getDueDateColor(todo.dueDate);

  return (
    <motion.div
      className={`flex items-start gap-3 ${compact ? 'p-3 bg-white rounded-lg border' : ''}`}
      whileHover={compact ? { scale: 1.02 } : {}}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-success border-success text-white'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        {todo.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ApperIcon name="Check" size={12} />
          </motion.div>
        )}
      </motion.button>

      <div className="flex-1 min-w-0">
        <div className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'} break-words`}>
          <span className={compact ? 'text-sm' : 'font-medium'}>{todo.title}</span>
        </div>
        
        <div className="flex items-center gap-4 mt-1">
          {todo.assigneeId && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {todo.assigneeId.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500">
                {todo.assigneeId}
              </span>
            </div>
          )}
          
          {formattedDueDate && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={12} className={dueDateColor} />
              <span className={`text-xs ${dueDateColor}`}>
                {formattedDueDate}
              </span>
            </div>
          )}

          {showProject && todo.projectId && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Folder" size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                Project
              </span>
            </div>
          )}
        </div>
      </div>

      {showActions && onDelete && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(todo.id)}
          className="p-1 text-gray-400 hover:text-error transition-colors"
        >
          <ApperIcon name="Trash2" size={16} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default TodoItem;