import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';
import { TicketType } from '@prisma/client';
import { TicketTypeId } from '@/protocols';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const ticketsTypes: Array<TicketType> = await ticketsService.getTicketsTypes();

  return res.status(httpStatus.OK).send(ticketsTypes);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticket = await ticketsService.getTickets(userId);

  return res.status(httpStatus.OK).send(ticket);
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as TicketTypeId;
  const { userId } = req;
  const ticket = await ticketsService.createTicket(ticketTypeId, userId);
  
  return res.status(httpStatus.CREATED).send(ticket);
}
