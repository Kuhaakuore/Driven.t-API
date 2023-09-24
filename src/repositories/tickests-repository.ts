import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketData } from '@/protocols';

async function getTicketsTypes(): Promise<Array<TicketType>> {
  return prisma.ticketType.findMany();
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

export const ticketsRepository = {
  getTicketsTypes,
  getTickets,
  createTicket,
};
