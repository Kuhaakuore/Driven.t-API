import { userEnrollmentNotFoundError, ticketNotFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { Ticket, TicketType } from '@prisma/client';

async function getTicketsTypes(): Promise<Array<TicketType>> {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

async function getTickets(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw userEnrollmentNotFoundError()

  const enrollmentId = enrollment.id;

  const result = await ticketsRepository.getTickets(enrollmentId);

  if (!result) throw ticketNotFoundError();

  return result;
}

export const ticketsService = {
  getTicketsTypes,
  getTickets,
};
