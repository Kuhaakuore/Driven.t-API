import { invalidTicketIdError, missingTicketIdError, unauthorizedAccessError } from '@/errors';
import { Payment } from '@prisma/client';
import { paymentsRepository, ticketsRepository } from '@/repositories';
import { enrollmentRepository } from '@/repositories';

async function getTicketPayment(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw missingTicketIdError();

  const ticket = await ticketsRepository.getTicket(ticketId);

  if (!ticket) throw invalidTicketIdError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedAccessError();

  const payment = await paymentsRepository.getTicketPayment(ticketId);

  return payment;
}

export const paymentsService = {
  getTicketPayment,
};
