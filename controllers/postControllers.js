// const mongoose = require('mongoose');
const Posts = require('../models/Posts');
const Users = require('../models/Users');

const post_create = async (req, res) => {
    const { creator, title, body, public } = req.body;
    try {
        const post = await Posts.create({ creator: creator, title: title, body: body, public: public });
        Users.updateOne({ _id: creator }, { $push: { posts: [post] } }, (err, result) => {
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

const post_get = async (req, res) => {
    try {
        const { creator, public, skip } = req.body;
        let posts;
        if (creator === undefined && public !== undefined) {
            // posts = await Posts.find().where('public').equals(public).sort([['createdAt', -1]]).skip(skip);
            posts = await Posts.find({ public: public }).sort([['createdAt', -1]]).skip(skip).limit(5);
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
    const { id, user } = req.body;
    if (id && user) {
        const like = await Posts.like(id, user)
        res.json(like)
    } else {
        res.sendStatus(500)
    }
}

module.exports = {
    post_create,
    post_get,
    post_like_check,
    post_like,
}