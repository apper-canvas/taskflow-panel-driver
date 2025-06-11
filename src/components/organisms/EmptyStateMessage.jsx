import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyStateMessage = ({ onCreateTask, hasFilters = false }) => {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        </motion.div>
        
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          No tasks found
        </h3>
        
        <p className="text-gray-500 mb-6">
          Try adjusting your filters to see more tasks.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <ApperIcon name="CheckSquare" className="w-20 h-20 text-primary mx-auto mb-6" />
      </motion.div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        Ready to get productive?
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start by creating your first task. Break down your goals into manageable steps 
        and watch your productivity soar!
      </p>
      
      <Button
        onClick={onCreateTask}
        className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
      >
        <ApperIcon name="Plus" size={20} className="mr-2" />
        Create Your First Task
      </Button>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>💡 Pro tip: Use the quick add bar above for fast task entry</p>
      </div>
    </motion.div>
  );
};

export default EmptyStateMessage;