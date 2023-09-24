import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services';
import { Payment } from '@prisma/client';
import { TicketId } from '@/protocols';

export async function getTicketPayment(req: AuthenticatedRequest, res: Response) {
    const { ticketId } = req.query;
    const { userId } = req;
    const payment: Payment = await paymentsService.getTicketPayment(Number(ticketId), userId);

    return res.status(httpStatus.OK).send(payment);
}