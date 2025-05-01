import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllListings = async () => {
  return await prisma.listing.findMany({
    where: { available: true },
    include: { media: true, reviews: true },
  });
};
