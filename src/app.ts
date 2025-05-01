import bodyParser from "body-parser";
import ejsMate from "ejs-mate";
import express from "express";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 6563;

app.engine("ejs", ejsMate as any);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/listings", (req, res) => {
  res.render("hs", { items });
});

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




// home
app.get("/", (req, res) => {
  res.render("home", { title: "Home", content: "buying", items });
});

app.get("/buying", (req, res) => {
  res.render("home", { title: "Home", content: "buying", items });
});

app.get("/renting", (req, res) => {
  res.render("home", { title: "Home", content: "renting", items });
});

app.get("/buying-page", (req, res) => {
  res.render("home/buying", { title: "Buying", content: "buying" });
});

app.get("/renting-page", (req, res) => {
  res.render("home/renting", { title: "Renting", content: "renting" });
});

app.get("/orders", (req, res) => {
  res.render("orders", { title: "Your Orders" });
});

app.get("/bookmarks", (req, res) => {
  res.render("bookmarks", { title: "Bookmarks" });
});

app.get("/settings", (req, res) => {
  res.render("settings", { title: "Settings" });
});

app.get("/explore", (req, res) => {
  res.render("explore", { title: "Explore", items });
});

// profile
app.get('/profile', (req, res) => {
  res.render('profile', { title: "Profile", content: "profile" , items, users });
});



app.get("/editProfile", (req, res) => {
  res.render("profile/editProfile", { title: "Edit Profile" });
});
app.post("/editProfile", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.get("/insight", (req, res) => {
  res.render("profile/insight", { title: "Profile" });
});
app.get("/contract", (req, res) => {
  res.render("profile/contract", { title: "Profile" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
