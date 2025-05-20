import { PrismaClient } from "@prisma/client";
import { ObjectId } from "bson";
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
    "images/honda.png",
  ],
  FASHION: [
    "/images/fallbacks/cloth.jpg",
    "/images/fallbacks/fashion2.jpg",
    "/images/fallbacks/fashion3.jpg",
    "/images/fallbacks/fashion4.jpg",
    "images/chain.png",
    "images/budshirt.png",
  ],
  HOME: [
    "/images/fallbacks/home.jpg",
    "/images/fallbacks/home2.jpeg",
    "/images/fallbacks/home3.jpeg",
    "/images/fallbacks/home4.jpg",
    "images/home.png",
    "images/housetent.png",
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

// GET all listings
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
      fallbackImage: getRandomFallback(listing.group || "DEFAULT"),
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

// GET single listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listingId = req.params.id;
    if (!ObjectId.isValid(listingId)) {
      res.status(400).send("Invalid listing ID");
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: true,
        user: true,
        reviews: {
          include: { reviewer: true },
        },
      },
    });

    if (!listing) {
      res.status(404).send("Listing not found");
      return;
    }

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
  } catch (error) {
    console.error("listingsRouter:", error);
    res.status(500).send("Error loading listing");
  }
});

// connect to profile - mylistings - see more btn (by sooah)

router.get("/my/:id", async (req, res) => {
  try {
    const listingId = req.params.id;
    if (!ObjectId.isValid(listingId)) {
      res.status(400).send("listingId error");
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
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
    if (!listing) {
      res.status(404).send("Listing not found");
      return;
    }

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

    const joinedYear = listing.user?.createdAt.getFullYear();
    res.render("listings/show_myListing", {
      title: "Listing Detail",
      listing,
      related,
      joinedYear,
    });
  } catch (error) {
    console.error("listingsRouter:", error);
    res.status(500).send("An listing error");
  }
});
export default router;
