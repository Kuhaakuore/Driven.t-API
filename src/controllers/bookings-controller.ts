import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const bookings = await bookingsService.getBooking(userId);
  return res.status(httpStatus.OK).send(bookings);
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {}
