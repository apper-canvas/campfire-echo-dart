import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';

const QuickStatsPanel = ({ activeProjectsCount, tasksCompletedToday, teamMembers }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 border"
        >
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Quick Stats
            </h3>
            <div className="space-y-4">
                <StatCard label="Active Projects" value={activeProjectsCount} valueClassName="text-primary" />
                <StatCard label="Tasks Completed Today" value={tasksCompletedToday} valueClassName="text-success" />
                <StatCard label="Team Members" value={teamMembers} valueClassName="text-info" />
            </div>
        </motion.div>
    );
};

export default QuickStatsPanel;