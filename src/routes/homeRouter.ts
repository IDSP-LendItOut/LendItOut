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
        image: "https://picsum.photos/300/300",
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
        image: "https://picsum.photos/300/300",
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
        image: "https://picsum.photos/300/300",
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
        image: "https://picsum.photos/300/100",
        price: "$10/hour x 2",
        total: "$20",
      },
      {
        name: "Viral Sneakers",
        desc: "TikTok trending sneakers in pink ...",
        image: "https://picsum.photos/300/100",
        price: "$10/hour x 2",
        insurance: "$10",
        total: "$30",
      },
      {
        name: "Vintage machine",
        desc: "Still working printing machine from ...",
        image: "https://picsum.photos/300/100",
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
    image: "https://picsum.photos/300/300",
    name: "Item 4",
    price: "$69.99",
    status: "For Sale",
    statusClass: "for-sale",
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 5",
    price: "$190",
    status: "For Sale",
    statusClass: "for-sale",
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent",
  },
];

export { homeRouter };