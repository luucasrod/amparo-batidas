import api from './api';

export const createPayment = async (orderId, customerName, amount, paymentMethod = 'cash') => {
  const response = await api.post('/payments', {
    order_id: orderId,
    customer_name: customerName,
    amount,
    payment_method: paymentMethod,
  });
  return response.data;
};

export const getPaymentsByOrder = async (orderId) => {
  const response = await api.get(`/payments/${orderId}`);
  return response.data;
};

export const getOrderTotal = async (orderId) => {
  const response = await api.get(`/payments/${orderId}/total`);
  return response.data;
};
