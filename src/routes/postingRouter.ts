import express from "express";
import { requireLogin } from "../middleware/requireLogin";
// import { prisma } from "../seed";
import { Groups } from "@prisma/client";

const postingRouter = express.Router();

postingRouter.get("/create", requireLogin, (req, res) => {
  const currentStep = parseInt((req.query.step as string) || "1");
  const googleMapAPI = process.env.GOOGLE_MAP;
  console.log("*");
  console.log(currentStep);
  res.render("posting/posting_layout", {
    title: "Create post",
    currentStep,
    categories: Object.values(Groups),
    listingType: req.session.listingData?.type || [],
    error: null,
    api: googleMapAPI,
  });
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
        });
      }

      if (!category) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 1,
          categories: Object.values(Groups),
          error: "Please select a category.",
          api: googleMapAPI,
        });
      }
      req.session.listingData.type = type;
      req.session.listingData.category = category;
    }

    // Step 2: Details and Pricing
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
      req.session.listingData.delivery = delivery;
      req.session.listingData.payment = payment;
      req.session.listingData.promote = promote;
      req.session.listingData.city = city;

      if (!delivery) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 3,
          categories: Object.values(Groups),
          error: "Please select at least one delivery option.",
          api: googleMapAPI,
        });
      }
      if (!payment) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 3,
          categories: Object.values(Groups),
          error: "Please select at least one payment option.",
          api: googleMapAPI,
        });
      }
    }
    console.log("Current Form Data:", req.session.listingData);

    const nextStep = step + 1;
    res.redirect(`/posting/create?step=${nextStep}`);
  } catch (error) {
    console.error("Error in form submission:", error);
    res.status(500).render("posting/posting_layout", {
      title: "Create post",
      currentStep: step,
      categories: Object.values(Groups),
      error: "An unexpected error occurred. Please try again.",
    });
  }
});

export { postingRouter };
