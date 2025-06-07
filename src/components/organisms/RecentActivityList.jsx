import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RecentActivityList = ({ recentActivity }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 border"
        >
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
                <div className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <ApperIcon
                                    name={activity.action === 'completed' ? 'CheckCircle' : activity.action === 'created' ? 'Plus' : 'MessageCircle'}
                                    size={16}
                                    className="text-primary"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 break-words">
                                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                                    <span className="font-medium">{activity.item}</span> in{' '}
                                    <span className="text-primary">{activity.project}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default RecentActivityList;