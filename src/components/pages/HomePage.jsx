import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, taskListService } from '@/services';

import QuickAddTaskForm from '@/components/organisms/QuickAddTaskForm';
import TaskListDisplay from '@/components/organisms/TaskListDisplay';
import TaskFilterBar from '@/components/organisms/TaskFilterBar';
import TaskDetailModal from '@/components/organisms/TaskDetailModal';
import EmptyStateMessage from '@/components/organisms/EmptyStateMessage';
import TaskHeader from '@/components/organisms/TaskHeader';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import Badge from '@/components/atoms/Badge';
import ColorDot from '@/components/atoms/ColorDot';
import Label from '@/components/atoms/Label';
// Custom hook for task operations
const useTaskOperations = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
const [tasksData, listsData] = await Promise.all([
        taskService.getAll(),
        taskListService.getAll()
      ]);
      setTasks(tasksData);
      setTaskLists(listsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data. Please check your connection and try again.');
} finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (updatedTask.completed) {
        toast.success('Task completed! Great job! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return {
    tasks,
    setTasks,
    taskLists,
    loading,
    loadData,
    handleQuickAdd,
    handleTaskComplete,
    handleTaskUpdate,
    handleTaskDelete
  };
};

// Custom hook for drag and drop functionality
const useDragAndDrop = (tasks, setTasks) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (listId) => {
    if (!draggedTask || draggedTask.listId === listId) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = await taskService.update(draggedTask.id, { listId });
      setTasks(prev => prev.map(t => t.id === draggedTask.id ? updatedTask : t));
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to move task');
    }
    setDraggedTask(null);
  };

  return {
    draggedTask,
    handleDragStart,
    handleDragEnd,
    handleDrop
  };
};

// Custom hook for modal state management
const useTaskModal = (handleQuickAdd, handleTaskUpdate) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openTaskModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleModalSave = async (taskData) => {
    try {
      if (selectedTask) {
        await handleTaskUpdate(selectedTask.id, taskData);
      } else {
        await handleQuickAdd(taskData);
      }
      closeTaskModal();
    } catch (error) {
      // Error handling is done in the respective functions
    }
  };

  return {
    selectedTask,
    isModalOpen,
    openTaskModal,
    closeTaskModal,
    handleModalSave
  };
};

// Custom hook for task filtering and statistics
const useTaskFilters = (tasks) => {
  const [filters, setFilters] = useState({
    status: 'active',
    priority: [],
    dateRange: { start: null, end: null },
    listIds: []
  });

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status === 'active' && task.completed) return false;
    if (filters.status === 'completed' && !task.completed) return false;

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;

    // List filter
    if (filters.listIds.length > 0 && !filters.listIds.includes(task.listId)) return false;

    // Date range filter
    if (filters.dateRange.start && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      const startDate = new Date(filters.dateRange.start);
      if (taskDate < startDate) return false;
    }
    if (filters.dateRange.end && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      const endDate = new Date(filters.dateRange.end);
      if (taskDate > endDate) return false;
    }

    return true;
  });

  // Calculate progress stats
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return {
    filters,
    setFilters,
    filteredTasks,
    completedTasksCount,
    totalTasksCount,
    completionPercentage
  };
};

const HomePage = () => {
  // Use custom hooks for different concerns
  const {
    tasks,
    setTasks,
    taskLists,
    loading,
    loadData,
    handleQuickAdd,
    handleTaskComplete,
    handleTaskUpdate,
    handleTaskDelete
  } = useTaskOperations();

  const { draggedTask, handleDragStart, handleDragEnd, handleDrop } = useDragAndDrop(tasks, setTasks);
  
  const { selectedTask, isModalOpen, openTaskModal, closeTaskModal, handleModalSave } = useTaskModal(
    handleQuickAdd,
    handleTaskUpdate
  );

  const {
    filters,
    setFilters,
    filteredTasks,
    completedTasksCount,
    totalTasksCount,
    completionPercentage
  } = useTaskFilters(tasks);

  useEffect(() => {
    loadData();
}, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TaskHeader 
        completedTasks={completedTasksCount}
        totalTasks={totalTasksCount}
        completionPercentage={completionPercentage}
      />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border-b border-gray-200 px-6 py-4 flex-shrink-0"
      >
        <QuickAddTaskForm 
          onAdd={handleQuickAdd}
          taskLists={taskLists}
        />
      </motion.div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border-b border-gray-200 px-6 py-3 flex-shrink-0"
      >
        <TaskFilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          taskLists={taskLists}
        />
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-80 bg-surface border-r border-gray-200 overflow-y-auto"
>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Label variant="heading">Lists</Label>
              <Button
                onClick={() => openTaskModal()}
                className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Plus" size={20} />
              </Button>
            </div>
            
            <div className="space-y-2">
              {taskLists.map((list) => {
                const listTasks = tasks.filter(t => t.listId === list.id);
                const completedCount = listTasks.filter(t => t.completed).length;
                const totalCount = listTasks.length;
                
                return (
                  <motion.div
                    key={list.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`p-4 rounded-lg border-2 border-dashed border-transparent transition-all cursor-pointer hover:bg-gray-50 ${
                      draggedTask ? 'drop-zone-active' : ''
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(list.id)}
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      listIds: prev.listIds.includes(list.id) 
                        ? prev.listIds.filter(id => id !== list.id)
                        : [...prev.listIds, list.id]
}))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ColorDot color={list.color} />
                        <div>
                          <Label variant="subheading">{list.name}</Label>
                          <Label variant="subtitle">
                            {completedCount}/{totalCount} tasks
                          </Label>
                        </div>
                      </div>
                      <ApperIcon name={list.icon} size={20} className="text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <EmptyStateMessage
                onCreateTask={() => openTaskModal()}
                hasFilters={filters.status !== 'all' || filters.priority.length > 0 || filters.listIds.length > 0}
              />
            ) : (
              <TaskListDisplay
                tasks={filteredTasks}
                taskLists={taskLists}
                onTaskComplete={handleTaskComplete}
                onTaskEdit={openTaskModal}
                onTaskDelete={handleTaskDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
              />
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TaskDetailModal
            task={selectedTask}
            taskLists={taskLists}
            onSave={handleModalSave}
            onClose={closeTaskModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;