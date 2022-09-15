const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.SECRET_JWT, (err, decodedToken) => {
            if(err) {
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

module.exports = requireAuth;