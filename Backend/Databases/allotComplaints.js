const mongoose = require('mongoose');

const allotmentSchema = new mongoose.Schema({
    policeId: {
        type: String,
        required: true,
        unique: true,
    },
    complaintId: {
        type: [String],
    },
}, { timestamps: true });

const Allotment = mongoose.model('policecomplaints', allotmentSchema);

module.exports = Allotment;
