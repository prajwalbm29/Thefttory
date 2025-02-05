const mongoose = require('mongoose');

const policeSchema = new mongoose.Schema({
    aadhaarNo: { type: String, unique: true, required: true, match: /^\d{12}$/ },
    policeId: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    stationAddress: { type: String, required: true },
    hasAccess: { type: String, required: true },
})

const policeDB = mongoose.model('policedetails', policeSchema);

module.exports = policeDB