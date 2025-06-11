import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TaskDetailModal = ({ task, taskLists, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    listId: taskLists[0]?.id || '',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        listId: task.listId || taskLists[0]?.id || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
      });
    } else {
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            listId: taskLists[0]?.id || '',
            dueDate: ''
        });
    }
  }, [task, taskLists]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-500', icon: 'ArrowDown' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500', icon: 'Minus' },
    { value: 'high', label: 'High', color: 'bg-orange-500', icon: 'ArrowUp' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', icon: 'AlertTriangle' }
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <Button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <FormField
              label="Task Title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              required
              autoFocus
            />

            {/* Description */}
            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('priority', option.value)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                      formData.priority === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-3 h-3 rounded-full ${option.color}`} />
                    <ApperIcon name={option.icon} size={16} className="text-gray-600" />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* List */}
            <FormField
              label="List"
              type="select"
              value={formData.listId}
              onChange={(e) => handleChange('listId', e.target.value)}
            >
              {taskLists.map(list => (
                <option key={list.id} value={list.id}>{list.name}</option>
              ))}
            </FormField>

            {/* Due Date */}
            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-medium transition-colors"
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default TaskDetailModal;