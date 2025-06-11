import React from 'react';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin border-4 border-primary border-t-transparent rounded-full ${sizeClasses[size]} ${className}`} />
  );
};

export default LoadingSpinner;