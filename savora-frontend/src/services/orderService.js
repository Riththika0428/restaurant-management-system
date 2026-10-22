import api from './api.js';

// Only items (foodId + quantity) are sent. The server calculates every price.
export const createOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  // Expected: { data: order, trackingToken }
  return data;
};

// The tracking token proves the caller placed the order. Without it, the order stays private.
export const getOrderById = async (id, trackingToken) => {
  const { data } = await api.get(`/orders/${id}`, {
    headers: { 'X-Order-Token': trackingToken },
  });
  return data.data;
};