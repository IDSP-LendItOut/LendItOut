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
