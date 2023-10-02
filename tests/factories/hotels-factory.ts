import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel(includeRooms: boolean) {
  return prisma.hotel.create({
    data: {
      image: faker.image.imageUrl(),
      name: faker.name.findName(),
      Rooms: {
        create: {
          capacity: faker.datatype.number(),
          name: faker.name.findName(),
        },
      },
    },
    include: {
      Rooms: includeRooms,
    },
  });
}
