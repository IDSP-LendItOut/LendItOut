import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  const rentCategories = [
    "Real Estate & Property",
    "Vehicles & Transportation",
    "Equipment & Tools",
    "Furniture & Home Goods",
    "Clothing & Fashion",
    "Technology & Gadgets",
    "Leisure & Recreation",
    "Events & Parties",
    "Photography & Videography",
    "Health & Fitness",
    "Office & Business Equipment",
  ];

  const purchaseCategories = [
    "Electronics & Gadgets",
    "Fashion & Apparel",
    "Home & Furniture",
    "Beauty & Personal Care",
    "Health & Wellness",
    "Sports & Outdoors",
    "Automotive & Motorcycles",
    "Baby & Kids",
    "Groceries & Household Essentials",
    "Books, Music & Entertainment",
    "Office & School Supplies",
    "Hobbies & Collectibles",
    "Digital Products & Services",
  ];

  const allCategories = [
    ...rentCategories.map((name) => ({ name, type: "Rent" })),
    ...purchaseCategories.map((name) => ({ name, type: "Purchase" })),
  ];

  // Seed categories
  await prisma.category.createMany({
    data: allCategories,
    skipDuplicates: true,
  });

  const rentCats = await prisma.category.findMany({ where: { type: "Rent" } });
  const purchaseCats = await prisma.category.findMany({
    where: { type: "Purchase" },
  });

  if (!rentCats.length || !purchaseCats.length) {
    console.error("❌ rentCats or purchaseCats is empty!");
    process.exit(1);
  }

  const allUsers = [];
  const allListings = [];

  // Create 15 users, each with 2 listings
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
      const categoryArray = j % 2 === 0 ? rentCats : purchaseCats;
      if (!categoryArray.length) {
        console.error("❌ categoryArray is empty!");
        process.exit(1);
      }

      const category = faker.helpers.arrayElement(categoryArray);

      const listing = await prisma.listing.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          type: j % 2 === 0 ? "RENT" : "PURCHASE",
          price: parseFloat(faker.commerce.price()),
          available: true,
          userId: user.id,
          categoryId: category.id,
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

      const filteredUsers = allUsers.filter((u) => u.id !== user.id);
      const fallbackReviewer = allUsers[0]; 
      const reviewer = filteredUsers.length
        ? faker.helpers.arrayElement(filteredUsers)
        : fallbackReviewer;

      await prisma.reviewOnListing.create({
        data: {
          reviewerId: reviewer.id,
          listingId: listing.id,
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: faker.lorem.sentence(),
        },
      });
    }
  }

  // Create conversations and messages
  if (!allListings.length || !allUsers.length) {
    console.error("❌ No listings or users available for conversations!");
    process.exit(1);
  }

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
      console.error("Conversation creation failed:", err);
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => console.error("Seed error:", e))
  .finally(() => prisma.$disconnect());