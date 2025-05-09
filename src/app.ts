import bodyParser from "body-parser";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import express from "express";
import session from "express-session";
import path from "path";

dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";

import { authRouter } from "./routes/authRouter";
import { homeRouter } from "./routes/homeRouter";
import messagesRouter from "./routes/messagesRouter";
import { postingRouter } from "./routes/postingRouter";
import { profileRouter } from "./routes/profileRouter";
import listingsRouter from "./routes/listingsRouter";




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 6563;

app.engine("ejs", ejsMate as any);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/", homeRouter);
app.use("/profile", profileRouter);
app.use("/messages", messagesRouter);
app.use("/auth", authRouter);
app.use("/posting", postingRouter);
app.use("/listings", listingsRouter);

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

// home
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    content: "buying",
    items,
    showSearchbar: true,
  });
});

app.get("/profilephoto", (req, res) => {
  res.render("profile/addprofilephoto", { title: "Profile" });
});

// terms and conditions
app.get("/termsconditions", (req, res) => {
  res.render("terms&conditions/terms_conditions", {
    title: "Terms and Conditions",
  });
});

//onboarding
app.get("/onboarding", (req, res) => {
  res.render("onboarding/onboardLayout", { title: "Onboarding" });
});

// interests view and notifications view
app.get("/interestsview", (req, res) => {
  res.render("interests/interestsview", { title: "Interests" });
});

app.get("/notifications", (req, res) => {
  res.render("notifications/notifications", { title: "Notifications" });
});

// cart with fake data for now
app.get("/cart", (req, res) => {
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
        name: "Vintage printing machine",
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


// checkout with fake data for now
app.get("/cart/checkout", (req, res) => {
  res.render('cart/checkout', {title: "Checkout",
    checkoutItems: [
      {
        name: "Tennis Rocket and Balls",
        desc: "Good condition tennis rocket with balls",
        image: "https://picsum.photos/300/100",
        price: "$10/hour x 2",
        total: "$20"
      },
      {
        name: "Viral Sneakers",
        desc: "TikTok trending sneakers in pink ...",
        image: "https://picsum.photos/300/100",
        price: "$10/hour x 2",
        insurance: "$10",
        total: "$30"
      },
      {
        name: "Vintage printing machine",
        desc: "Still working printing machine from ...",
        image: "https://picsum.photos/300/100",
        price: "$100",
        total: "$100"
      }
    ],
    total: "$180"
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
