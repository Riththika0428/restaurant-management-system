import { param, query } from 'express-validator';

const SORT_OPTIONS = ['newest', 'price-asc', 'price-desc', 'name'];

export const listFoodsValidator = [
  query('page').optional().isInt({ min: 1, max: 1000 }).withMessage('Page must be between 1 and 1000').toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50').toInt(),
  query('search').optional().isString().trim().isLength({ max: 100 }).withMessage('Search is too long'),
  query('category').optional().isString().trim().isLength({ max: 50 }).withMessage('Invalid category'),
  query('featured').optional().isBoolean().withMessage('Featured must be true or false').toBoolean(),
  query('sort').optional().isIn(SORT_OPTIONS).withMessage(`Sort must be one of: ${SORT_OPTIONS.join(', ')}`),
];

export const foodIdValidator = [
  param('id').isMongoId().withMessage('Invalid food ID'),
];