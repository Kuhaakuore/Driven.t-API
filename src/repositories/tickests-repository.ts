import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketData } from '@/protocols';

async function getTicketsTypes(): Promise<Array<TicketType>> {
  return prisma.ticketType.findMany();
}

async function getTicketType(ticketTypeId: number): Promise<TicketType> {
  return prisma.ticketType.findFirst({
    where: { id: ticketTypeId },
  });
}

async function getTickets(enrollmentId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

async function createTicket(data: CreateTicketData) {
  return prisma.ticket.create({
    data,
  });
}

async function getTicket(ticketId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
  });
}

async function payTicket(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: TicketStatus.PAID },
  });
}

export const ticketsRepository = {
  getTicketsTypes,
  getTickets,
  createTicket,
  getTicket,
  getTicketType,
  payTicket,
};
