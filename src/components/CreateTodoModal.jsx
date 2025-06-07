import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

const CreateTodoModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    assigneeId: '',
    dueDate: '',
    listId: 'default'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null
      });
      
      // Reset form
      setFormData({
        title: '',
        assigneeId: '',
        dueDate: '',
        listId: 'default'
      });
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const assignees = [
    { id: '', name: 'Unassigned' },
    { id: 'user1', name: 'Alex Rodriguez' },
    { id: 'user2', name: 'Sarah Chen' },
    { id: 'user3', name: 'Mike Torres' },
    { id: 'user4', name: 'Emma Wilson' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-gray-900">
                    Add New Task
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Task Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  {/* Assignee */}
                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to
                    </label>
                    <select
                      id="assignee"
                      value={formData.assigneeId}
                      onChange={(e) => handleChange('assigneeId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    >
                      {assignees.map((assignee) => (
                        <option key={assignee.id} value={assignee.id}>
                          {assignee.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) => handleChange('dueDate', e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim()}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} />
                        Add Task
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTodoModal;