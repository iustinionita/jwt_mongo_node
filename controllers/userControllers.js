const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const outputUser = require('../models/outputUser');
const { upload } = require('../controllers/imageControllers');
const Images = require('../models/Images');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_JWT, {
        expiresIn: maxAge
    })
}

const user_signup = async (req, res) => {
    const { username, password, fName, lName, email } = req.body;
    try {
        const user = await Users.create({
            username,
            password,
            fName,
            lName,
            email
        });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json(outputUser(user));
    } catch (e) {
        if (e.code === 11000) {
            const message = Object.keys(e.keyValue)[0]
            console.log(message)
            if (message === "username") {
                res.json({ error: e.code, duplicateKey: message, message: "Username already exist" })
            } else if (message === "email") {
                res.json({ error: e.code, duplicateKey: message, message: "Email already exist" })
            }
        } else {
            res.json({ error: e, message: e.message })
        }
    }
}

const user_login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.login(username, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json(outputUser(user));
    } catch (e) {
        console.log(e.message)
        res.json(e.message)
    }
}

const user_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.end();
}

const user_avatar = async (req, res) => {
    try {
        const up = upload('avatars_img');
        up(req, res, async function (err) {
            if (err) {
                res.sendStatus(500)
                console.log(err)
            } else {
                const image = await Images.create({
                    user: res.locals.userId,
                    filename: req.file.filename,
                    mimetype: req.file.mimetype,
                    destination: req.file.destination,
                    path: req.file.path,
                    size: req.file.size
                })
                const userAvatar = await Users.findByIdAndUpdate(res.locals.userId, {'avatar': {'filename': image.filename, 'path': image.path}});
                res.sendStatus(200)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

// Get own posts
const user_own_posts = async (req, res) => {
    const { skip } = req.body;
    try {
        const posts = await Users.find({ _id: res.locals.userId }).populate({
            path: 'posts',
            options: {
                limit: 5,
                skip: skip,
                sort: { createdAt: -1 }
            }
        }).exec();
        res.json(posts)
    } catch (e) {
        console.log(e.message);
        res.json(e.message)
    }
}

// Check user JWT and return user data from DB
const user_check = (req, res) => {
    res.json(res.locals.user)
}

module.exports = {
    user_signup,
    user_login,
    user_logout,
    user_check,
    user_avatar,
    user_own_posts
}