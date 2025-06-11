import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import QuickAddBar from '../components/QuickAddBar';
import TaskListContainer from '../components/TaskListContainer';
import FilterBar from '../components/FilterBar';
import TaskDetailModal from '../components/TaskDetailModal';
import EmptyState from '../components/EmptyState';
import ProgressRing from '../components/ProgressRing';
import ApperIcon from '../components/ApperIcon';
import { taskService, taskListService } from '../services';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'active',
    priority: [],
    dateRange: { start: null, end: null },
    listIds: []
  });
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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
      toast.error('Failed to load data');
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
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header with Progress */}
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

      {/* Quick Add Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border-b border-gray-200 px-6 py-4 flex-shrink-0"
      >
        <QuickAddBar 
          onAdd={handleQuickAdd}
          taskLists={taskLists}
        />
      </motion.div>

      {/* Filter Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border-b border-gray-200 px-6 py-3 flex-shrink-0"
      >
        <FilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          taskLists={taskLists}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Task Lists */}
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-80 bg-surface border-r border-gray-200 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-gray-900">Lists</h2>
              <button
                onClick={() => openTaskModal()}
                className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Plus" size={20} />
              </button>
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
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: list.color }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{list.name}</h3>
                          <p className="text-sm text-gray-500">
                            {completedCount}/{totalCount} tasks
                          </p>
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

        {/* Main Task Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <EmptyState 
                onCreateTask={() => openTaskModal()}
                hasFilters={filters.status !== 'all' || filters.priority.length > 0 || filters.listIds.length > 0}
              />
            ) : (
              <TaskListContainer
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

      {/* Task Detail Modal */}
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

export default Home;