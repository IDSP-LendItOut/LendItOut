import { Condition, Groups, ListingType, RentalDuration } from "@prisma/client";
import express from "express";
import { requireLogin } from "../middleware/requireLogin";
import { prisma } from "../seed";

const postingRouter = express.Router();

postingRouter.get("/create", requireLogin, async (req, res) => {
  const currentStep = parseInt((req.query.step as string) || "1");
  const googleMapAPI = process.env.GOOGLE_MAP;
  console.log("*");
  console.log(currentStep);

  try {
    // const categories = await prisma.category.findMany();
    // console.log(categories);
    res.render("posting/posting_layout", {
      title: "Create post",
      currentStep,
      // categories: categories,
      categories: Object.values(Groups),
      listingType: req.session.listingData?.type || [],
      error: null,
      api: googleMapAPI,
      posting: req.session.listingData,
    });
  } catch (err) {
    console.error("Error loading categories:", err);
    res.status(500).render("posting/posting_layout", {
      title: "Create post",
      currentStep,
      categories: [],
      error: "Failed to load categories. Please try again later.",
      api: googleMapAPI,
      posting: req.session.listingData,
    });
  }
});

postingRouter.post("/create/step/:step", requireLogin, async (req, res) => {
  const step = parseInt(req.params.step);
  const googleMapAPI = process.env.GOOGLE_MAP;
  try {
    if (!req.session.listingData) {
      req.session.listingData = {};
    }

    if (step === 1) {
      const { type, category } = req.body;
      if (!type) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 1,
          categories: Object.values(Groups),
          error: "Please select at least one listing type.",
          api: googleMapAPI,
          posting: req.session.listingData,
        });
      }

      if (!category) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 1,
          categories: Object.values(Groups),
          error: "Please select a category.",
          api: googleMapAPI,
          posting: req.session.listingData,
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
        });
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

      if (!delivery) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 3,
          categories: Object.values(Groups),
          error: "Please select at least one delivery option.",
          api: googleMapAPI,
          posting: req.session.listingData,
        });
      }
      if (!payment) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 3,
          categories: Object.values(Groups),
          error: "Please select at least one payment option.",
          api: googleMapAPI,
          posting: req.session.listingData,
        });
      }
    }

    if (step === 4) {
      const userId = Number(req.session.userId);
      const data = req.session.listingData;

      if (!req.session.userId) {
        res.status(401).json({ message: "Need to login first!" });
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
      // category id??
      // console.log(req.session.listingData.category);

      // const category = await prisma.category.findFirst({
      //   where: {
      //     name: data.category,
      //   },
      // });

      // if (!category) {
      //   res.status(400).json({ message: "Invalid category name." });
      //   return;
      // }

      const createPost = await prisma.listing.create({
        data: {
          title: data.title ?? "",
          description: data.description ?? "",
          type: data.type as ListingType,
          group: data.category as Groups,
          salePrice: data.salePrice ?? 0,
          rentalPrice: data.rentalPrice ?? 0,
          rentalDuration: data.rentalDuration as RentalDuration,
          condition: mappedCondition,
          userId: userId,
        },
      });

      console.log("New post created:", createPost);
      // req.session.categoryId = createPost.id;
      res.status(200).json({
        message: "Listing created successfully!",
        data: req.session.listingData,
      });
      return;
    }
    console.log("Current Form Data:", req.session.listingData);

    const nextStep = step + 1;
    return res.redirect(`/posting/create?step=${nextStep}`);
  } catch (error) {
    console.error("Error in form submission:", error);
    return res.status(500).render("posting/posting_layout", {
      title: "Create post",
      currentStep: step,
      categories: Object.values(Groups),
      error: "An unexpected error occurred. Please try again.",
      api: googleMapAPI,
      posting: req.session.listingData,
    });
  }
});

export { postingRouter };
