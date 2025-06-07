import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomePageErrorState = ({ error }) => {
    return (
        <div className="max-w-full overflow-hidden">
            <div className="text-center py-12">
                <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
};

export default HomePageErrorState;