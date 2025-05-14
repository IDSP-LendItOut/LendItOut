import express from "express";

const homeRouter = express.Router();

homeRouter.get("/buying", (req, res) => {
  res.render("home", {
    title: "Home",
    content: "buying",
    items,
    showSearchbar: true,
  });
});

homeRouter.get("/renting", (req, res) => {
  res.render("home", {
    title: "Home",
    content: "renting",
    items,
    showSearchbar: true,
  });
});

homeRouter.get("/buying-page", (req, res) => {
  res.render("home/buying", {
    title: "Buying",
    content: "buying",
    showSearchbar: true,
  });
});

homeRouter.get("/renting-page", (req, res) => {
  res.render("home/renting", {
    title: "Renting",
    content: "renting",
    showSearchbar: true,
  });
});

homeRouter.get("/explore", (req, res) => {
  res.render("explore", { title: "Explore", items, showSearchbar: true });
});

// Profile photo route
homeRouter.get("/profilephoto", (req, res) => {
  res.render("profile/addprofilephoto", { title: "Profile" });
});

// Terms and conditions route
homeRouter.get("/termsconditions", (req, res) => {
  res.render("terms&conditions/terms_conditions", {
    title: "Terms and Conditions",
  });
});

// Onboarding route
homeRouter.get("/onboarding", (req, res) => {
  res.render("onboarding/onboardLayout", { title: "Onboarding" });
});

// Interests view and notifications view
homeRouter.get("/interestsview", (req, res) => {
  res.render("interests/interestsview", { title: "Interests" });
});

homeRouter.get("/notifications", (req, res) => {
  res.render("notifications/notifications", { title: "Notifications" });
});

// Cart route
homeRouter.get("/cart", (req, res) => {
  res.render("cart/cart", {
    title: "Cart",
    cartItems: [
      {
        name: "Tennis Rocket",
        image: "images/tennis.png",
        priceLabel: "$10/hour x 2 = $20",
        quantity: 2,
        canRent: true,
        canBuy: true,
        contracts: ["Rental Contract", "Buying Contract"],
        insurance: 10,
        insuranceSelected: false,
      },
      {
        name: "Viral Sneakers",
        image: "images/sneakers.png",
        priceLabel: "$10/hour x 2 = $20",
        quantity: 2,
        canRent: true,
        canBuy: false,
        contracts: ["Rental Contract"],
        insurance: 10,
        insuranceSelected: true,
      },
      {
        name: "Vintage machine",
        image: "images/machine.png",
        priceLabel: "$100",
        quantity: 1,
        canRent: false,
        canBuy: true,
        contracts: ["Purchase Contract"],
        insurance: 20,
        insuranceSelected: false,
      },
    ],
    subtotalRent: 40,
    subtotalBuy: 100,
    totalInsurance: 10,
    shipping: 30,
    total: 180,
  });
});

// Checkout route
homeRouter.get("/cart/checkout", (req, res) => {
  res.render("cart/checkout", {
    title: "Checkout",
    checkoutItems: [
      {
        name: "Tennis Rocket and Balls",
        desc: "Good condition tennis rocket with balls",
        image: "/images/tennis.png",
        price: "$10/hour x 2",
        total: "$20",
      },
      {
        name: "Viral Sneakers",
        desc: "TikTok trending sneakers in pink ...",
        image: "/images/sneakers.png",
        price: "$10/hour x 2",
        insurance: "$10",
        total: "$30",
      },
      {
        name: "Vintage machine",
        desc: "Still working printing machine from ...",
        image: "/images/machine.png",
        price: "$100",
        total: "$100",
      },
    ],
    total: "$180",
  });
});

// Checkout payment route
homeRouter.get("/cart/checkout/payment", (req, res) => {
  res.render("cart/checkpayment", { title: "Checkout Payment" });
});

const items = [
  {
    image: "images/pants.png",
    name: "Carhartt Men's Relaxed Fit...",
    price: "$69.99",
    status: "For Sale",
    statusClass: "for-sale",
  },
  {
    image: "images/chain.png",
    name: "Stainless Steel Flame Cross...",
    price: "$9",
    status: "For Sale",
    statusClass: "for-sale",
  },
  {
    image: "images/budshirt.png",
    name: "Vintage bud light baseball...",
    price: "$25/week",
    status: "For Rent",
    statusClass: "for-rent",
  },
  {
    image: "images/honda.png",
    name: "Honda Convertible Coupe ",
    price: "$100/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
  {
    image: "images/stairs.png",
    name: "Adjustable Ladder 5-10 ft",
    price: "$30/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
  {
    image: "images/3dprinter.png",
    name: "3D printer w/ filament",
    price: "$50/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
];

homeRouter.get("/cart/checkout/payment/pay", (req, res) => {
  res.render("cart/purchase", { title: "Purchase" });
});

// home
homeRouter.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    content: "buying",
    items,
    showSearchbar: true,
  });
});

export { homeRouter };