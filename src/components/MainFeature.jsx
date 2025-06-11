import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskListContainer from './TaskListContainer';
import QuickAddBar from './QuickAddBar';
import FilterBar from './FilterBar';
import ProgressRing from './ProgressRing';
import { taskService, taskListService } from '../services';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [filters, setFilters] = useState({
    status: 'active',
    priority: [],
    dateRange: { start: null, end: null },
    listIds: []
  });
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (filters.status === 'active' && task.completed) return false;
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.listIds.length > 0 && !filters.listIds.includes(task.listId)) return false;
    return true;
  });

  // Calculate progress
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress Overview */}
      <div className="bg-surface rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900">
              Daily Progress
            </h2>
            <p className="text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <ProgressRing percentage={completionPercentage} />
        </div>
      </div>

      {/* Quick Add */}
      <QuickAddBar onAdd={handleQuickAdd} taskLists={taskLists} />

      {/* Filters */}
      <FilterBar 
        filters={filters}
        onFiltersChange={setFilters}
        taskLists={taskLists}
      />

      {/* Task List */}
      <TaskListContainer
        tasks={filteredTasks}
        taskLists={taskLists}
        onTaskComplete={handleTaskComplete}
        onTaskEdit={() => {}}
        onTaskDelete={() => {}}
        onDragStart={() => {}}
        onDragEnd={() => {}}
      />
    </motion.div>
  );
};

export default MainFeature;