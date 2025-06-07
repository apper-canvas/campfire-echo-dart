import React from 'react';

const StatCard = ({ label, value, valueClassName }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{label}</span>
            <span className={`text-2xl font-bold ${valueClassName}`}>{value}</span>
        </div>
    );
};

export default StatCard;