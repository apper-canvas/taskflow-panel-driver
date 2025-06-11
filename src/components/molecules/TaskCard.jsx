import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

// Priority configuration constants
const PRIORITY_CONFIG = {
  colors: {
    urgent: 'priority-urgent',
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
  },
  icons: {
    urgent: 'AlertTriangle',
    high: 'ArrowUp',
    medium: 'Minus',
    low: 'ArrowDown'
  }
};

// Task completion checkbox component
const TaskCheckbox = React.memo(({ task, onComplete }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onComplete}
    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
      task.completed
        ? 'bg-success border-success text-white'
        : 'border-gray-300 hover:border-primary'
    }`}
  >
    {task.completed && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="spring-bounce"
      >
        <ApperIcon name="Check" size={14} />
      </motion.div>
    )}
  </motion.button>
));

TaskCheckbox.displayName = 'TaskCheckbox';

// Task metadata component (priority, list, due date)
const TaskMetadata = React.memo(({ task, taskList }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex items-center space-x-4 mt-3">
      {/* Priority Badge */}
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white ${PRIORITY_CONFIG.colors[task.priority]}`}>
        <ApperIcon name={PRIORITY_CONFIG.icons[task.priority]} size={12} />
        <span className="capitalize">{task.priority}</span>
      </div>

      {/* List Badge */}
      {taskList && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: taskList.color }}
          />
          <span>{taskList.name}</span>
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center space-x-1 text-xs ${
          isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-500'
        }`}>
          <ApperIcon name="Calendar" size={12} />
          <span>
            {isOverdue ? 'Overdue' : isDueToday ? 'Due today' : format(new Date(task.dueDate), 'MMM d')}
          </span>
        </div>
      )}
    </div>
  );
});

TaskMetadata.displayName = 'TaskMetadata';

// Task action buttons component
const TaskActions = React.memo(({ onEdit, onDelete }) => (
  <div className="flex items-center space-x-1 ml-4">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onEdit}
      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
    >
      <ApperIcon name="Edit3" size={16} />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onDelete}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <ApperIcon name="Trash2" size={16} />
    </motion.button>
  </div>
));

TaskActions.displayName = 'TaskActions';

// Task content component
const TaskContent = React.memo(({ task, taskList, onEdit, onDelete }) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-gray-900 break-words ${
          task.completed ? 'line-through text-gray-500' : ''
        }`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1 break-words">
            {task.description}
          </p>
        )}
        
        <TaskMetadata task={task} taskList={taskList} />
      </div>

      <TaskActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  </div>
));

TaskContent.displayName = 'TaskContent';

// Main TaskCard component
const TaskCard = React.forwardRef(({ 
  task, 
  taskList, 
  onComplete, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  isDragged,
  index 
}, ref) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.02, y: -2 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-surface rounded-lg border border-gray-200 p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
        task.completed ? 'opacity-70' : ''
      } ${isDragged ? 'drag-ghost' : ''} ${
        isOverdue ? 'border-red-300 bg-red-50' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <TaskCheckbox task={task} onComplete={onComplete} />
        <TaskContent 
          task={task} 
          taskList={taskList} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;