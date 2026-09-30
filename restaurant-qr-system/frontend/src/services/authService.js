import api from './api';

export const registerRestaurant = async (data) => {
  const response = await api.post('/auth/register', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('restaurantId', response.data.restaurant.id);
  }
  return response.data;
};

export const loginRestaurant = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('restaurantId', response.data.restaurant.id);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('restaurantId');
  localStorage.removeItem('orderId');
  localStorage.removeItem('sessionId');
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};
