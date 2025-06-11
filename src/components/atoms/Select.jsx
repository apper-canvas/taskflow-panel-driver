import React from 'react';

const Select = ({ children, className = '', ...props }) => {
    return (
        <select
            className={`px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;