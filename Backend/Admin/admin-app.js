const router = require('express').Router();
const { checkSchema, validationResult, matchedData } = require('express-validator');
const AdminDB = require('../Databases/Admin');
const passport = require('passport');
const encrypt = require('../encryption/encription');
const AdminValidation = require('./Admin-validation/validation');
require('./Authentication/passport-local');
const AadhaarDetails = require('../Databases/AadhaarDetails');
const nodemailer = require('nodemailer');
const OtpVerificationModal = require('../Databases/OtpVerification');
const policeDB = require('../Databases/PoliceDetails');

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
        const aadhaar = req.session.passport.user;

        // Finding the old otp and deleting
        await OtpVerificationModal.findOneAndDelete({ aadhaarNo: aadhaar });

        const userData = await AadhaarDetails.findOne({ aadhaarNo: aadhaar });

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
            aadhaarNo: aadhaar,
            otp: hashOTP,
            createdAt: new Date(),
            expiresAt: otpExpiry,
        });

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error in generating OTP:', error.message);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

router.post('/verifyOTP', async (req, res) => {
    const { body: {otp}} = req;

    if (!req.session.isLogged) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const aadhaar = req.session.passport.user;
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

router.get('/getPolice', async (req, res) => {
    if (!req.session.isVerified) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const policeData = await policeDB.find({}, 'policeId position stationAddress hasAccess');
        return res.status(200).json(policeData);
    } catch (error) {
        console.log("Error in getPolice : ", error);
        return res.status(500).json({error : "Unable to get the police details"});
    }
})

router.post('/allowAccess', async (req, res) => {
    const { body: {policeId}} = req;
    
    if (!Array.isArray(policeId) || policeId.length === 0) {
        return res.status(400).json({ message: 'Invalid policeId array provided.' });
    }

    try {
        // Update all matching policeId documents
        const result = await policeDB.updateMany(
            { _id: { $in: policeId } },
            { $set: { hasAccess: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No matching policeId records found.' });
        }

        return res.status(200).json({
            message: 'Access updated successfully.',
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error('Error updating police access:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
})

router.post('/declineAccess', async (req, res) => {
    const { body: {policeId}} = req;
    
    if (!Array.isArray(policeId) || policeId.length === 0) {
        return res.status(400).json({ message: 'Invalid policeId array provided.' });
    }

    try {
        // Update all matching policeId documents
        const result = await policeDB.updateMany(
            { _id: { $in: policeId } },
            { $set: { hasAccess: false } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No matching policeId records found.' });
        }

        return res.status(200).json({
            message: 'Access updated successfully.',
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error('Error updating police access:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
})


module.exports = router;
