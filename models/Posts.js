const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    }
    // comments: []
})

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;