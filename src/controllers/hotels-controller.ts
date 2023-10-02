import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelsService.getHotels(req.userId);
  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
    const { hotelId } = req.params;
    const hotelRooms = await hotelsService.getHotelRooms(Number(hotelId));
    return res.status(httpStatus.OK).send(hotelRooms);
}