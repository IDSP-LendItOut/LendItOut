import { faker } from "@faker-js/faker";
import {
  Category,
  Condition,
  PrismaClient,
  RentalDuration,
} from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  const allUsers = [];
  const allListings = [];

  const categories: Category[] = [
    "ELECTRONICS",
    "FASHION",
    "HOME",
    "FURNITURE",
    "BOOKS",
    "BABY",
    "CLOTHING",
    "OFFICE",
    "SPORTS",
    "TOOLS",
    "TOYS",
    "BEAUTY",
  ];

  const conditions: Condition[] = ["BAD", "ADEQUATE", "GOOD", "GREAT", "NEW"];
  const durations: RentalDuration[] = ["HOUR", "DAY", "WEEK", "MONTH", "YEAR"];

  // Create 15 users, 2 listings each
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
    allUsers.push(user);

    for (let j = 0; j < 2; j++) {
      const listing = await prisma.listing.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          type: j % 2 === 0 ? "RENT" : "PURCHASE",
          category: faker.helpers.arrayElement(categories),
          rentalDuration: faker.helpers.arrayElement(durations),
          condition: faker.helpers.arrayElement(conditions),
          salePrice: parseFloat(faker.commerce.price()),
          rentalPrice: parseFloat(faker.commerce.price()),
          available: true,
          userId: user.id,
        },
      });

      allListings.push(listing);

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

  // Create conversations and messages
  for (let i = 0; i < 10; i++) {
    const listing = faker.helpers.arrayElement(allListings);
    const seller = allUsers.find((u) => u.id === listing.userId)!;
    let buyer = faker.helpers.arrayElement(allUsers);

    while (buyer.id === seller.id) {
      buyer = faker.helpers.arrayElement(allUsers);
    }

    try {
      const conversation = await prisma.conversation.create({
        data: {
          listingId: listing.id,
          participants: {
            connect: [{ id: seller.id }, { id: buyer.id }],
          },
        },
      });

      const messageCount = faker.number.int({ min: 3, max: 6 });

      for (let m = 0; m < messageCount; m++) {
        const sender = m % 2 === 0 ? buyer : seller;
        await prisma.message.create({
          data: {
            text: faker.lorem.sentence(),
            senderId: sender.id,
            conversationId: conversation.id,
            createdAt: faker.date.recent({ days: 7 }),
          },
        });
      }
    } catch (err) {
      console.error("❌ Conversation creation failed:", err);
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => console.error("❌ Seed error:", e))
  .finally(() => prisma.$disconnect());
