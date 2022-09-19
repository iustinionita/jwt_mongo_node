// const mongoose = require('mongoose');
const Posts = require('../models/Posts');
const Users = require('../models/Users');

const post_create = async (req, res) => {
    const { creator, body, public } = req.body;
    try {
        const post = await Posts.create({ creator: creator, body: body, public: public });
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
    const { creator } = req.body;
    // const posts = await Posts.find({creator: creator}).populate('creator').exec();
    // console.log(posts);
    const posts = await Posts.find({ creator: creator });
    res.json(posts)
}

module.exports = {
    post_create,
    post_get
}