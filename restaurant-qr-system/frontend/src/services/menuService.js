import api from './api';

export const createMenuItem = async (menuItem) => {
  const response = await api.post('/menu', menuItem);
  return response.data;
};

export const getRestaurantMenu = async (restaurantId) => {
  const response = await api.get(`/menu/${restaurantId}`);
  return response.data;
};

export const getMenuItems = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await api.put(`/menu/${id}`, data);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};
