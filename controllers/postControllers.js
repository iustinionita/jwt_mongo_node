const Posts = require('../models/Posts');
const Users = require('../models/Users');
const Images = require('../models/Images');
const { upload } = require('./imageControllers.js');

// const post_create = async (req, res) => {
//     const { creator, title, body, public } = req.body;
//     try {
//         const post = await Posts.create({ creator: creator, title: title, body: body, public: public });
//         Users.updateOne({ _id: creator }, { $push: { posts: [post] } }, (err, result) => {
//             if (!err) {
//                 if (result.acknowledged) {
//                     res.end()
//                 } else {
//                     console.log(err)
//                     res.sendStatus(500)
//                 }
//             }
//         })
//     } catch (err) {
//         console.log(err.message)
//         res.sendStatus(500)
//     }
// }

const post_create = async (req, res) => {
    const up = upload('posts_img');
    up(req, res, async function (err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            const { title, body, public } = req.body;
            if (req.file) {
                const image = await Images.create({
                    user: res.locals.userId,
                    filename: req.file.filename,
                    mimetype: req.file.mimetype,
                    destination: req.file.destination,
                    path: req.file.path,
                    size: req.file.size
                });
                const post = await Posts.create({ creator: res.locals.userId, title, body, public, image: { filename: image.filename, path: image.path } });
                Users.updateOne({ _id: res.locals.userId }, { $push: { posts: [post] } }, (err, result) => {
                    if (!err) {
                        if (result.acknowledged) {
                            res.end()
                        } else {
                            console.log(err)
                            res.sendStatus(500)
                        }
                    }
                })
            } else {
                // console.log('No image');
                try {
                    const post = await Posts.create({ creator: res.locals.userId, title, body, public });
                    Users.updateOne({ _id: res.locals.userId }, { $push: { posts: [post] } }, (err, result) => {
                        if (!err) {
                            if (result.acknowledged) {
                                res.end()
                            } else {
                                console.log(err)
                                res.sendStatus(500)
                            }
                        }
                    })
                } catch (err) {
                    console.log(err.message)
                    res.sendStatus(500)
                }
            }
        }
    })
}


const post_get = async (req, res) => {
    try {
        const { creator, public, skip } = req.body;
        let posts;
        if (creator === undefined && public !== undefined) {
            // posts = await Posts.find().where('public').equals(public).sort([['createdAt', -1]]).skip(skip);
            posts = await Posts.find({ public: public }).sort([['createdAt', -1]]).skip(skip).limit(5).populate('creator').exec();
        } else if (public !== undefined) {
            posts = await Posts.find().where('creator').equals(creator).where('public').equals(public).skip(skip).limit(5).populate().exec();
            // console.log(posts)
        } else {
            posts = await Posts.find().where('creator').equals(creator).skip(skip).limit(5).populate('creator').exec();
            // console.log(posts)
        }
        res.json(posts)
    } catch (err) {
        console.log("Err on get post")
        res.sendStatus(500)
    }
}

const post_like_check = async (req, res) => {
    try {
        const { id } = req.body;
        const likes = await Posts.findById(id);
        res.send({ likes: likes.likes.length });
    } catch (err) {
        console.log(err)
    }
}

const post_like = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const like = await Posts.like(id, res.locals.userId)
            res.json(like)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        console.log(err)
    }
}

const post_dislike = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const dislike = await Posts.dislike(id, res.locals.userId);
            res.json(dislike);
        } else {
            res.sendStatus(500);
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    post_create,
    post_get,
    post_like_check,
    post_like,
    post_dislike
}