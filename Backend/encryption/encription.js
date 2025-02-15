const bcrypt = require('bcrypt')
const saltRounds = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed)
}

const encrypt = {
    hashPassword,
    comparePassword
}

module.exports = encrypt;