import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

export const paymentsRepository = {
  getTicketPayment,
};
