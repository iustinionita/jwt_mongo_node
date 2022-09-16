const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_JWT, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.sendStatus(401)
            } else {
                console.log(decodedToken);
                next()
            }
        })
    } else {
        console.log("No jwn cookie")
        res.sendStatus(401)
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_JWT, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                next();
            } else {
                console.log(decodedToken);
                const user = await Users.findById(decodedToken.id);
                // res.json(user)
                res.locals.user = user;
                next()
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };