const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        "posts": [{
            _id: '1',
            title: 'First Post',
            content: 'This is my hello world post!',
            imageUrl: 'images/jets.JPEG',
            creator: {
                name: 'Soumyanil Das'
            },
            createdAt: new Date()
        }]
    });
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
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        creator: {
            name: 'Soumyanil'
        },
        imageUrl: 'images/jets.JPEG'
    });

    post.save()
        .then(result => {
            // console.log(result);
            res.status(201).json({
                message: "Post created successfully!",
                post: result,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}