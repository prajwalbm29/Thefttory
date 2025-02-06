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
const CellPhoneComplaint = require('../Databases/cellPhoneComplaintModal');
const Allotment = require('../Databases/allotComplaints');

router.get('/', (req, res) => {
    res.send('Hello Admin');
});

router.post('/signup', async (req, res) => {
    const { body: { aadhaarNo, password } } = req;
    try {
        const data = await AadhaarDetails.findOne({ aadhaarNo: aadhaarNo });
        if (!data) return res.status(400).json({ message: "Aadhaar Number does not exists." });
        await AdminDB.create({
            aadhaarNo,
            password
        })
        return res.status(201).json({ message: "Admin registered successfully.", aadhaarNo: aadhaarNo })
    } catch (error) {
        console.log("Error in admin registration : ", error);
        return res.status(500).json({ message: "Server Error." });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Ivalid credentials" });
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

router.post('/generateOTP', async (req, res) => {
    // if (!req.session.isLogged) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }
    const { body: { aadhaarNo } } = req;
    try {
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
        console.error('Error in generating OTP:', error.message);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

router.post('/verifyOTP', async (req, res) => {
    const { body: { aadhaarNo, otp } } = req;
    // if (!req.session.isLogged) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }
    try {
        const storedData = await OtpVerificationModal.findOne({ aadhaarNo: aadhaarNo });
        const verifyOTP = encrypt.comparePassword(otp, storedData.otp);
        if (!verifyOTP) return res.status(400).json({ message: "Invalid otp" });
        const currentTime = new Date();
        if (currentTime > storedData.expiresAt) return res.status(400).json({ message: "OTP has expired" });
        req.session.isVerified = true;
        // Delet the otp
        await OtpVerificationModal.findOneAndDelete({ aadhaarNo: aadhaarNo });
        return res.status(200).json({ message: "OTP verification successful.", aadhaarNo: aadhaarNo, isVerified: true });
    } catch (error) {
        console.error('Error in verifying OTP:', error.message);
        res.status(500).json({ error: 'Failed to verify OTP.' });
    }
})

router.get('/getPolice', async (req, res) => {
    // if (!req.session.isVerified) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    try {
        const policeData = await policeDB.find({}, 'policeId position stationAddress hasAccess');
        return res.status(200).json(policeData);
    } catch (error) {
        console.log("Error in getPolice : ", error);
        return res.status(500).json({ error: "Unable to get the police details" });
    }
})

router.post('/allowAccess', async (req, res) => {
    const { body: { policeId } } = req;

    try {
        // Update all matching policeId documents
        const result = await policeDB.updateOne(
            { policeId: policeId },
            { hasAccess: true }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No matching policeId records found.' });
        }

        return res.status(200).json({ message: 'Access updated successfully.' });
    } catch (error) {
        console.error('Error updating police access:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
})

router.post('/declineAccess', async (req, res) => {
    const { body: { policeId } } = req;

    try {
        // Update all matching policeId documents
        const result = await policeDB.updateOne(
            { policeId: policeId },
            { hasAccess: false }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No matching policeId records found.' });
        }

        return res.status(200).json({ message: 'Access updated successfully.' });
    } catch (error) {
        console.error('Error updating police access:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
})

router.get('/getComplaints/:id?', async (req, res) => {
    const { id } = req.params;

    try {
        if (id) {
            console.log("Police Id ", id);
            const data = await Allotment.findOne({ policeId: id });
            if (!data) return res.status(200).json([]);
            return res.status(200).json(data.complaintId);
        } else {
            const complaints = await CellPhoneComplaint.find({}, "lostLocation lostDate complaintDate status");
            return res.status(200).json(complaints);
        }
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return res.status(500).json({ message: 'Server error' });
    }
})

router.post('/allotComplaint', async (req, res) => {
    const { body: { policeId, complaintId } } = req;
    try {
        const data = await Allotment.findOne({ policeId });
        if (!data) {
            await Allotment.create({
                policeId: policeId,
                complaintId: [complaintId]
            })
            return res.sendStatus(200);
        }
        data.complaintId.push(complaintId);
        await data.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log("Error in allot complaint ", error);
        return res.status(500).json({ message: "Server Error." });
    }
})

router.post('/removeAllotment', async (req, res) => {
    const { policeId, complaintId } = req.body;

    try {
        const data = await Allotment.findOne({ policeId });
        if (!data) {
            return res.status(404).json({ message: 'Police officer not found or no complaints assigned.' });
        }

        data.complaintId.pull(complaintId);

        await data.save();

        return res.status(200).json({ message: 'Complaint removed successfully.' });
    } catch (error) {
        console.log("Error in remove complaint ", error);
        return res.status(500).json({ message: 'Server Error.' });
    }
});


module.exports = router;
