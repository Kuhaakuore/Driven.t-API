import { bookingsService } from '@/services';
import { cannotBookRoom, notFoundError } from '@/errors';
import { InputBookingBody, ReturnBookingBody } from '@/protocols';
import { bookingsRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';
import { buildBookingReturn, buildBooking } from '../factories/booking-factory';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Booking Service', () => {
  describe('getBooking', () => {
    it('should return a booking', async () => {
      const mockBooking = buildBookingReturn();
      jest.spyOn(bookingsRepository, 'getBooking').mockResolvedValueOnce(mockBooking);

      const booking = await bookingsService.getBooking(1);

      expect(booking).toMatchObject({
        id: expect.any(Number),
        Room: expect.any(Object),
      });
    });

    it('should throw an error if booking is not found', async () => {
      jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingsService.getBooking(1);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });

  //   describe('createBooking', () => {
  //     it('should create a booking', async () => {
  //       const mockBooking = buildBooking();
  //       const inputBookingBody: InputBookingBody = {
  //         roomId: 1,
  //       };
  //       jest.spyOn(bookingsRepository, 'createBooking').mockImplementationOnce(async () => mockBooking);

  //       const booking = await bookingsService.createBooking(inputBookingBody, 1);

  //       expect(body).toMatchObject({
  //         bookingId: expect.any(Number),
  //       });
  //     });
  //   });
});
