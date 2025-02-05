// models/Complaint.js
const mongoose = require('mongoose');

// Define the schema for the complaint
const complaintSchema = new mongoose.Schema({
    aadhaarNo: {
        type: String,
        required: true,
    },
    mobile1: {
        type: String,
        required: true,
    },
    mobile2: {
        type: String,
        default: '',
    },
    imei: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    invoice: {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        uri: {
            type: String,
            required: true,
        },
        base64: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    lostLocation: {
        type: String,
        required: true,
    },
    lostDescription: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Submitted",
    },
    lostDate: {
        type: Date,
        required: true,
    },
    complaintDate: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true });

const CellPhoneComplaint = mongoose.model('cellphonecomplaints', complaintSchema);

module.exports = CellPhoneComplaint;
