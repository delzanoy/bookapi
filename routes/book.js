const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/test');

const Book = require('../models/bookModel');

router.use('/:bookId', function (req, res, next) {
    Book.findById(req.params.bookId, function (err, book) {
        if (err)
            res.status(500).json(err)
        else if (book) {
            req.book = book;
            next();
        }
        else
            res.status(404).json({ message: "Book not found" });
    });
});

router.get('/', (req, res, next) => {
    let query = {};
    if (req.query.genre)
        query.genre = req.query.genre;
    if (req.query.limit)
        query.limit = req.query.limit;
    Book.find(query, function (err, books) {
        if (err)
            res.status(500).json(err)
        else
            res.status(200).json(books);
    })
    // .limit(query.limit);
});

router.get('/:bookId', (req, res, next) => {
    res.json(req.book);
});

router.put('/:bookId', (req, res, next) => {

    req.book.title = req.body.title;
    req.book.author = req.body.author;
    req.book.genre = req.body.genre;
    req.book.read = req.body.read;
    req.book.save().then(book => {
        res.status(201).json(req.book);
    });
});

router.patch('/:bookId', (req, res, next) => {
    if (req.body._id)
        delete req.body._id;
    for (let p in req.body) {
        req.book[p] = req.body[p]
    }
    req.book.save().then(book => {
        res.status(201).json(req.book);
    });
});

router.delete('/:bookId', (req, res, next) => {
    req.book.remove().then(res.status(204).json({ message: 'Book removed' })).catch(err => {
        res.status(500).json(err);
    });
});

router.post('/', function (req, res, next) {
    const book = new Book(req.body);
    book.save(book => {
        res.status(201).json(book);
    });
});

module.exports = router;