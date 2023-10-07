import { Booking, Room, TicketStatus } from '.prisma/client';
import { cannotBookRoom, notFoundError } from '@/errors';
import { InputBookingBody } from '@/protocols';
import { bookingsRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookRoom('Users that are not enrolled cannot book rooms');

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw cannotBookRoom('Users that do not have a ticket cannot book rooms');

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw cannotBookRoom(
      'Users with tickets that have not being paid, are remote or do not include accommodations cannot book rooms',
    );
  }
}

async function getBooking(userId: number): Promise<{ id: number; Room: Room }> {
  const bookings = await bookingsRepository.getBooking(userId);
  if (!bookings) throw notFoundError();
  return bookings;
}

async function createBooking(body: InputBookingBody, userId: number) {
  await validateUserBooking(userId);
  const { roomId } = body;
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const roomBookingsAmount = await bookingsRepository.getRoomBookingsAmount(roomId);
  if (room.capacity <= roomBookingsAmount)
    throw cannotBookRoom(`Room's maximum capacity reached cannot create new bookings for this room`);

  const booking: Booking = await bookingsRepository.createBooking(userId, roomId);
  return { bookingId: booking.id };
}

async function updateBooking() {}

export const bookingsService = {
  getBooking,
  createBooking,
  updateBooking,
};
