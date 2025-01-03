const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    aadhaar: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const AdminDB = mongoose.model('Admin', AdminSchema);

module.exports = AdminDB
