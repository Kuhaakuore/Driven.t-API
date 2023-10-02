import { notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, hotelRepository } from '@/repositories';
import { Hotel, TicketStatus } from '@prisma/client';

async function getHotels(userId: number): Promise<Array<Hotel>> {
  const enrollment = await enrollmentRepository.getEnrollmentWithTicket(userId);
  if (!enrollment || !enrollment.Ticket) throw notFoundError();
  if (
    !enrollment.Ticket.TicketType.includesHotel ||
    enrollment.Ticket.TicketType.isRemote ||
    enrollment.Ticket.status !== TicketStatus.PAID
  )
    throw paymentRequiredError(`This ticket wasn't paid, is remote or includes no hotels`);
  const hotels: Array<Hotel> = await hotelRepository.getHotels();
  if (!hotels || hotels.length == 0) throw notFoundError();
  return hotels;
}

async function getHotelRooms(hotelId: number) {
  if (!hotelId || isNaN(hotelId)) throw notFoundError;
}

export const hotelsService = {
  getHotels,
  getHotelRooms,
};
