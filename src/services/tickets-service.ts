import { userEnrollmentNotFoundError, ticketNotFoundError } from '@/errors';
import { CreateTicketData } from '@/protocols';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';

async function getTicketsTypes(): Promise<Array<TicketType>> {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

async function getTickets(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw userEnrollmentNotFoundError();

  const enrollmentId = enrollment.id;

  const result = await ticketsRepository.getTickets(enrollmentId);

  if (!result) throw ticketNotFoundError();

  return result;
}

async function createTicket(ticketTypeId: number, userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw userEnrollmentNotFoundError();

  const enrollmentId = enrollment.id;

  const ticketData: CreateTicketData = {
    ticketTypeId,
    enrollmentId,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.createTicket(ticketData);

  const ticket = await getTickets(userId);

  return ticket;
}

export const ticketsService = {
  getTicketsTypes,
  getTickets,
  createTicket,
};
