import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const QuickAddBar = ({ onAdd, taskLists }) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [listId, setListId] = useState(taskLists[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Smart date parsing
    let dueDate = null;
    const dateMatches = title.match(/\b(today|tomorrow|next week)\b/i);
    if (dateMatches) {
      const today = new Date();
      switch (dateMatches[0].toLowerCase()) {
        case 'today':
          dueDate = today;
          break;
        case 'tomorrow':
          dueDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'next week':
          dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    onAdd({
      title: title.replace(/\b(today|tomorrow|next week)\b/gi, '').trim(),
      priority,
      listId: listId || taskLists[0]?.id,
      dueDate
    });

    setTitle('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
    }
  };

  return (
    <motion.div
      layout
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task... (Try 'Review report tomorrow' or 'Call client today')"
            className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
          />
          <ApperIcon 
            name="Plus" 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          
          {title && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ApperIcon name="ArrowRight" size={16} />
            </motion.button>
          )}
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">List:</span>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {taskLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-gray-500">
              Press Ctrl+Enter to add quickly
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default QuickAddBar;