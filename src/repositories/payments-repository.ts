import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import {} from '@prisma/client/runtime';
import { CreatePaymentData } from '@/protocols';

async function getTicketPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createTicketPayment(data: CreatePaymentData) {
  return prisma.payment.create({
    data,
  });
}

export const paymentsRepository = {
  getTicketPayment,
  createTicketPayment
};
