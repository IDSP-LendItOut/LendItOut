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
import settingsRouter from "./routes/settingsRouter";




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
app.use("/settings", settingsRouter)

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


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
