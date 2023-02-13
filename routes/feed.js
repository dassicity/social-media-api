const express = require('express');
const { body } = require('express-validator')

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/getposts - Get all the posts to render in the field
router.get('/getPosts', feedController.getPosts);

// POST /feed/createPost - create a post with user entered content
router.post('/createPost', [
    body('title').trim().isLength({ min: 7 }),
    body('content').trim().isLength({ min: 10 })
], feedController.createPost);

module.exports = router;