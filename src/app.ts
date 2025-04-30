import express from 'express';
import path from 'path';
import ejsMate from 'ejs-mate';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { title } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = 6563;

app.engine('ejs', ejsMate as any); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, "..", "public")));

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



app.get("/", (req, res) => {

  res.render("home", { content: "buying", title: "Home", items });
});

app.get("/buying", (req, res) => {
  res.render("home", { title: "Home", content: "buying", items });
});

app.get("/renting", (req, res) => {
  res.render("home", { title: "Home", content: "renting", items });
});

app.get('/listings', (req, res) => {
  res.render('hs', { items }); 
});

app.get('/profile', (req, res)=>{
  res.render('profile', { title: 'Profile'})
})

app.get('/orders', (req, res) => {
  res.render('orders', { title: 'Your Orders' });
});

app.get('/bookmarks', (req, res) => {
  res.render('bookmarks', { title: 'Bookmarks' });
});

app.get('/settings', (req, res) => {
  res.render('settings', { title: 'Settings' });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
