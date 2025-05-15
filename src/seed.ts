import { faker } from "@faker-js/faker";
import {
  Condition,
  Groups,
  PrismaClient,
  RentalDuration,
} from "@prisma/client";

const prisma = new PrismaClient();

const fallbackImages: Record<string, string[]> = {
  ELECTRONICS: [
    "/images/fallbacks/cleaner.jpg",
    "/images/fallbacks/electronic.jpg",
    "/images/fallbacks/electronic2.jpg",
    "/images/fallbacks/electronic3.jpg",
    "/images/fallbacks/electronic4.jpg",
  ],
  FASHION: [
    "/images/fallbacks/cloth.jpg",
    "/images/fallbacks/fashion2.jpg",
    "/images/fallbacks/fashion3.jpg",
    "/images/fallbacks/fashion4.jpg",
  ],
  HOME: [
    "/images/fallbacks/home.jpg",
    "/images/fallbacks/home2.jpeg",
    "/images/fallbacks/home3.jpeg",
    "/images/fallbacks/home4.jpg",
  ],
  BEAUTY: [
    "/images/fallbacks/beauty1.jpg",
    "/images/fallbacks/beauty2.jpg",
    "/images/fallbacks/beauty3.jpg",
    "/images/fallbacks/beauty4.jpg",
  ],
  DEFAULT: [
    "/images/fallbacks/lambo.jpg",
    "/images/fallbacks/lambo2.jpg",
    "/images/fallbacks/lambo3.jpg",
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

  const allUsers = [];

  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profilePic: faker.image.avatar(),
        banner: `https://source.unsplash.com/1200x400/?abstract&sig=${i}`,
      },
    });
    allUsers.push(user);

    for (let j = 0; j < 2; j++) {
      const group = faker.helpers.arrayElement(groups);
      const categoryArray = j % 2 === 0 ? rentCats : purchaseCats;
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
          group: group, 
        },
      });

      const images = fallbackImages[group] || fallbackImages.DEFAULT;
      const imageToUse = images[(i * 2 + j) % images.length];


      // await prisma.media.createMany({
      //   data: fallbackImages.map((url) => ({
      //     url,
      //     type: "IMAGE",
      //     listingId: listing.id,
      //   })),
      // });

      const filtered = allUsers.filter((u) => u.id !== user.id);
      const reviewer = filtered.length ? faker.helpers.arrayElement(filtered) : user;


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
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
