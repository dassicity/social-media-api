const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const feedRouter = require('./routes/feed');

app.use(bodyparser.json());     // We wouldn't use urlencoded here because we are only gonna deal with json data both with req and res

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next();
})

app.use('/feed', feedRouter);

mongoose.connect('mongodb+srv://dassic:Dassic007@cluster0.ad9yl.mongodb.net/test')
    .then(res => {
        console.log("Connected to DB");
        app.listen(8080);
    })
    .catch(err => console.log(err))
