import { Router } from 'express';
import { initiatePayment, checkPaymentStatus } from '../controllers/paymentController';

const router = Router();

router.post('/', initiatePayment);
router.get('/status/:checkoutRequestId', checkPaymentStatus);

export default router; 