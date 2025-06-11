import React from 'react';

const Label = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'text-gray-900',
    heading: 'text-lg font-display font-semibold text-gray-900',
    subheading: 'text-base font-medium text-gray-900',
    subtitle: 'text-sm text-gray-500',
    caption: 'text-xs text-gray-500'
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Label;