import { notFoundError, paymentRequiredError } from '@/errors';
import { HotelRooms } from '@/protocols';
import { enrollmentRepository, hotelRepository } from '@/repositories';
import { Hotel, TicketStatus } from '@prisma/client';

async function validateUserEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.getEnrollmentWithTicket(userId);
  if (!enrollment || !enrollment.Ticket) throw notFoundError();
  if (
    !enrollment.Ticket.TicketType.includesHotel ||
    enrollment.Ticket.TicketType.isRemote ||
    enrollment.Ticket.status !== TicketStatus.PAID
  )
    throw paymentRequiredError(`This ticket wasn't paid, is remote or includes no hotels`);
}

async function getHotels(userId: number): Promise<Array<Hotel>> {
  await validateUserEnrollment(userId);
  const hotels: Array<Hotel> = await hotelRepository.getHotels();
  if (!hotels || hotels.length == 0) throw notFoundError();
  return hotels;
}

async function getHotelRooms(hotelId: number, userId: number): Promise<HotelRooms> {
  if (!hotelId || isNaN(hotelId)) throw notFoundError();
  await validateUserEnrollment(userId);
  const hotelRooms = await hotelRepository.getHotelRooms(hotelId);
  if (!hotelRooms) throw notFoundError();
  return hotelRooms;
}

export const hotelsService = {
  getHotels,
  getHotelRooms,
};
