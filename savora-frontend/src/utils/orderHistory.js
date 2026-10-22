// Stores order references on this device only. The server still checks the tracking token.
const STORAGE_KEY = 'savora-orders';

export const getSavedOrders = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const saveOrderReference = (reference) => {
  try {
    const others = getSavedOrders().filter((order) => order.id !== reference.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([reference, ...others].slice(0, 50)));
  } catch {
    // Storage unavailable. The order was still placed on the server.
  }
};