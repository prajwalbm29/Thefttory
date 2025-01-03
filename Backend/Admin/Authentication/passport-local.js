const passport = require('passport')
const Localstrategy = require('passport-local')
const AdminDB = require('../../Databases/Admin')
const comparePassword = require('../Admin-validation-Encryption/encription')

passport.serializeUser((user, done) => {
    console.log("Serialization of admin : ", user._id);
    done(null, user._id);
})

passport.deserializeUser(async (_id, done) => {
    console.log("Deserialization of the user : ", _id);
    try {
        const findAdmin = await AdminDB.findById(_id);
        if (!findAdmin) throw new Error("Unauthorized..!");
        done(null, findAdmin);
    } catch (error) {
        console.log("Error in deserialization : ", error);
        done(error, null);
    }
})

module.exports = passport.use(
    new Localstrategy(
        {usernameField: "aadhaar", passwordField: "password"},
        async (aadhaar, password, done) => {
            try {
                console.log("Inside passport");
                const findAdmin = await AdminDB.findOne({aadhaar});
                if (!findAdmin) throw new Error("Admin not found..!");
                if (!comparePassword(password, findAdmin.password)) throw new Error("Invalid credentials..!");
                done(null, findAdmin);
            } catch (error) {
                console.log("Error in local strategy : ", error);
                done(error, null);
            }
        }
    )
)