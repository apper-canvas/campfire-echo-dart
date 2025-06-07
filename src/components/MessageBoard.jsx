import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import CreateMessageModal from './CreateMessageModal';
import { messageService } from '../services';

const MessageBoard = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await messageService.getAll();
        const projectMessages = result.filter(message => message.projectId === projectId);
        setMessages(projectMessages);
      } catch (err) {
        setError(err.message || 'Failed to load messages');
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadMessages();
    }
  }, [projectId]);

  const handleCreateMessage = async (messageData) => {
    try {
      const newMessage = await messageService.create({
        ...messageData,
        projectId,
        authorId: 'user1', // Current user
        comments: []
      });
      setMessages(prev => [newMessage, ...prev]);
      setShowCreateModal(false);
      toast.success('Message posted successfully!');
    } catch (err) {
      toast.error('Failed to post message');
    }
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
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
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load messages</h3>
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
          Message Board
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          New Message
        </motion.button>
      </div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
          <p className="mt-2 text-gray-500">Start the conversation with your team</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Post First Message
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                  {message.authorId.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading font-semibold text-gray-900 break-words">
                      {message.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap break-words mb-4">
                    {message.content}
                  </div>
                  
                  {/* Comments */}
                  {message.comments && message.comments.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ApperIcon name="MessageSquare" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {message.comments.length} {message.comments.length === 1 ? 'comment' : 'comments'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {message.comments.map((comment, commentIndex) => (
                          <div key={commentIndex} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {comment.authorId?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-700 break-words">{comment.content}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <ApperIcon name="MessageSquare" size={16} />
                      Reply
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <ApperIcon name="Heart" size={16} />
                      Like
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateMessageModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMessage}
      />
    </div>
  );
};

export default MessageBoard;