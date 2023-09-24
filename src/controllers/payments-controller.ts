import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services';
import { Payment } from '@prisma/client';

export async function getTicketPayment(req: AuthenticatedRequest, res: Response) {
    const { ticketId } = req.query;
    const { userId } = req;
    const payment: Payment = await paymentsService.getTicketPayment(Number(ticketId), userId);

    return res.status(httpStatus.OK).send(payment);
}

export async function createTicketPayment(req: AuthenticatedRequest, res: Response) {
    const { ticketId, cardData } = req.body;
    const { userId } = req;
    const payment: Payment = await paymentsService.createTicketPayment(Number(ticketId), userId, cardData);

    return res.status(httpStatus.OK).send(payment);
}