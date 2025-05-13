import { faker } from "@faker-js/faker";
import {
  Condition,
  Groups,
  PrismaClient,
  RentalDuration,
} from "@prisma/client";

export const prisma = new PrismaClient();

const staticImages: Record<Groups, string[]> = {
  ELECTRONICS: [
    "https://images.unsplash.com/photo-1580910051071-cb8c51d41a1c",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  ],
  FASHION: [
    "https://images.unsplash.com/photo-1555529669-e69c5b6b012d",
    "https://images.unsplash.com/photo-1521334884684-d80222895322",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  ],
  BOOKS: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    "https://images.unsplash.com/photo-1473755504818-b72b6dfdc226",
  ],
  TOOLS: [
    "https://images.unsplash.com/photo-1579981135025-8a4be8f7ab2f",
    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a",
    "https://images.unsplash.com/photo-1581091870622-6c61c2143ed0",
  ],
  BEAUTY: [
    "https://images.unsplash.com/photo-1588776814546-44d9e217629b",
    "https://images.unsplash.com/photo-1606312619344-c98c1b4432df",
    "https://images.unsplash.com/photo-1612802030420-0067c77edb31",
  ],
  HOME: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    "https://images.unsplash.com/photo-1598300052761-1a6a5d3a514b",
  ],
  FURNITURE: [
    "https://images.unsplash.com/photo-1598300052761-1a6a5d3a514b",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1616627982334-b8cda5f7b738",
  ],
  BABY: [
    "https://images.unsplash.com/photo-1600063992780-5996b18a440c",
    "https://images.unsplash.com/photo-1601933471734-82d7093edc6f",
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
  ],
  CLOTHING: [
    "https://images.unsplash.com/photo-1562157873-818bc0726f68",
    "https://images.unsplash.com/photo-1618354691319-5f86e3cbf1c2",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb",
  ],
  SPORTS: [
    "https://images.unsplash.com/photo-1589758438368-0c1e58b4fa12",
    "https://images.unsplash.com/photo-1615312426405-aca7ce6b9cb1",
    "https://images.unsplash.com/photo-1571019613578-2b909cfdc3d1",
  ],
  OFFICE: [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    "https://images.unsplash.com/photo-1593642532400-2682810df593",
  ],
  TOYS: [
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
    "https://images.unsplash.com/photo-1582578637042-cde5881d804c",
    "https://images.unsplash.com/photo-1616618307790-6b203d74362f",
  ],
};

async function main() {
  // await prisma.message.deleteMany();
  // await prisma.reviewOnListing.deleteMany();
  // await prisma.media.deleteMany();
  // await prisma.listing.deleteMany();
  // await prisma.user.deleteMany();

  const allUsers = [];
  const allListings = [];

  const groups: Groups[] = [
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
  const rentCats = await prisma.category.findMany({ where: { type: "Rent" } });
  const purchaseCats = await prisma.category.findMany({
    where: { type: "Purchase" },
  });
  const conditions: Condition[] = ["BAD", "ADEQUATE", "GOOD", "GREAT", "NEW"];
  const durations: RentalDuration[] = ["HOUR", "DAY", "WEEK", "MONTH", "YEAR"];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profilePic: faker.image.avatar(),
        banner: "https://source.unsplash.com/1200x400/?abstract&sig=" + i,
      },
    });
    allUsers.push(user);

    for (let j = 0; j < 2; j++) {
      const group = faker.helpers.arrayElement(groups);
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

          rentalDuration: faker.helpers.arrayElement(durations),
          condition: faker.helpers.arrayElement(conditions),
          salePrice: parseFloat(faker.commerce.price()),
          rentalPrice: parseFloat(faker.commerce.price()),
          available: true,
          userId: user.id,
          categoryId: category.id,
        },
      });

      allListings.push(listing);

      const fallbackImages = staticImages[group] || [
        "/images/fallback.jpg",
        "/images/fallback.jpg",
        "/images/fallback.jpg",
      ];

      await prisma.media.createMany({
        data: fallbackImages.map((url) => ({
          url,
          type: "IMAGE",
          listingId: listing.id,
        })),
      });

      const filteredUsers = allUsers.filter((u) => u.id !== user.id);
      const reviewer = filteredUsers.length
        ? faker.helpers.arrayElement(filteredUsers)
        : allUsers[0];

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

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => console.error("Seed error:", e))
  .finally(() => prisma.$disconnect());
