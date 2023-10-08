import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function getRoomBookingsAmount(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function getBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

async function updateBooking(roomId: number, userId: number) {
  return prisma.booking.update({
    where: {
      userId,
    },
    data: {
      roomId,
    },
  });
}

export const bookingsRepository = {
  getBooking,
  getRoomBookingsAmount,
  createBooking,
  getBookingByRoomId,
  updateBooking,
};
