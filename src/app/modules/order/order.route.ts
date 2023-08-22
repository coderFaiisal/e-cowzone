import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post('/', validateRequest(OrderValidation.createOrderZodSchema));
router.get('/');

export const OrderRoutes = router;
