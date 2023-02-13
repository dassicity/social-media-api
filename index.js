const express = require('express');
const bodyparser = require('body-parser');

const app = express();

const feedRouter = require('./routes/feed');

app.use(bodyparser.json());     // We wouldn't use urlencoded here because we are only gonna deal with json data both with req and res

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Header', 'Content-Type , Authorization');
    next();
})

app.use('/feed', feedRouter);

app.listen(8080);