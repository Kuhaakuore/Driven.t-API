import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';
import { Ticket, TicketType } from '@prisma/client';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const ticketsTypes: Array<TicketType> = await ticketsService.getTicketsTypes();

  return res.status(httpStatus.OK).send(ticketsTypes);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticket: Ticket = await ticketsService.getTickets(userId);

  return res.status(httpStatus.OK).send(ticket);
}
