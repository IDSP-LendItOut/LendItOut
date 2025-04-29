import express from 'express';
import path from 'path';
const ejsMate = require('ejs-mate');

const app = express();
const port = 3000;

app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); 
});
