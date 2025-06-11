import taskListsData from '../mockData/taskLists.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let taskLists = [...taskListsData];

export const taskListService = {
  async getAll() {
    await delay(200);
    return [...taskLists];
  },

  async getById(id) {
    await delay(150);
    const list = taskLists.find(l => l.id === id);
    if (!list) {
      throw new Error('Task list not found');
    }
    return { ...list };
  },

  async create(listData) {
    await delay(300);
    const newList = {
      id: Date.now().toString(),
      name: listData.name,
      color: listData.color || '#5B47E0',
      icon: listData.icon || 'List',
      taskCount: 0,
      order: taskLists.length
    };
    taskLists.push(newList);
    return { ...newList };
  },

  async update(id, updates) {
    await delay(250);
    const index = taskLists.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Task list not found');
    }
    
    taskLists[index] = {
      ...taskLists[index],
      ...updates
    };
    
    return { ...taskLists[index] };
  },

  async delete(id) {
    await delay(200);
    const index = taskLists.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Task list not found');
    }
    
    taskLists.splice(index, 1);
    return true;
  }
};