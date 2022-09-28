const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String
        },
        path: {
            type: String
        }
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Users',
    }],
    // comments: []
}, {
    timestamps: true
})

// Likes
postSchema.statics.like = async function (id, user) {
    const checkLikes = await this.find({
        "_id": id,
        "likes": {
            "$in": [user]
        }
    })

    if (checkLikes.length === 0) {
        // const likedPost = await this.findByIdAndUpdate(id, { $push: { "likes": [user] } });
        // console.log(`Liked ${likedPost}`)
        await this.findByIdAndUpdate(id, { $push: { "likes": [user] } });
        return { liked: true }
    } else {
        // console.log("Already liked. Dislike triggered");
        return { liked: false }
    }

}

postSchema.statics.dislike = async function (id, user) {
    const dislikedPost = await this.findByIdAndUpdate(id, { $pull: { "likes": user } });
    if (dislikedPost) {
        return { disliked: true }
    } else {
        return { disliked: false }
    }
}

// GET LIKES BY USER ID
// const post = await this.find({
//     "_id": id,
//     "likes": {
//         "$in": [user]
//     }
// })

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;