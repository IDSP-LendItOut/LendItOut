import express from "express";
import { requireLogin } from "../middleware/requireLogin";
// import { prisma } from "../seed";
import { Category } from "@prisma/client";

const postingRouter = express.Router();

postingRouter.get("/create", requireLogin, (req, res) => {
  const currentStep = parseInt((req.query.step as string) || "1");
  console.log("*");
  console.log(currentStep);
  res.render("posting/posting_layout", {
    title: "Create post",
    currentStep,
    categories: Object.values(Category),
    listingType: req.session.listingData?.type || [],
    error: null,
  });
});

postingRouter.post("/create/step/:step", requireLogin, async (req, res) => {
  const step = parseInt(req.params.step);
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
          categories: Object.values(Category),
          error: "Please select at least one listing type.",
        });
      }

      if (!category) {
        return res.render("posting/posting_layout", {
          title: "Create post",
          currentStep: 1,
          categories: Object.values(Category),
          error: "Please select a category.",
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
        });
      }

      req.session.listingData.title = title;
      req.session.listingData.description = description;
      req.session.listingData.salePrice = parseFloat(salePrice) || 0;
      req.session.listingData.rentalPrice = parseFloat(rentalPrice) || 0;
      req.session.listingData.rentalDuration = rentalDuration;
      req.session.listingData.condition = condition;
    }

    console.log("Current Form Data:", req.session.listingData);

    const nextStep = step + 1;
    res.redirect(`/posting/create?step=${nextStep}`);
  } catch (error) {
    console.error("Error in form submission:", error);
    res.status(500).render("posting/posting_layout", {
      title: "Create post",
      currentStep: step,
      categories: Object.values(Category),
      error: "An unexpected error occurred. Please try again.",
    });
  }
});

postingRouter.get("/preview", (req, res) => {
  res.render("posting/posting_layout", {
    title: "preview",
    // formData: req.session.listingData || {},
    errors: {},
    currentStep: 5,
    categories: Object.values(Category),
  });
});
export { postingRouter };
