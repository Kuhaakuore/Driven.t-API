import { invalidTicketIdError, missingTicketIdError, unauthorizedAccessError } from '@/errors';
import { Payment, TicketType } from '@prisma/client';
import { paymentsRepository, ticketsRepository } from '@/repositories';
import { enrollmentRepository } from '@/repositories';
import { CardData, CreatePaymentData } from '@/protocols';

async function getTicketPayment(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw missingTicketIdError();

  const ticket = await ticketsRepository.getTicket(ticketId);

  if (!ticket) throw invalidTicketIdError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedAccessError();

  const payment = await paymentsRepository.getTicketPayment(ticketId);

  return payment;
}

async function createTicketPayment(ticketId: number, userId: number, cardData: CardData): Promise<Payment> {
  const ticket = await ticketsRepository.getTicket(ticketId);

  if (!ticket) throw invalidTicketIdError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedAccessError();

  const ticketType: TicketType = await ticketsRepository.getTicketType(ticket.ticketTypeId);

  const paymentData: CreatePaymentData = {
    ticketId,
    value: ticketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  await paymentsRepository.createTicketPayment(paymentData);

  await ticketsRepository.payTicket(ticketId);

  const payment = await paymentsRepository.getTicketPayment(ticketId);

  return payment;
}

export const paymentsService = {
  getTicketPayment,
  createTicketPayment,
};
