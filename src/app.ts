import express from 'express';
import path from 'path';
import ejsMate from 'ejs-mate';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 6563;

app.engine('ejs', ejsMate as any); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

const items = [
  {
    image: "https://picsum.photos/300/300",
    name: "Item 4",
    price: "$69.99",
    status: "For Sale",
    statusClass: "for-sale"
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 5",
    price: "$190",
    status: "For Sale",
    statusClass: "for-sale"
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent"
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent"
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent"
  },
  {
    image: "https://picsum.photos/300/300",
    name: "Item 6",
    price: "$80/day",
    status: "For Rent",
    statusClass: "for-rent"
  }
];

app.get('/listings', (req, res) => {
  res.render('hs', { items }); 
});

app.get("/", (req, res) => {
  res.render("home", { title: "Buying page", content: "buying", items });
});

app.get("/buying", (req, res) => {
  res.render("home", { title: "Renting page", content: "buying", items });
});

app.get("/renting", (req, res) => {
  res.render("home", { content: "renting", items });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); 

});
