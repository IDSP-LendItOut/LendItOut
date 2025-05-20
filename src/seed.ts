import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const fallbackImages = {
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
  // // console.log('🧹 Clearing old data...');
  // await prisma.message.deleteMany();
  // await prisma.userConversation.deleteMany();
  // await prisma.conversation.deleteMany();x
  // await prisma.media.deleteMany();
  // await prisma.listing.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.category.deleteMany();
 
  console.log('👤 Creating fake users...');
  const users = [];
  for (let i = 0; i < 10; i++) {
    const hashed = await bcrypt.hash('test1234', 10);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashed,
      },
    });
    users.push(user);
  }

  const groupNames = [
    "ELECTRONICS", "FASHION", "HOME", "FURNITURE", "BOOKS", "BABY",
    "CLOTHING", "OFFICE", "SPORTS", "TOOLS", "TOYS", "BEAUTY"
  ];
  

  await prisma.category.createMany({
    data: groupNames.map(group => ({
      name: group.charAt(0) + group.slice(1).toLowerCase(), 
      type: "RENT",
    })),

  });
  const allCategories = await prisma.category.findMany();


  console.log('📦 Creating fake listings...');
  const listings = [];
  for (let i = 0; i < 5; i++) {
    const owner = users[Math.floor(Math.random() * users.length)];
    const category = faker.helpers.arrayElement(allCategories);
    const listing = await prisma.listing.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.sentences(2),
        type: "RENT",
        condition: "GOOD",
        rentalPrice: 25,
        rentalDuration: "DAY",
        available: true,
        userId: owner.id,
        categoryId: category.id,
        media: {
          create: [{
            url: fallbackImages.DEFAULT[i % fallbackImages.DEFAULT.length],
            type: 'IMAGE',
          }],
        },
      },
    });
    
    listings.push(listing);
  }

  console.log('💬 Creating fake conversations with messages...');
  for (let i = 0; i < 5; i++) {
    const listing = listings[i % listings.length];
    const user1 = users[i % users.length];
    let user2 = users[(i + 1) % users.length];
    if (user1.id === user2.id) user2 = users[(i + 2) % users.length];

    const conversation = await prisma.conversation.create({
      data: {
        listingId: listing.id
      }
    });

    await prisma.userConversation.createMany({
      data: [
        { userId: user1.id, conversationId: conversation.id },
        { userId: user2.id, conversationId: conversation.id }
      ]
    });

    for (let j = 0; j < faker.number.int({ min: 4, max: 7 }); j++) {
      const sender = Math.random() > 0.5 ? user1 : user2;
      await prisma.message.create({
        data: {
          text: faker.lorem.sentence(),
          senderId: sender.id,
          conversationId: conversation.id
        }
      });
    }
    const messageCount = await prisma.message.count();
console.log(`📨 Total messages created: ${messageCount}`);

  }

  console.log('✅ Seeding complete! Check your Prisma Studio or MongoDB Atlas.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
