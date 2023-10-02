import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Array<Hotel>> {
  return await prisma.hotel.findMany();
}

export const hotelRepository = {
  getHotels,
};
