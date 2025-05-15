import {
  Condition,
  ListingType,
  PrismaClient,
  RentalDuration,
} from "@prisma/client";
import { ObjectId } from "bson";
import express from "express";
import upload from "../middleware/multerConfig";
import { requireLogin } from "../middleware/requireLogin";
const prisma = new PrismaClient();

const postingRouter = express.Router();

postingRouter.get("/create", requireLogin, async (req, res) => {
  const currentStep = parseInt((req.query.step as string) || "1");
  const googleMapAPI = process.env.GOOGLE_MAP;
  console.log("*");
  console.log(currentStep);

  const categories = await prisma.category.findMany();
  try {
    res.render("posting/posting_layout", {
      title: "Create post",
      currentStep,
      categories: categories,
      listingType: req.session.listingData?.type || [],
      error: null,
      api: googleMapAPI,
      posting: req.session.listingData,
      images: req.session.listingData?.images || [],
      city: req.session.listingData?.city,
    });
  } catch (err) {
    console.error("Error loading categories:", err);
    res.status(500).render("posting/posting_layout", {
      title: "Create post",
      currentStep,
      categories: categories,
      error: "Failed to load categories. Please try again later.",
      api: googleMapAPI,
      posting: req.session.listingData,
      images: req.session.listingData?.images || [],
      city: req.session.listingData?.city,
    });
  }
});

postingRouter.post(
  "/create/step/:step",
  requireLogin,
  upload.array("images", 8),
  async (req, res) => {
    const step = parseInt(req.params.step);
    const googleMapAPI = process.env.GOOGLE_MAP;
    const categories = await prisma.category.findMany();

    try {
      if (!req.session.listingData) {
        req.session.listingData = {};
      }

      if (step === 1) {
        const { type, category } = req.body;
        if (!type || !category) {
          return res.render("posting/posting_layout", {
            title: "Create post",
            currentStep: 1,
            categories: categories,
            error: "Please select a listing type and category.",
            api: googleMapAPI,
            posting: req.session.listingData,
            images: req.session.listingData?.images || [],
          });
        }
        req.session.listingData.type = type;
        req.session.listingData.category = category;
      }

      if (step === 2) {
        const {
          title,
          description,
          salePrice,
          rentalPrice,
          rentalDuration,
          condition,
        } = req.body;
        if (!title || !description) {
          return res.render("posting/posting_layout", {
            title: "Create post",
            currentStep: 2,
            error: "Title and description are required.",
            api: googleMapAPI,
            posting: req.session.listingData,
            categories: categories,
          });
        }

        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
          req.session.listingData.images = (
            req.files as Express.Multer.File[]
          ).map((file) => file.filename);
        }

        req.session.listingData.title = title;
        req.session.listingData.description = description;
        req.session.listingData.salePrice = parseFloat(salePrice) || 0;
        req.session.listingData.rentalPrice = parseFloat(rentalPrice) || 0;
        req.session.listingData.rentalDuration = rentalDuration;
        req.session.listingData.condition = condition;
      }

      if (step === 3) {
        const { showInOtherAreas, delivery, payment, promote, city } = req.body;

        req.session.listingData.showInOtherAreas = showInOtherAreas;
        req.session.listingData.promote = promote;
        req.session.listingData.city = city;
        req.session.listingData.delivery =
          typeof delivery === "string" ? [delivery] : delivery;
        req.session.listingData.payment =
          typeof payment === "string" ? [payment] : payment;
      }

      if (step === 4) {
        if (!req.session.userId) {
          res.status(401).json({ message: "Need to login first!" });
          return;
        }
        const userId = req.session.userId;
        const userIdObjectId = new ObjectId(userId);
        const data = req.session.listingData;
        const categoryId = data.category;

        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category || !categoryId) {
          res.status(400).json({ message: "Category is not exist" });
          return;
        }

        const conditionMap: Record<number, Condition> = {
          1: "BAD",
          2: "ADEQUATE",
          3: "GOOD",
          4: "GREAT",
          5: "NEW",
        };

        const numericCondition = Number(data.condition);
        const mappedCondition = conditionMap[numericCondition];

        const createPost = await prisma.listing.create({
          data: {
            title: data.title ?? "",
            description: data.description ?? "",
            type: data.type as ListingType,
            salePrice: data.salePrice ?? 0,
            rentalPrice: data.rentalPrice ?? 0,
            rentalDuration: data.rentalDuration as RentalDuration,
            condition: mappedCondition,
            userId: userIdObjectId.toString(),
            categoryId: categoryId,
            media: {
              create: (data.images || []).map((imageUrl: string) => ({
                url: `/uploads/${imageUrl}`,
                type: "IMAGE",
              })),
            },
          },
        });
        console.log(data.images);
        console.log("New post created:", createPost);
        res.status(200).json({
          message: "Listing created successfully!",
          data: createPost,
        });
        return;
      }

      const nextStep = step + 1;
      return res.redirect(`/posting/create?step=${nextStep}`);
    } catch (error) {
      console.error("Error in form submission:", error);
      return res.status(500).render("posting/posting_layout", {
        title: "Create post",
        currentStep: step,
        categories: categories,
        error: "An unexpected error occurred. Please try again.",
        api: googleMapAPI,
        posting: req.session.listingData,
        images: req.session.listingData?.images || [],
        city: req.session.listingData?.city,
      });
    }
  }
);

export { postingRouter };
