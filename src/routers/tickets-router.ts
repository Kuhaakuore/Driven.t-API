import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsTypes } from '@/controllers';

const tickestRouter = Router();

tickestRouter
  //   .all('/*', authenticateToken)
  .get('/types', getTicketsTypes);

export { tickestRouter };
