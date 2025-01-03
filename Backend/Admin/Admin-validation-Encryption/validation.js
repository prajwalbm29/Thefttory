const { isEmail } = require('validator');

const AdminValidation = {
    aadhaar: {
        validate: (value) => {
            const aadhaarRegex = /^\d{12}$/; // Ensures exactly 12 digits
            return aadhaarRegex.test(value);
        },
        message: 'Invalid Aadhaar number! Aadhaar must be a 12-digit numeric value.'
    },
    email: {
        validate: (value) => {
            return isEmail(value); // Using validator's isEmail function
        },
        message: 'Enter the correct email format'
    },
    phone: {
        validate: (value) => {
            const phoneRegex = /^\d{10}$/; // Ensures exactly 10 digits
            return phoneRegex.test(value);
        },
        message: 'Invalid Phone Number..! Phone number should be 10 digits'
    },
    password: {
        validate: (value) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(value);
        },
        message: 'Password should be strong',
        required: true
    }
};

module.exports = AdminValidation;
