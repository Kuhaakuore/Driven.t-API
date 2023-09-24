import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const ticketsTypes = await ticketsService.getTicketsTypes();

  return res.status(httpStatus.OK).send(ticketsTypes);
}
