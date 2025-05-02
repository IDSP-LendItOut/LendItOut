import express from "express";

const homeRouter = express.Router();

homeRouter.get("/buying", (req, res) => {
  res.render("home", { title: "Home", content: "buying", items });
});

homeRouter.get("/renting", (req, res) => {
  res.render("home", { title: "Home", content: "renting", items });
});

homeRouter.get("/buying-page", (req, res) => {
  res.render("home/buying", { title: "Buying", content: "buying" });
});

homeRouter.get("/renting-page", (req, res) => {
  res.render("home/renting", { title: "Renting", content: "renting" });
});

homeRouter.get("/orders", (req, res) => {
  res.render("orders", { title: "Your Orders" });
});

homeRouter.get("/bookmarks", (req, res) => {
  res.render("bookmarks", { title: "Bookmarks" });
});

homeRouter.get("/settings", (req, res) => {
  res.render("settings", { title: "Settings" });
});

homeRouter.get("/explore", (req, res) => {
  res.render("explore", { title: "Explore", items });
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
