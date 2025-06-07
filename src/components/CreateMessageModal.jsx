import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const CreateMessageModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      
      // Reset form
      setFormData({
        title: '',
        content: ''
      });
    } catch (err) {
      toast.error('Failed to post message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-gray-900">
                    New Message
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
                  {/* Message Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Enter message subject"
                      required
                    />
                  </div>

                  {/* Message Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      placeholder="Write your message..."
                      required
                    />
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Formatting:</span>
                    <div className="flex gap-1">
                      {[
                        { icon: 'Bold', label: 'Bold' },
                        { icon: 'Italic', label: 'Italic' },
                        { icon: 'Link', label: 'Link' },
                        { icon: 'List', label: 'List' }
                      ].map((tool) => (
                        <motion.button
                          key={tool.icon}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-gray-600 hover:text-primary hover:bg-white rounded transition-colors"
                          title={tool.label}
                        >
                          <ApperIcon name={tool.icon} size={16} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
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
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" size={16} />
                        Post Message
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

export default CreateMessageModal;