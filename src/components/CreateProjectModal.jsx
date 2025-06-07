import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: 'custom'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templates = [
    {
      id: 'custom',
      name: 'Custom Project',
      description: 'Start from scratch with a blank project',
      icon: 'Settings'
    },
    {
      id: 'website',
      name: 'Website Project',
      description: 'Pre-configured for web development',
      icon: 'Globe'
    },
    {
      id: 'marketing',
      name: 'Marketing Campaign',
      description: 'Templates for marketing initiatives',
      icon: 'Megaphone'
    },
    {
      id: 'product',
      name: 'Product Launch',
      description: 'Structured for product development',
      icon: 'Package'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        memberIds: ['user1'], // Add current user
        status: 'active'
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        template: 'custom'
      });
    } catch (err) {
      toast.error('Failed to create project');
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
                    Create New Project
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
                <div className="space-y-6">
                  {/* Project Template */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose a template
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChange('template', template.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.template === template.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.template === template.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <ApperIcon name={template.icon} size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 break-words">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 break-words">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Project Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  {/* Project Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Describe your project (optional)"
                    />
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
                    disabled={isSubmitting || !formData.name.trim()}
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
                        Create Project
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

export default CreateProjectModal;