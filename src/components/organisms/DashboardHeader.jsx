import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                Welcome back! 👋
            </h1>
            <p className="text-gray-600">
                Here's what's happening with your projects today.
            </p>
        </motion.div>
    );
};

export default DashboardHeader;