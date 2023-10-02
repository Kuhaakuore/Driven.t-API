import { Router } from 'express';
import { getHotels, getHotelRooms } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getHotels)
    .get('/hotels/:hotelId', getHotelRooms);

export { hotelsRouter };
