import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterBar = ({ filters, onFiltersChange, taskLists }) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'active', label: 'Active', icon: 'Circle' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
    { value: 'low', label: 'Low', color: 'bg-green-500' }
  ];

  const togglePriority = (priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const toggleList = (listId) => {
    const newListIds = filters.listIds.includes(listId)
      ? filters.listIds.filter(id => id !== listId)
      : [...filters.listIds, listId];
    
    onFiltersChange({ ...filters, listIds: newListIds });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: [],
      dateRange: { start: null, end: null },
      listIds: []
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.priority.length > 0 || 
                          filters.listIds.length > 0 ||
                          filters.dateRange.start || 
                          filters.dateRange.end;

  return (
    <div className="flex items-center justify-between max-w-full overflow-hidden">
      <div className="flex items-center space-x-6 min-w-0 flex-1">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          {statusOptions.map(option => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFiltersChange({ ...filters, status: option.value })}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filters.status === option.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name={option.icon} size={16} />
              <span>{option.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Priority:</span>
          <div className="flex space-x-1">
            {priorityOptions.map(option => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => togglePriority(option.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${option.color} ${
                  filters.priority.includes(option.value)
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-300 opacity-60'
                }`}
                title={`${option.label} Priority`}
              />
            ))}
          </div>
        </div>

        {/* List Filter */}
        {taskLists.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Lists:</span>
            <div className="flex space-x-1">
              {taskLists.slice(0, 4).map(list => (
                <motion.button
                  key={list.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleList(list.id)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    filters.listIds.includes(list.id)
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: filters.listIds.includes(list.id) ? list.color : undefined
                  }}
                >
                  {list.name}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAllFilters}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ApperIcon name="X" size={14} />
          <span>Clear</span>
        </motion.button>
      )}
    </div>
  );
};

export default FilterBar;