const Path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const feedRouter = require('./routes/feed');

app.use(bodyparser.json());     // We wouldn't use urlencoded here because we are only gonna deal with json data both with req and res
app.use('/images', express.static(Path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next();
})

app.use('/feed', feedRouter);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
})

mongoose.connect('mongodb+srv://dassic:Dassic007@cluster0.ad9yl.mongodb.net/test')
    .then(res => {
        console.log("Connected to DB");
        app.listen(8080);
    })
    .catch(err => console.log(err))
