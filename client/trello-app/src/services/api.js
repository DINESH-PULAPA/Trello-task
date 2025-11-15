import axios from 'axios';

const API_BASE_URL = 'https://trello-task-u0kk.onrender.com/api';

// Board API
export const getAllBoards = async () => {
  const response = await axios.get(`${API_BASE_URL}/boards`);
  return response.data;
};

export const createBoard = async (name) => {
  const response = await axios.post(`${API_BASE_URL}/boards`, {
    name,
    defaultLists: true
  });
  return response.data;
};

export const deleteBoard = async (boardId) => {
  const response = await axios.delete(`${API_BASE_URL}/boards/${boardId}`);
  return response.data;
};

export const getBoardLists = async (boardId) => {
  const response = await axios.get(`${API_BASE_URL}/boards/${boardId}/lists`);
  return response.data;
};

// Task API
export const getTasksForList = async (listId) => {
  const response = await axios.get(`${API_BASE_URL}/tasks/list/${listId}`);
  return response.data;
};

export const createTask = async (listId, name, desc = '') => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, {
    listId,
    name,
    desc
  });
  return response.data;
};

export const updateTask = async (cardId, updates) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${cardId}`, updates);
  return response.data;
};

export const deleteTask = async (cardId) => {
  const response = await axios.delete(`${API_BASE_URL}/tasks/${cardId}`);
  return response.data;
};
