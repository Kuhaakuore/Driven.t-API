import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketPayment, getTicketPayment } from '@/controllers';
import { ticketPaymentSchema } from '@/schemas/payment-schemas';

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getTicketPayment)
    .post('/process', validateBody(ticketPaymentSchema), createTicketPayment);

export { paymentsRouter };
