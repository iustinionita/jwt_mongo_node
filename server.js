require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Users Router
app.use('/users/', userRoutes)

app.get('/', (req, res) => {
    res.send("This is the root")
})