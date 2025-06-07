import React from 'react';
import { motion } from 'framer-motion';

const HomePageLoadingSkeleton = ({ isProjectsOnly = false }) => {
    return (
        <div className="max-w-full overflow-hidden">
            {!isProjectsOnly && (
                <div className="mb-8">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-96"></div>
                </div>
            )}
            <div className={`grid grid-cols-1 ${isProjectsOnly ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6 mb-12`}>
                {[...Array(isProjectsOnly ? 3 : 4)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                            <div className="flex items-center justify-between">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HomePageLoadingSkeleton;