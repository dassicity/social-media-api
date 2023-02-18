const { validationResult } = require('express-validator');

const fs = require('fs');
const Path = require('path');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    let totalItems;
    const perPage = 2;
    Post.find()
        .countDocuments()
        .then(items => {
            totalItems = items;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: posts,
                totalItems: totalItems
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Creation of post failed due to wrongly entered data');
        error.statusCode = 422;
        throw error;
        // return res.status(422).json({
        //     message: "Creation of post failed due to wrongly entered data",
        //     errors: errors
        // });

    }
    if (!req.file) {
        const error = new Error('Image file not found.');
        error.statusCode = 422;
        throw error;
    }


    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;
    // console.log('In Create Post');
    // console.log(imageUrl);
    let creator;

    const post = new Post({
        title: title,
        content: content,
        creator: req.userId,
        imageUrl: imageUrl
    });

    post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Post created successfully!",
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post was found!');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Post fetched successfully!',
                post: post
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.editPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Creation of post failed due to wrongly entered data');
        error.statusCode = 422;
        throw error;
        // return res.status(422).json({
        //     message: "Creation of post failed due to wrongly entered data",
        //     errors: errors
        // });

    }
    if (post.creator.toStrng() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!imageUrl) {
        const error = new Error('No file picked!');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post was found!');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post updated successfully!',
                post: result
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post was found!');
                error.statusCode = 404;
                throw error;
            }
            // Check if the logged in user created the post
            if (post.creator.toStrng() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }

            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post successfully deleted!'
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

const clearImage = imagePath => {
    const filePath = Path.join(__dirname, '..', imagePath);
    fs.unlink(filePath, err => console.log(err));
}