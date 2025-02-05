// Imports
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const mongoStore = require('connect-mongo')
const connectDB = require('./Databases/DatabaseConnection')
require('dotenv').config();
const AadhaarDetails = require('./Databases/AadhaarDetails');


const adminRouter = require('./Admin/admin-app')
const policeRouter = require('./Police/police-app');

// Database connection
connectDB();

const app = express()


const corsOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser()) 
app.use(session({
    secret: process.env.SECRET || "Prajwal the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    // store: mongoStore.create({
    //     client: mongoose.connection.getClient()
    // })
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Hello."});
})

app.post('/api/getdata', async (req, res) => {
    const { body: {aadhaarNo}} = req;
    try {
        const userData = await AadhaarDetails.findOne({ aadhaarNo: aadhaarNo }, 'name dob');
        if (!userData) return res.status(404).json({ message: "Aadhaar does not exists" });
        return res.status(200).send(userData);
    } catch (error) {
        console.log("Error in geting data : ", error);
        return res.status(500).json({ message: "Server Error"});
    }
})

app.use('/api/admin', adminRouter);
app.use('/api/police', policeRouter);

const PORT = process.env.PORT || 7001
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running on port ${PORT}`)
})