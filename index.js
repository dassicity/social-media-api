const Path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("In destination");
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // console.log("In filename");
        cb(null, new Date().toDateString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


app.use(bodyparser.json());     // We wouldn't use urlencoded here because we are only gonna deal with json data both with req and res
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(Path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next();
})

app.use('/feed', feedRouter);
app.use('/auth', authRouter);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})

mongoose.connect('mongodb+srv://dassic:Dassic007@cluster0.ad9yl.mongodb.net/feed')
    .then(res => {
        const server = app.listen(8080);
        if (server) {
            console.log("Connected to DB");
        }
        // const io = require('socket.io')(server);
        // io.on('connection', socket => {
        //     console.log("Connected to socket!");
        // })
    })
    .catch(err => console.log(err))
