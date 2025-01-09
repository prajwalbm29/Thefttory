const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    aadhaarNo: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const AdminDB = mongoose.model('admins', AdminSchema);

module.exports = AdminDB
