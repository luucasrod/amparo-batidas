import api from './api';

export const createOrder = async (tableId) => {
  const response = await api.post('/orders', { table_id: tableId });
  return response.data;
};

export const addOrderItem = async (orderId, menuItemId, customerName, quantity = 1, notes = '') => {
  const response = await api.post('/orders/item', {
    order_id: orderId,
    menu_item_id: menuItemId,
    customer_name: customerName,
    quantity,
    notes,
  });
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const getOrderItemsByCustomer = async (orderId, customerName) => {
  const response = await api.get(`/orders/${orderId}/${customerName}`);
  return response.data;
};

export const markItemAsPaid = async (itemId) => {
  const response = await api.put(`/orders/item/${itemId}/paid`);
  return response.data;
};

export const getOrdersByTable = async (tableId) => {
  const response = await api.get(`/orders/table/${tableId}`);
  return response.data;
};

export const closeOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/close`);
  return response.data;
};
