import express from 'express';
import path from 'path';
const ejsMate = require('ejs-mate');
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { content: "buying" });
});

app.get("/buying", (req, res) => {
  res.render("home", { content: "buying" });
});

app.get("/renting", (req, res) => {
  res.render("home", { content: "renting" });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); 

});
