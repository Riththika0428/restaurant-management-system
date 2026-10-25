import { Router } from 'express';
import { getFoodById, listFoods } from '../controllers/foodController.js';
import { foodIdValidator, listFoodsValidator } from '../validators/foodValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', listFoodsValidator, validateRequest, listFoods);
router.get('/:id', foodIdValidator, validateRequest, getFoodById);

export default router;