const router = require('express').Router();
const AadhaarDetails = require('../Databases/AadhaarDetails');
const encrypt = require('../encryption/encription');
const nodemailer = require('nodemailer');
const OtpVerificationModal = require('../Databases/OtpVerification');

router.post('/generateOTP', async (req, res) => {
    const { body: { aadhaarNo }} = req;
    try {
        const data = await AadhaarDetails.findOne({ aadhaarNo: aadhaarNo });
        const email = data.email;
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
            to: email,
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

        req.session.user = aadhaarNo;

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error in generating OTP:', error.message);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
})

router.post('/verifyOTP', async (req, res) => {
    const { body: {otp}} = req;

    try {
        const aadhaar = req.session.user;
        const storedData = await OtpVerificationModal.findOne({ aadhaarNo: aadhaar });
        
        const verifyOTP = encrypt.comparePassword(otp, storedData.otp);

        if (!verifyOTP) return res.status(400).json({message: "Invalid otp"});

        const currentTime = new Date();

        if (currentTime > storedData.expiresAt) return res.status(400).json({ message: "OTP has expired"});

        req.session.isVerified = true;

        return res.sendStatus(200);
    } catch (error) {
        console.error('Error in verifying OTP:', error.message);
        res.status(500).json({ error: 'Failed to verify OTP.' });
    }
})

module.exports = router;