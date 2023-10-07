import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import {
  createUser,
  createHotel,
  createRoomWithHotelId,
  createBooking,
  createEnrollmentWithAddress,
  createTicketType,
  createTicket,
  createPayment,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and the booking information', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      const { status, body } = res;
      expect(status).toEqual(httpStatus.OK);
      expect(body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: hotel.id,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });

    it('should respond with status 404 when user has no rooms booked', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      const { status } = res;
      expect(status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and the created booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const res = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      const { status, body, text } = res;
      expect(status).toEqual(httpStatus.OK);
      expect(body).toMatchObject({
        bookingId: expect.any(Number),
      });
    });

    it('should respond with status 403 when user is not enrolled', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const res = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      const { status, text } = res;
      expect(status).toEqual(httpStatus.FORBIDDEN);
      expect(text).toEqual('Users that are not enrolled cannot book rooms');
    });

    it('should respond with status 403 when user do not have a ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const res = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      const { status, text } = res;
      expect(status).toEqual(httpStatus.FORBIDDEN);
      expect(text).toEqual('Users that do not have a ticket cannot book rooms');
    });

    it('should respond with status 403 when user ticket has not being paid yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const res = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      const { status, text } = res;
      expect(status).toEqual(httpStatus.FORBIDDEN);
      expect(text).toEqual('Users with tickets that have not being paid, are remote or do not include accommodations cannot book rooms');
    });

    it('should respond with status 404 when the room to be booked do not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const res = await server.post('/booking').set('Authorization', `Bearer ${token}`);
      const { status } = res;
      expect(status).toEqual(httpStatus.NOT_FOUND);
    });

    it(`should respond with status 403 when the room already reached it's maximum booking capacity`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      for (let i = 0; i < room.capacity; i++) {
        const user = await createUser();
        await createBooking(user.id, room.id);
      }

      const res = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      const { status, text } = res;
      expect(status).toEqual(httpStatus.FORBIDDEN);
      expect(text).toEqual(`Room's maximum capacity reached cannot create new bookings for this room`);
    });
  });
});
