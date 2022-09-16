const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_JWT, {
        expiresIn: maxAge
    })
}

const user_signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.create({
            username,
            password
        });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({ user: user._id });
    } catch (e) {
        res.send(e.message);
    }
}

const user_login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.login(username, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json(user);
    } catch(e) {
        console.log(e.message)
        res.json(e.message)
    }
}

const user_logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.end();
}

// DEBUG PURPOSES - TO BE REMOVED
const user_posts = (req, res) => {
    res.json({
        message: "Success"
    });
}

module.exports = {
    user_signup,
    user_login,
    user_posts,
    user_logout
}