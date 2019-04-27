const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const db = mongoose.connect('mongodb://localhost/test');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const bookRoute = require('./routes/book');
const authorRoute = require('./routes/author');

app.use('/books', bookRoute);
// app.use('/authors', authorRoute);

const port = process.env.PORT || 3000;

app.listen(port, () =>  {
    console.log(`Server up at ${port}`);
});