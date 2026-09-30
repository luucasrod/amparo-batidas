import api from './api';

export const createRating = async (orderId, customerName, rating, comment = '') => {
  const response = await api.post('/ratings', {
    order_id: orderId,
    customer_name: customerName,
    rating,
    comment,
  });
  return response.data;
};

export const getRestaurantRatings = async (restaurantId) => {
  const response = await api.get(`/ratings/${restaurantId}`);
  return response.data;
};

export const getMyRatings = async () => {
  const response = await api.get('/ratings/auth/my-ratings');
  return response.data;
};
