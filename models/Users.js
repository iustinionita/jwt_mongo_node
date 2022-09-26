const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already taken"],
        minLength: [6, "Min username length is 6 characters"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Min password length is 6 characters"]
    },
    fName: {
        type: String
    },
    lName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    avatar: {
        filename: {
            type: String,
            required: true,
            unique: true
        },
        path: {
            type: String,
            required: true,
            unique: true,
        }
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Posts'
    }]
}, {
    timestamps: true
})

// Encrypt passwords with bcrypt - Middleware
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method for user login
userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect username");
}

const Users = mongoose.model("Users", userSchema);

module.exports = Users;