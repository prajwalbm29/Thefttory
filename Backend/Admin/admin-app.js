const router = require('express').Router();
const { checkSchema, validationResult, matchedData } = require('express-validator');
const AdminDB = require('../Databases/Admin');
const passport = require('passport');
const encrypt = require('./Admin-validation-Encryption/encription');
const AdminValidation = require('./Admin-validation-Encryption/validation');
require('./Authentication/passport-local');
const AadhaarDetails = require('../Databases/AadhaarDetails');
const nodemailer = require('nodemailer');
const OtpVerificationModal = require('../Databases/OtpVerification');

router.get('/', (req, res) => {
    res.send('Hello Admin');
});

router.post('/signup', checkSchema(AdminValidation), async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(400).json({ error: validationError.array() });
    }

    try {
        const newAdmin = matchedData(req);

        // Check for duplicate Aadhaar
        const existingAdmin = await AdminDB.findOne({ aadhaarNo: newAdmin.aadhaarNo });
        if (existingAdmin) {
            return res.status(400).json({ error: `Aadhaar ${newAdmin.aadhaarNo} already exists in Admin DB` });
        }

        // Verify Aadhaar in AadhaarDetails
        const aadhaarRecord = await AadhaarDetails.findOne({ aadhaarNo: newAdmin.aadhaarNo });
        if (!aadhaarRecord) {
            return res.status(400).json({ error: 'This Aadhaar does not exist in the database.' });
        }

        // Encrypt password and save admin
        newAdmin.password = encrypt.hashPassword(newAdmin.password);
        const createdAdmin = await AdminDB.create(newAdmin);

        res.status(201).json({ message: 'Admin account created successfully!', admin: createdAdmin });
    } catch (error) {
        console.error(`Error in /signup: ${error.message}`);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Logged in successfully!' });
});

router.get('/loginStatus', (req, res) => {
    if (req.isAuthenticated()) {
        req.session.isLogged = true;
        res.status(200).json({ message: 'Logged in.' });
    } else {
        res.status(401).json({ message: 'Unauthorized Admin' });
    }
});

router.post('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) return res.status(500).json({ error: 'Logout failed.' });
            res.status(200).json({ message: 'Logged out successfully!' });
        });
    } else {
        res.status(401).json({ message: 'Not logged in.' });
    }
});

// Generate OTP and send via email
router.post('/generateOTP', async (req, res) => {
    if (!req.session.isLogged) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
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
            to: req.user.email,
            subject: 'OTP Verification',
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        };

        await transporter.sendMail(message);

        await OtpVerificationModal.create({
            aadhaarNo: req.user.aadhaarNo,
            otp,
            createdAt: new Date(),
            expiresAt: otpExpiry,
        });

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error in generating OTP:', error.message);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

module.exports = router;
