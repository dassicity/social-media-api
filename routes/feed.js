const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/getPosts', feedController.getPosts);

router.post('/createPost', feedController.createPost);

module.exports = router;