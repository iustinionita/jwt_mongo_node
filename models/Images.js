const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Images = mongoose.model("Images", ImageSchema);

module.exports = Images;