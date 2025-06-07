import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/molecules/EmptyState';

const ProjectsOverview = ({ projects, title, viewAllLink, emptyStateProps }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-gray-900">
                    {title}
                </h2>
                <Link
                    to={viewAllLink}
                    className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                    View all
                    <ApperIcon name="ArrowRight" size={16} />
                </Link>
            </div>

            {projects.length === 0 ? (
                <EmptyState {...emptyStateProps} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsOverview;