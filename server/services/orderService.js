import crypto from 'crypto';
import Food from '../models/Food.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

const MAX_QUANTITY = 20;

const round2 = (value) => Math.round(value * 100) / 100;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateOrderNumber = () => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SAV-${Date.now().toString(36).toUpperCase()}-${random}`;
};

export function calculateDeliveryFee(subtotal) {
  return subtotal === 0 || subtotal >= env.freeDeliveryThreshold ? 0 : env.deliveryFee;
}

// Combines duplicate cart lines, for example two entries for the same dish.
function mergeItems(items) {
  const totals = new Map();
  for (const { foodId, quantity } of items) {
    const key = String(foodId);
    totals.set(key, (totals.get(key) ?? 0) + Number(quantity));
  }
  return [...totals].map(([foodId, quantity]) => ({ foodId, quantity }));
}

// Prices come only from MongoDB. Any price the client sends is ignored.
export async function buildOrderPricing(rawItems) {
  const items = mergeItems(rawItems);

  if (items.some((item) => item.quantity > MAX_QUANTITY)) {
    throw new ApiError(422, `The maximum quantity for one dish is ${MAX_QUANTITY}`);
  }

  const foods = await Food.find({ _id: { $in: items.map((item) => item.foodId) } }).lean();
  const foodById = new Map(foods.map((food) => [String(food._id), food]));

  const unavailable = items.filter((item) => {
    const food = foodById.get(item.foodId);
    return !food || !food.isAvailable;
  });

  if (unavailable.length > 0) {
    throw new ApiError(
      409,
      'Some items are no longer available. Please review your cart.',
      unavailable.map((item) => ({ foodId: item.foodId, message: 'Item is unavailable' }))
    );
  }

  const lines = items.map(({ foodId, quantity }) => {
    const food = foodById.get(foodId);
    const unitPrice = round2(food.price);
    return {
      food: food._id,
      name: food.name,
      unitPrice,
      quantity,
      lineTotal: round2(unitPrice * quantity),
    };
  });

  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = round2(subtotal + deliveryFee);

  return { lines, subtotal, deliveryFee, total };
}

export async function createOrder(payload) {
  const { lines, subtotal, deliveryFee, total } = await buildOrderPricing(payload.items);
  const trackingToken = crypto.randomBytes(32).toString('hex');

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customerName: payload.customer.fullName,
    email: payload.customer.email,
    phone: payload.customer.phone,
    deliveryAddress: payload.deliveryAddress,
    deliveryInstructions: payload.deliveryInstructions ?? '',
    paymentMethod: 'cash_on_delivery',
    items: lines,
    subtotal,
    deliveryFee,
    total,
    trackingTokenHash: hashToken(trackingToken),
  });

  return { order, trackingToken };
}

// Returns the same 404 for a missing order and a wrong token, so IDs cannot be probed.
export async function getOrderByToken(orderId, trackingToken) {
  const order = await Order.findOne({
    _id: orderId,
    trackingTokenHash: hashToken(trackingToken),
  }).lean();

  if (!order) throw new ApiError(404, 'Order not found');
  return order;
}

const STATUS_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export async function updateOrderStatus(orderId, nextStatus) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const allowed = STATUS_TRANSITIONS[order.status];
  if (!allowed.includes(nextStatus)) {
    throw new ApiError(409, `Cannot change status from ${order.status} to ${nextStatus}`);
  }

  order.status = nextStatus;
  await order.save();
  return order;
}

// Shapes the order for the frontend. Internal fields, such as the token hash, never leave the server.
export function toOrderResponse(order) {
  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    customerName: order.customerName,
    deliveryAddress: order.deliveryAddress,
    deliveryInstructions: order.deliveryInstructions,
    items: order.items.map((item) => ({
      foodId: item.food,
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    totalAmount: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}