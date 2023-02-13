const { validationResult } = require('express-validator');

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
        return res.status(422).json({
            message: "Creation of post failed due to wrongly entered data",
            errors: errors
        });

    }
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: "Post created successfully!",
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: 'Soumyanil'
            },
            createdAt: new Date()
        },
    });
}