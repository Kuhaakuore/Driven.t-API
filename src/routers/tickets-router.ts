import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsTypes, getTickets, createTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas/tickets-schemas';

const tickestRouter = Router();

tickestRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTickets)
  .post('/', validateBody(createTicketSchema), createTicket);

export { tickestRouter };
