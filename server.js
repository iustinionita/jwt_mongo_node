require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const https = require('https');
const fs = require('fs');

// Mongoose Setup for SSL
// mongoose.connect(process.env.DBURI,
//     () => {
//         console.log("Connected to DB")
//         https.createServer({
//             cert: fs.readFileSync("SSL_CONFIG/server.crt"),
//             key: fs.readFileSync("SSL_CONFIG/private.key"),
//             ca: fs.readFileSync("SSL_CONFIG/bundle.crt")
//         }, app).listen(2000, () => {
//             console.log("Server ON. Port 2000")
//         })
//     },
//     () => {
//         console.log("Error: Cannot connect to DB")
//     }
// )

// Mongoose Setup for Development
mongoose.connect(process.env.DBURI,
    () => {
        console.log("Connected to DB")
        app.listen(2000, () => {
            console.log("Server ON. Port 2000")
        })
    },
    () => {
        console.log("Error: Cannot connect to DB")
    }
)

// Middleware
app.use(cors({ mode: 'cors', credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Statis directory
app.use('/images/', express.static(__dirname + '/avatars_img'));
app.use('/images/', express.static(__dirname + '/posts_img'));

// Users Router
app.use('/users/', userRoutes)

// Posts Router
app.use('/bings/', postRoutes);

app.post('/', (req, res) => {
    res.send("This is the root")
})