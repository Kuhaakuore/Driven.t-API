import { bookingsService } from '@/services';
import { bookingsRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';
import { buildBookingReturn, buildBooking } from '../factories/booking-factory';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Booking Service', () => {
  describe('validateUserBookingCreation', () => {
    it('should throw an error if user is not enrolled', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message: 'Users that are not enrolled cannot book rooms',
      });
    });

    it('should throw an error if user does not have a ticket', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message: 'Users that do not have a ticket cannot book rooms',
      });
    });

    it('should throw an error if ticket is not paid', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return { status: 'RESERVED' };
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message:
          'Users with tickets that have not being paid, are remote or do not include accommodations cannot book rooms',
      });
    });

    it('should throw an error if ticket is remote', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return { status: 'PAID', TicketType: { isRemote: true } };
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message:
          'Users with tickets that have not being paid, are remote or do not include accommodations cannot book rooms',
      });
    });

    it('should throw an error if ticket does not include accommodations', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return { status: 'PAID', TicketType: { isRemote: false, includesHotel: false } };
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message:
          'Users with tickets that have not being paid, are remote or do not include accommodations cannot book rooms',
      });
    });

    it('should throw an error if room is not found', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return { status: 'PAID', TicketType: { isRemote: false, includesHotel: true } };
      });
      jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should throw an error if room is full', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return { status: 'PAID', TicketType: { isRemote: false, includesHotel: true } };
      });
      jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
        return { capacity: 1 };
      });
      jest.spyOn(bookingsRepository, 'getRoomBookingsAmount').mockImplementationOnce((): any => {
        return 1;
      });

      const promise = bookingsService.validateUserBookingCreation(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message: `Room's maximum capacity reached cannot create new bookings for this room`,
      });
    });
  });

  describe('validateUserBookingUpdate', () => {
    it('should throw an error if user has not booked a room', async () => {
      jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingsService.validateUserBookingUpdate(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message: `Users that haven't booked a room cannot change their booking`,
      });
    });

    it('should throw an error if room is not found', async () => {
      jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingsService.validateUserBookingUpdate(1, 1);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    // it('should throw an error if room has not being booked yet', async () => {
    //   jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
    //     return { id: 1 };
    //   });
    //   jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
    //     return { capacity: 1 };
    //   });
    //   jest.spyOn(bookingsRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
    //     return undefined;
    //   });

    //   const promise = bookingsService.validateUserBookingUpdate(1, 1);
    //   expect(promise).rejects.toEqual({
    //     name: 'CannotBookRoom',
    //     message: `Room has not being booked yet`,
    //   });
    // });

    it('should throw an error if room is full', async () => {
      jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
        return { capacity: 1 };
      });
      jest.spyOn(bookingsRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(bookingsRepository, 'getRoomBookingsAmount').mockImplementationOnce((): any => {
        return 1;
      });

      const promise = bookingsService.validateUserBookingUpdate(1, 1);
      expect(promise).rejects.toEqual({
        name: 'CannotBookRoom',
        message: `Room's maximum capacity reached cannot change your booking for this room`,
      });
    });
  });

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

  describe('createBooking', () => {
    it('should create a booking', async () => {
      const mockBooking = buildBooking();
      jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(mockBooking);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return { status: 'PAID', TicketType: { isRemote: false, includesHotel: true } };
      });
      jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
        return { capacity: 1 };
      });
      jest.spyOn(bookingsRepository, 'getRoomBookingsAmount').mockImplementationOnce((): any => {
        return 0;
      });

      const booking = await bookingsService.createBooking({ roomId: 1 }, 1);

      expect(booking).toMatchObject({
        bookingId: expect.any(Number),
      });
    });

    describe('updateBooking', () => {
      it('should update a booking', async () => {
        const mockBooking = buildBooking();
        jest.spyOn(bookingsRepository, 'updateBooking').mockResolvedValueOnce(mockBooking);
        jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
          return { id: 1 };
        });
        jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
          return { capacity: 1 };
        });
        jest.spyOn(bookingsRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
          return { id: 1 };
        });
        jest.spyOn(bookingsRepository, 'getRoomBookingsAmount').mockImplementationOnce((): any => {
          return 0;
        });

        const booking = await bookingsService.updateBooking({ roomId: 1 }, 1, 1);

        expect(booking).toMatchObject({
          bookingId: expect.any(Number),
        });
      });
    });
  });

  describe('updateBooking', () => {
    it('should update a booking', async () => {
      const mockBooking = buildBooking();
      jest.spyOn(bookingsRepository, 'updateBooking').mockResolvedValueOnce(mockBooking);
      jest.spyOn(bookingsRepository, 'getBooking').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
        return { capacity: 1 };
      });
      jest.spyOn(bookingsRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return { id: 1 };
      });
      jest.spyOn(bookingsRepository, 'getRoomBookingsAmount').mockImplementationOnce((): any => {
        return 0;
      });

      const booking = await bookingsService.updateBooking({ roomId: 1 }, 1, 1);

      expect(booking).toMatchObject({
        bookingId: expect.any(Number),
      });
    });
  });
});
