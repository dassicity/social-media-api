exports.getPosts = (req, res, next) => {
    res.status(200).json({
        "posts": [{ Title: 'First Post', Content: 'This is my hello world post!' }]
    });
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: "Post created successfully!",
        post: { _id: new Date().toISOString(), title: title, content: content },
    });
}