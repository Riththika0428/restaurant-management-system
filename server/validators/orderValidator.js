import { body, param } from 'express-validator';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

export const createOrderValidator = [
  body('customer.fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be 2 to 100 characters'),
  body('customer.email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Enter a valid email address')
    .isLength({ max: 254 }),
  body('customer.phone')
    .trim()
    .matches(/^\+?[\d\s-]{7,15}$/)
    .withMessage('Enter a valid phone number'),
  body('deliveryAddress')
    .trim()
    .isLength({ min: 8, max: 300 })
    .withMessage('Please enter a complete delivery address'),
  body('deliveryInstructions')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Delivery instructions must be under 200 characters'),
  body('paymentMethod')
    .equals('cash_on_delivery')
    .withMessage('Only cash on delivery is currently available'),
  body('items')
    .isArray({ min: 1, max: 30 })
    .withMessage('Add at least one item to your order'),
  body('items.*.foodId').isMongoId().withMessage('Invalid food ID in cart'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Quantity must be between 1 and 20')
    .toInt(),
];

export const orderIdValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

export const updateStatusValidator = [
  body('status').isIn(ORDER_STATUSES).withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
];