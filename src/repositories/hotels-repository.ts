import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelRooms } from '@/protocols';

async function getHotels(): Promise<Array<Hotel>> {
  return await prisma.hotel.findMany();
}

async function getHotelRooms(hotelId: number): Promise<HotelRooms> {
  const hotelRooms = await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
  return hotelRooms;
}

export const hotelRepository = {
  getHotels,
  getHotelRooms,
};
