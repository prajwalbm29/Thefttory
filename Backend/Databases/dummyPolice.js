const mongoose = require('mongoose');

const policeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    policeID: {
        type: String,
        required: true,
        unique: true
    },
    rank: {
        type: String,
        required: true
    },
    aadhaarNo: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v); // Aadhaar numbers must be 12 digits
            },
            message: props => `${props.value} is not a valid Aadhaar number!`
        }
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    contact: {
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Phone numbers must be 10 digits
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\S+@\S+\.\S+$/.test(v); // Basic email validation
                },
                message: props => `${props.value} is not a valid email address!`
            }
        }
    },
    address: {
        taluk: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const policeDB = mongoose.model('DummyPolice', policeSchema);

module.exports = policeDB