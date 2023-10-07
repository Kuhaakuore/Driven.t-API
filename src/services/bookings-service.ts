import { Booking, Room } from '.prisma/client';
import { notFoundError } from '@/errors';
import { bookingsRepository } from '@/repositories';

async function getBooking(userId: number): Promise<{id: number; Room: Room}> {
  const bookings = await bookingsRepository.getBooking(userId);
  if (!bookings) throw notFoundError();
  return bookings;
}

async function createBooking() {}

async function updateBooking() {}

export const bookingsService = {
  getBooking,
  createBooking,
  updateBooking,
};
