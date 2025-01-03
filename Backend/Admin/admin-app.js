const router = require('express').Router();
const { checkSchema, validationResult, matchedData } = require('express-validator');
const AdminDB = require('../Databases/Admin');
const passport = require('passport');
const AdminValidation = require('./Admin-validation-Encryption/validation');
const hashPassword = require('./Admin-validation-Encryption/encription');
require("./Authentication/passport-local");

router.get('/', (req, res) => {
    return res.send('Hello Admin');
});

router.post('/signup', checkSchema(AdminValidation), async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(400).json({ Error: validationError.array() });
    }

    try {
        const newAdmin = matchedData(req);

        // Check for duplicate fields
        const duplicatedField = await AdminDB.findOne({
            $or: [
                { email: newAdmin.email },
                { aadhaar: newAdmin.aadhaar },
                { phone: newAdmin.phone }
            ]
        });

        if (duplicatedField) {
            return res.status(400).json({
                Error: 'Some details already exist. Please use unique email, Aadhaar, or phone number.'
            });
        }

        // Encrypt password and create the admin
        newAdmin.password = hashPassword(newAdmin.password);
        const createdAdmin = await AdminDB.create(newAdmin);

        console.log('Admin created successfully:', createdAdmin);
        return res.status(201).json({ Message: 'Admin account created successfully!' });
    } catch (error) {
        console.error(`Error in /Admin/admin-app: ${error.message}`);
        return res.status(500).json({ Error: 'Server Error..!' });
    }
});


router.post('/login',passport.authenticate("local"), (req, res) => {
    const { admin } = req;
    if (!admin) return res.status(404).json({message: "Admin not found..!"});

    return res.status(200).json({
        message: "Admin login successful..!",
        aadhaar: admin.aadhaar,
    })
})

module.exports = router;
