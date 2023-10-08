import { Booking, Room, TicketStatus } from '.prisma/client';
import { cannotBookRoom, notFoundError } from '@/errors';
import { InputBookingBody } from '@/protocols';
import { bookingsRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';

async function validateUserBookingCreation(userId: number, roomId: number) {
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

  const room = await hotelRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const roomBookingsAmount = await bookingsRepository.getRoomBookingsAmount(roomId);
  if (room.capacity <= roomBookingsAmount)
    throw cannotBookRoom(`Room's maximum capacity reached cannot create new bookings for this room`);
}

async function validateUserBookingUpdate(userId: number, roomId: number) {
  const userBooking = await bookingsRepository.getBooking(userId);
  if (!userBooking) throw cannotBookRoom(`Users that haven't booked a room cannot change their booking`);

  const room = await hotelRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const roomBooking = await bookingsRepository.getBookingByRoomId(roomId);
  if (!roomBooking) throw cannotBookRoom(`Room has not being booked yet`);

  const roomBookingsAmount = await bookingsRepository.getRoomBookingsAmount(roomId);
  if (room.capacity <= roomBookingsAmount)
    throw cannotBookRoom(`Room's maximum capacity reached cannot change your booking for this room`);
}

async function getBooking(userId: number): Promise<{ id: number; Room: Room }> {
  const booking = await bookingsRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function createBooking(body: InputBookingBody, userId: number) {
  const { roomId } = body;
  await validateUserBookingCreation(userId, roomId);

  const booking: Booking = await bookingsRepository.createBooking(userId, roomId);
  return { bookingId: booking.id };
}

async function updateBooking(body: InputBookingBody, userId: number) {
  const { roomId } = body;
  await validateUserBookingUpdate(userId, roomId);

  const booking: Booking = await bookingsRepository.updateBooking(roomId, userId);
  return { bookingId: booking.id };
}

export const bookingsService = {
  getBooking,
  createBooking,
  updateBooking,
};
