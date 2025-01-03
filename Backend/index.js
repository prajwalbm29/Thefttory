// Imports
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const mongoStore = require('connect-mongo')
const connectDB = require('./Databases/DatabaseConnection')
const dotenv = require('dotenv')
const adminRouter = require('./Admin/admin-app')


dotenv.config();
// Database connection
connectDB();

const app = express()


const corsOptions = {
    origin: ["http://localhost:3001"],
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
    store: mongoStore.create({
        client: mongoose.connection.getClient()
    })
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 7001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})