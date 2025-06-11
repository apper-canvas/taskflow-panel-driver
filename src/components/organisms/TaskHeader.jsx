import React from 'react';
import { motion } from 'framer-motion';
import ProgressRing from '@/components/molecules/ProgressRing';

const TaskHeader = ({ completedTasks, totalTasks, completionPercentage }) => {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-surface border-b border-gray-200 px-6 py-4 flex-shrink-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <ProgressRing 
            percentage={completionPercentage}
            size={60}
            strokeWidth={4}
          />
        </div>
        <div className="text-right">
          <div className="text-3xl font-display font-bold text-primary">
            {completionPercentage}%
          </div>
          <div className="text-sm text-gray-500">Daily Progress</div>
        </div>
      </div>
    </motion.header>
  );
};

export default TaskHeader;