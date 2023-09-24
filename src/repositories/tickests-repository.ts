import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<Array<TicketType>> {
  return prisma.ticketType.findMany();
}

async function getTickets(enrollmentId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentId },
    include: { TicketType: true },
  });
}

export const ticketsRepository = {
  getTicketsTypes,
  getTickets,
};
