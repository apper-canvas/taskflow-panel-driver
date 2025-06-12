const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'task';

// Field mapping from UI to database
const mapTaskToDatabase = (taskData) => {
  return {
    title: taskData.title || '',
    description: taskData.description || '',
    list_id: parseInt(taskData.listId) || null,
    priority: taskData.priority || 'medium',
    due_date: taskData.dueDate || null,
    completed: taskData.completed || false,
    completed_at: taskData.completedAt || null,
    created_at: taskData.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Field mapping from database to UI
const mapTaskFromDatabase = (dbTask) => {
  return {
    id: dbTask.Id,
    title: dbTask.title || '',
    description: dbTask.description || '',
    listId: dbTask.list_id?.toString() || '',
    priority: dbTask.priority || 'medium',
    dueDate: dbTask.due_date || null,
    completed: dbTask.completed || false,
    completedAt: dbTask.completed_at || null,
    createdAt: dbTask.created_at || new Date().toISOString(),
    updatedAt: dbTask.updated_at || new Date().toISOString()
  };
};

export const taskService = {
  async getAll() {
    try {
      const params = {
        fields: ['Id', 'title', 'description', 'list_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'updated_at'],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data ? response.data.map(mapTaskFromDatabase) : [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'title', 'description', 'list_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'updated_at']
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Task not found');
      }
      
      return mapTaskFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [mapTaskToDatabase(taskData)]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          throw new Error('Failed to create task');
        }
        
        if (successfulRecords.length > 0) {
          return mapTaskFromDatabase(successfulRecords[0].data);
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id),
        ...mapTaskToDatabase(updates)
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          throw new Error('Failed to update task');
        }
        
        if (successfulUpdates.length > 0) {
          return mapTaskFromDatabase(successfulUpdates[0].data);
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          throw new Error('Failed to delete task');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};