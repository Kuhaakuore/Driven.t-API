import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  generateCreditCardData,
  createTicketTypeWithParams,
  createHotel,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const res = await server.get('/hotels');

    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if no ticket exists for the user id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if no enrollment exists for the user id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if no hotels exists', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

      await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

      const res = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket exists for the user id but it is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(true, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket exists for the user id but it doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket exists for the user id but its not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and all the hotels if ticket and enrollment exists for the user id and it its PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const paymentBody = { ticketId: ticket.id, cardData: generateCreditCardData() };

      await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(paymentBody);
      const hotel1 = await createHotel(false);
      const hotel2 = await createHotel(false);
      const hotels: any = [hotel1, hotel2];

      hotels.forEach(async (hotel: any) => {
        hotel.createdAt = hotel.createdAt.toISOString();
        hotel.updatedAt = hotel.updatedAt.toISOString();
      });

      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      const { body } = res;
      expect(body).toHaveLength(2);
      expect(res.status).toEqual(httpStatus.OK);
      expect(body).toEqual(hotels);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const res = await server.get('/hotels');

    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if the hotel of given id doesnt exits', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

      await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

      const res = await server.get(`/hotels/938475`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if no enrollment exists for the user id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if no ticket exists for the user id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if the given id is invalid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

      await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
      const res = await server.get(`/hotels/test`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket exists for the user id but it is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(true, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket exists for the user id but it doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket exists for the user id but its not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and the hotel of given id (including rooms of that hotel) if ticket and enrollment exists for the user id and it its PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithParams(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

      await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);
      const hotel = await createHotel(true);

      const expectedHotel: any = hotel;
      expectedHotel.createdAt = expectedHotel.createdAt.toISOString();
      expectedHotel.updatedAt = expectedHotel.updatedAt.toISOString();
      expectedHotel.Rooms[0].createdAt = expectedHotel.Rooms[0].createdAt.toISOString();
      expectedHotel.Rooms[0].updatedAt = expectedHotel.Rooms[0].updatedAt.toISOString();

      const res = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(httpStatus.OK);
      expect(res.body).toEqual(expectedHotel);
    });
  });
});
