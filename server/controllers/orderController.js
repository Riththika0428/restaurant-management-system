import ApiError from '../utils/ApiError.js';
import {
  createOrder,
  getOrderByToken,
  toOrderResponse,
  updateOrderStatus,
} from '../services/orderService.js';

const TOKEN_PATTERN = /^[a-f0-9]{64}$/;

export async function placeOrder(req, res) {
  const { order, trackingToken } = await createOrder(req.body);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: toOrderResponse(order),
    trackingToken,
  });
}

export async function getOrder(req, res) {
  const token = req.get('X-Order-Token') || '';
  if (!TOKEN_PATTERN.test(token)) {
    throw new ApiError(401, 'A valid order access token is required');
  }

  const order = await getOrderByToken(req.params.id, token);

  res.json({
    success: true,
    message: 'Order fetched successfully',
    data: toOrderResponse(order),
  });
}

export async function updateStatus(req, res) {
  const order = await updateOrderStatus(req.params.id, req.body.status);

  res.json({
    success: true,
    message: 'Order status updated',
    data: toOrderResponse(order),
  });
}