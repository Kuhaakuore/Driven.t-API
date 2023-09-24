import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsTypes, getTickets } from '@/controllers';

const tickestRouter = Router();

tickestRouter.
    all('/*', authenticateToken).
    get('/types', getTicketsTypes).
    get('/', getTickets);

export { tickestRouter };
