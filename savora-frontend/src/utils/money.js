export const DELIVERY_FEE = 3.5;
export const FREE_DELIVERY_THRESHOLD = 30;

// Display only. The backend recalculates the final total when the order is placed.
export const getDeliveryFee = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

export const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);