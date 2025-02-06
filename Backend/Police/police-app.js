const router = require('express').Router();
const policeDB = require('../Databases/PoliceDetails')
const AadhaarDetails = require('../Databases/AadhaarDetails');
const encrypt = require('../encryption/encription');
const nodemailer = require('nodemailer');
const OtpVerificationModal = require('../Databases/OtpVerification');

router.post('/getData', async (req, res) => {
    const { body: { policeId } } = req;
    try {
        const data = await policeDB.findOne({ policeId: policeId });
        if (!data) return res.status(400).json({ message: "Police Id not found." });
        const { aadhaarNo, position } = data;
        const userData = await AadhaarDetails.findOne({ aadhaarNo: aadhaarNo }, 'name dob ');
        if (!userData) return res.status(404).json({ message: "Aadhaar does not exists" });
        const { name, dob } = userData;
        return res.status(200).json({ name: name, position: position, dob: dob });
    } catch (error) {
        console.log("Error in getting police data", error);
        return res.status(500).json({ message: "Server Error." });
    }
})

router.post('/generateOTP', async (req, res) => {
    const { body: { policeId } } = req;
    try {
        const data = await policeDB.findOne({ policeId: policeId });
        if (!data) return res.status(400).json({ message: "Police Id not found." });
        const { aadhaarNo } = data;

        // Finding the old otp and deleting
        await OtpVerificationModal.findOneAndDelete({ aadhaarNo: aadhaarNo });
        const userData = await AadhaarDetails.findOne({ aadhaarNo: aadhaarNo });
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("OTP: ", otp);
        const hashOTP = encrypt.hashPassword(otp);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        const config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        };
        const transporter = nodemailer.createTransport(config);
        const message = {
            from: process.env.EMAIL,
            to: userData.email,
            subject: 'OTP Verification',
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };
        await transporter.sendMail(message);
        await OtpVerificationModal.create({
            aadhaarNo: aadhaarNo,
            otp: hashOTP,
            createdAt: new Date(),
            expiresAt: otpExpiry,
        });
        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.log("Error in generating otp", error);
        return res.status(500).json({ message: "Server Error." });
    }
})

router.post('/verifyOTP', async (req, res) => {
    const { body: { policeId, otp } } = req;
    try {
        const data = await policeDB.findOne({ policeId: policeId });
        if (!data) return res.status(400).json({ message: "Police Id not found." });
        const { aadhaarNo } = data;

        const storedData = await OtpVerificationModal.findOne({ aadhaarNo: aadhaarNo });
        const verifyOTP = encrypt.comparePassword(otp, storedData.otp);
        if (!verifyOTP) return res.status(400).json({ message: "Invalid otp" });
        const currentTime = new Date();
        if (currentTime > storedData.expiresAt) return res.status(400).json({ message: "OTP has expired" });
        req.session.isVerified = true;
        // Delet the otp
        await OtpVerificationModal.findOneAndDelete({ aadhaarNo: aadhaarNo });
        return res.status(200).json({ message: "OTP verification successful.", policeId: policeId });

    } catch (error) {
        console.log("Error in otp verification", error);
        return res.status(500).json({ message: "Server Error." });
    }
})

module.exports = router;