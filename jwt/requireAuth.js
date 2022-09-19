const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const outputUser = require('../models/outputUser');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_JWT, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                // res.status(401).json({ message: "Invalid JWT token" })
                res.status(401).end()
            } else {
                console.log(decodedToken)
                res.locals.userId = decodedToken.id
                const user = await Users.findById(decodedToken.id);
                res.locals.user = outputUser(user);
                next()
            }
        })
    } else {
        console.log("No jwn cookie")
        res.end()
    }
}

module.exports = { requireAuth };