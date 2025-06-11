import React from 'react';

const ColorDot = ({ color, size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    default: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  return (
    <div 
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorDot;