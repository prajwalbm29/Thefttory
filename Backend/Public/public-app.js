const router = require('express').Router();
const AadhaarDetails = require('../Databases/AadhaarDetails');
const encrypt = require('../encryption/encription');
const nodemailer = require('nodemailer');
const OtpVerificationModal = require('../Databases/OtpVerification');
const CellPhoneComplaint = require('../Databases/cellPhoneComplaintModal');
const { aadhaarNo } = require('../Admin/Admin-validation/validation');

router.post('/generateOTPByPhone', async (req, res) => {
    const { body: { phoneNo } } = req;
    try {
        const data = await AadhaarDetails.findOne({ phoneNo: phoneNo });
        if (!data) return res.status(400).json({ message: "Enter valid Aadhaar Registered Phone Number." });
        const { email, aadhaarNo } = data;
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
        console.log("Error in generating otp by phone", error);
        return res.status(500).json({ message: "Server Error." });
    }
})

router.post('/verifyOTPByPhone', async (req, res) => {
    const { body: { phoneNo, otp } } = req;
    try {
        const { aadhaarNo } = await AadhaarDetails.findOne({ phoneNo: phoneNo });
        const storedData = await OtpVerificationModal.findOne({ aadhaarNo: aadhaarNo });
        const verifyOTP = encrypt.comparePassword(otp, storedData.otp);
        if (!verifyOTP) return res.status(400).json({ message: "Invalid otp" });
        const currentTime = new Date();
        if (currentTime > storedData.expiresAt) return res.status(400).json({ message: "OTP has expired" });
        // Delet the otp
        // await OtpVerificationModal.findOneAndDelete({ aadhaarNo: aadhaarNo });
        return res.status(200).json({ message: "OTP verification successful.", aadhaarNo: aadhaarNo });
    } catch(error) {
        console.log("Error in verify otp by phone", error);
        return res.status(500).json({ message: "Server Error." });
    }
})

router.post('/savePhoneComplaint', async (req, res) => {
    const { formData } = req.body; // Correctly destructure formData

    try {
        // Check if complaint already exists
        const existingComplaint = await CellPhoneComplaint.findOne({ imei: formData.imei });
        if (existingComplaint) {
            return res.status(400).json({ message: "Complaint for this cell phone already registered." });
        }

        // Save new complaint
        const Complaint = await CellPhoneComplaint.create(formData);

        // Fetch Aadhaar details
        const aadhaarDetails = await AadhaarDetails.findOne({ aadhaarNo: formData.aadhaarNo });

        if (!aadhaarDetails) {
            return res.status(404).json({ message: "Aadhaar details not found." });
        }

        const { email, name } = aadhaarDetails; // Correct destructuring

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Email content
        const message = {
            from: process.env.EMAIL,
            to: email, // Fixed incorrect variable
            subject: 'Complaint Registered',
            html: `
                <p><b>Dear ${name}</b>,<br/>
                Your complaint for <b>${formData.brand} ${formData.model}</b> has been registered successfully.<br/>
                You can check the complaint status in the application. Your complaint ID is <b>${Complaint._id}</b>.
                Thank You.</p>
            `,
        };

        // Send email
        await transporter.sendMail(message);

        return res.status(200).json({ message: "Form data submitted successfully." });

    } catch (error) {
        console.error("Error in saving form data:", error);
        return res.status(500).json({ message: "Server Error." });
    }
});


module.exports = router;