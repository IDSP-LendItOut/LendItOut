import express from "express";
import { requireLogin } from "../middleware/requireLogin";
import { prisma } from "../seed";

const profileRouter = express.Router();

profileRouter.get("/", requireLogin, async (req, res) => {
  const userId = req.session.userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log(user);
    if (!user) {
      return res.render("auth/login", {
        title: "login",
        error: null,
      });
    } else {
      res.render("profile", {
        title: "Profile",
        content: "profile",
        items,
        users,
        showSearchbar: false,
        user: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.get("/editProfile", (req, res) => {
  res.render("profile/editProfile", { title: "Edit Profile" });
});
profileRouter.post("/editProfile", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

profileRouter.get("/insight", (req, res) => {
  res.render("profile/insight", { title: "Profile", showSearchbar: false });
});

profileRouter.get("/contract", (req, res) => {
  res.render("profile/contract", { title: "Profile", showSearchbar: false });
});

profileRouter.get("/orders", (req, res) => {
  res.render("orders", { title: "Your Orders", showSearchbar: false });
});

profileRouter.get("/bookmarks", (req, res) => {
  res.render("bookmarks", { title: "Bookmarks", showSearchbar: false });
});

profileRouter.get("/settings", (req, res) => {
  res.render("settings", { title: "Settings", showSearchbar: false });
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

const users = [
  {
    name: "Matheus",
    rating: 5,
    review: "The camera I purchased was in excellent condition. Thanks!",
    image: "https://picsum.photos/300/300",
  },
  {
    name: "John",
    rating: 4,
    review: "The camera I purchased was in excellent condition. Thanks!",
    image: "https://picsum.photos/300/300",
  },
];

export { profileRouter };
