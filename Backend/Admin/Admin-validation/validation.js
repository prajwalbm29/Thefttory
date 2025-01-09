const AdminValidation = {
    aadhaarNo: {
        isLength: { options: { min: 12, max: 12 }, errorMessage: 'Aadhaar must be exactly 12 digits.' },
        isNumeric: { errorMessage: 'Aadhaar must contain only numbers.' },
    },
    password: {
        isStrongPassword: {
            options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
            errorMessage: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.',
        },
    },
};

module.exports = AdminValidation;
