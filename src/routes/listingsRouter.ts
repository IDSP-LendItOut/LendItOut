import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
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

function getRandomFallback(group: string): string {
  const images = fallbackImages[group as keyof typeof fallbackImages] || [];
  if (images.length === 0) return "/images/fallbacks/lambo3.jpg";
  return images[Math.floor(Math.random() * images.length)];
}

router.get("/", async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        media: true,

        reviews: {
          include: {
            reviewer: { select: { name: true, profilePic: true } },
          },
        },
      },
    });
    const listingsWithFallback = listings.map((listing) => ({
      ...listing,
      fallbackImage: getRandomFallback(listing.group),
    }));
    res.render("listings/index", {
      title: "All Listings",
      listings: listingsWithFallback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load listings");
  }
});

router.get("/:id", async (req, res) => {
  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
    include: {
      media: true,
      user: true,
      reviews: {
        include: {
          reviewer: true,
        },
      },
    },
  });

  if (listing) {
    const related = await prisma.listing.findMany({
      where: {
        categoryId: listing.categoryId,
        NOT: { id: listing.id },
      },
      include: {
        media: true,
      },
      take: 6,
    });

    res.render("listings/show", {
      title: "Listing Detail",
      listing,
      related,
    });
  } else {
    res.status(404).send("Listing not found");
  }
});

export default router;
