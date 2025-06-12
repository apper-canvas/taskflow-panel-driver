const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'task_list';

// Field mapping from UI to database
const mapTaskListToDatabase = (listData) => {
  return {
    Name: listData.name || '',
    color: listData.color || '#5B47E0',
    icon: listData.icon || 'List',
    task_count: listData.taskCount || 0,
    order: listData.order || 0
  };
};

// Field mapping from database to UI
const mapTaskListFromDatabase = (dbList) => {
  return {
    id: dbList.Id?.toString() || '',
    name: dbList.Name || '',
    color: dbList.color || '#5B47E0',
    icon: dbList.icon || 'List',
    taskCount: dbList.task_count || 0,
    order: dbList.order || 0
  };
};

export const taskListService = {
  async getAll() {
    try {
      const params = {
        fields: ['Id', 'Name', 'color', 'icon', 'task_count', 'order'],
        orderBy: [
          {
            fieldName: 'order',
            SortType: 'ASC'
          }
        ],
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
      
      return response.data ? response.data.map(mapTaskListFromDatabase) : [];
    } catch (error) {
      console.error("Error fetching task lists:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'color', 'icon', 'task_count', 'order']
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Task list not found');
      }
      
      return mapTaskListFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching task list with ID ${id}:`, error);
      throw error;
    }
  },

  async create(listData) {
    try {
      const params = {
        records: [mapTaskListToDatabase(listData)]
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
          throw new Error('Failed to create task list');
        }
        
        if (successfulRecords.length > 0) {
          return mapTaskListFromDatabase(successfulRecords[0].data);
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task list:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id),
        ...mapTaskListToDatabase(updates)
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
          throw new Error('Failed to update task list');
        }
        
        if (successfulUpdates.length > 0) {
          return mapTaskListFromDatabase(successfulUpdates[0].data);
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task list:", error);
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
          throw new Error('Failed to delete task list');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task list:", error);
      throw error;
    }
  }
};