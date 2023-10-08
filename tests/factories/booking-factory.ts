import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Booking } from '.prisma/client';

export async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export function buildBookingReturn() {
  return {
    id: faker.datatype.number(),
    Room: {
      id: faker.datatype.number(),
      name: faker.lorem.word(),
      capacity: faker.datatype.number(),
      hotelId: faker.datatype.number(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    },
  };
}

export function buildBooking() {
  return {
    id: faker.datatype.number(),
    userId: faker.datatype.number(),
    roomId: faker.datatype.number(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}
