import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TodoItem from '@/components/TodoItem';
import EmptyState from '@/components/molecules/EmptyState';

const RecentTasksList = ({ recentTodos, onToggleTodo }) => {
    const emptyStateProps = {
        iconName: "CheckSquare",
        title: "No tasks yet",
        description: "Tasks will appear here",
        compact: true
    };

    return (
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
                <EmptyState {...emptyStateProps} />
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
                                onToggle={onToggleTodo}
                                compact={true}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentTasksList;