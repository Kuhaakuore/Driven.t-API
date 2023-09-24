import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketPayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getTicketPayment);

export { paymentsRouter };
