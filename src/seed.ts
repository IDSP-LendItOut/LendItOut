import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profilePic: faker.image.avatar(),
        banner: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
      },
    });

    for (let j = 0; j < 2; j++) {
      const listing = await prisma.listing.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          type: j % 2 === 0 ? "RENT" : "PURCHASE",
          price: parseFloat(faker.commerce.price()),
          available: true,
          userId: user.id,
        },
      });
      const mediaData = [
        ...Array.from({ length: 3 }, () => ({
          url: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
          type: "IMAGE" as const,
          listingId: listing.id,
        })),
        {
          url: faker.internet.url(),
          type: "VIDEO" as const,
          listingId: listing.id,
        },
      ];

      await prisma.media.createMany({ data: mediaData });

      await prisma.reviewOnListing.create({
        data: {
          reviewerId: user.id,
          listingId: listing.id,
          rating: faker.number.int({ min: 2, max: 10 }),
          comment: faker.lorem.sentence(),
        },
      });
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
