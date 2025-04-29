import bodyParser from "body-parser";
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", { content: "buying" });
});

app.get("/buying", (req, res) => {
  res.render("home", { content: "buying" });
});

app.get("/renting", (req, res) => {
  res.render("home", { content: "renting" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
