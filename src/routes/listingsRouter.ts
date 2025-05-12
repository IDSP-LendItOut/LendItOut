import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        media: true,
        user: { select: { name: true, profilePic: true } },
        reviews: {
          include: {
            reviewer: { select: { name: true, profilePic: true } }
          }
        }
      }
    });
    res.render("listings/index", { title: "All Listings", listings });
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
