import api from './api';

export const createTable = async (tableData) => {
  const response = await api.post('/tables', tableData);
  return response.data;
};

export const getRestaurantTables = async () => {
  const response = await api.get('/tables');
  return response.data;
};

export const getTableByQRData = async (qrData) => {
  const response = await api.post('/tables/scan', { qr_data: qrData });
  return response.data;
};

export const updateTable = async (id, data) => {
  const response = await api.put(`/tables/${id}`, data);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await api.delete(`/tables/${id}`);
  return response.data;
};
