import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ iconName, title, description, actionButtonText, actionButtonLink, compact = false }) => {
    const iconSizeClass = compact ? "w-12 h-12" : "w-16 h-16";
    const titleClass = compact ? "text-lg font-medium mb-2" : "mt-4 text-lg font-medium";
    const descriptionClass = compact ? "text-gray-500 mb-4" : "mt-2 text-gray-500";
    const paddingClass = compact ? "py-8" : "py-12";

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center ${paddingClass} bg-white rounded-lg border`}
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <ApperIcon name={iconName} className={`${iconSizeClass} text-gray-300 mx-auto`} />
            </motion.div>
            <h3 className={titleClass}>{title}</h3>
            <p className={descriptionClass}>{description}</p>
            {actionButtonText && actionButtonLink && (
                <Link to={actionButtonLink}>
                    <Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {actionButtonText}
                    </Button>
                </Link>
            )}
        </motion.div>
    );
};

export default EmptyState;