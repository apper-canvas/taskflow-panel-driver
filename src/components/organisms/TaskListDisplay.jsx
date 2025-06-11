import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';

const TaskListDisplay = ({ 
  tasks, 
  taskLists, 
  onTaskComplete, 
  onTaskEdit, 
  onTaskDelete,
  onDragStart,
  onDragEnd,
  draggedTask
}) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const TaskSection = ({ title, tasks: sectionTasks, count }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-display font-semibold text-gray-900">{title}</h2>
          <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {sectionTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              taskList={taskLists.find(list => list.id === task.listId)}
              onComplete={() => onTaskComplete(task.id)}
              onEdit={() => onTaskEdit(task)}
              onDelete={() => onTaskDelete(task.id)}
              onDragStart={() => onDragStart(task)}
              onDragEnd={onDragEnd}
              isDragged={draggedTask?.id === task.id}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {activeTasks.length > 0 && (
        <TaskSection
          title="Active Tasks"
          tasks={activeTasks}
          count={activeTasks.length}
        />
      )}

      {completedTasks.length > 0 && (
        <TaskSection
          title="Completed Tasks"
          tasks={completedTasks}
          count={completedTasks.length}
        />
      )}
    </div>
  );
};

export default TaskListDisplay;