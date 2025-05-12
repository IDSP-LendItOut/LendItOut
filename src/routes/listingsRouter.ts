import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const listings = await prisma.listing.findMany({
    take: 50,
    include: {
      user: true,
      media: true,
      reviews: { include: { reviewer: true } },
      category: true,
    },
  });
  res.render("listings/index", { title: "All Listings", listings });
});

router.get("/:id", async (req, res) => {
  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(req.params.id, 10) },
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
