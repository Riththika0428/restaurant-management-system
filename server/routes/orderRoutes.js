import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getOrder, placeOrder, updateStatus } from '../controllers/orderController.js';
import {
  createOrderValidator,
  orderIdValidator,
  updateStatusValidator,
} from '../validators/orderValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many orders from this network. Please try again later.' },
});

router.post('/', orderLimiter, createOrderValidator, validateRequest, placeOrder);
router.get('/:id', orderIdValidator, validateRequest, getOrder);
router.patch('/:id/status', requireAdmin, orderIdValidator, updateStatusValidator, validateRequest, updateStatus);

export default router;