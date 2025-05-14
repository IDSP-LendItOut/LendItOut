import express from "express";
import { requireLogin } from "../middleware/requireLogin";
import { prisma } from "../seed";

const profileRouter = express.Router();
const listing = await prisma.listing.findMany({
  include: {
    user: true,
    media: true,
  },
  orderBy: {
    salePrice: "asc",
  },
  take: 10,
});
console.log(listing[9]);
profileRouter.get("/", requireLogin, async (req, res) => {
  const userId = req.session.userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const myListing = await prisma.listing.findMany({
      where: { userId: userId },
      include: {
        user: true,
        media: true,
      },
    });

    if (!user) {
      return res.render("auth/login", {
        title: "login",
        error: null,
      });
    } else {
      const joinedYear = user.createdAt.getFullYear();

      res.render("profile", {
        title: "Profile",
        content: "profile",
        items,
        users,
        showSearchbar: false,
        user: user,
        joinedYear,
        myListing,
        listing,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.get("/editProfile", requireLogin, async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.render("auth/login", {
        title: "login",
        error: null,
      });
    } else {
      res.render("profile/editProfile", {
        title: "Edit Profile",
        user: user,
        successMessage: null,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.post("/editProfile", requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const { name, username, pronouns, location } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
    },
  });
  res.render("profile/editProfile", {
    title: "Edit Profile",
    successMessage: "Profile has been updated.",
    user: user,
    name: updatedUser.name,
    username,
    pronouns,
    location,
  });
});

profileRouter.get("/insight", requireLogin, (req, res) => {
  res.render("profile/insight", { title: "Profile", showSearchbar: false });
});

profileRouter.get("/contract", requireLogin, (req, res) => {
  res.render("profile/contract", { title: "Profile", showSearchbar: false });
});

profileRouter.get("/orders", requireLogin, (req, res) => {
  res.render("orders", { title: "Your Orders", showSearchbar: false });
});

profileRouter.get("/bookmarks", requireLogin, (req, res) => {
  res.render("bookmarks", { title: "Bookmarks", showSearchbar: false });
});

profileRouter.get("/settings", requireLogin, (req, res) => {
  res.render("settings", { title: "Settings", showSearchbar: false });
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
