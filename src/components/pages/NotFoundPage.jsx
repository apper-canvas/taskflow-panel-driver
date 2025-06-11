import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ApperIcon name="AlertCircle" size={80} className="text-primary mx-auto mb-8" />
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back to managing your tasks.
        </p>
        
        <Button
          onClick={() => navigate('/home')}
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Tasks
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;