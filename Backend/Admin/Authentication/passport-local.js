const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AdminDB = require('../../Databases/Admin');
const encrypt = require('../../encryption/encription');

passport.serializeUser((user, done) => {
    console.log("Serializing the admin : ", user);
    done(null, user.aadhaarNo);
})

passport.deserializeUser(async (aadhaarNo, done) => {
    console.log("Deserialzing admin : ", aadhaarNo);
    try {
        const user = await AdminDB.findOne({ aadhaarNo: aadhaarNo });
        console.log("User in Desrialization : ", user);
        if (!user) throw new Error("Unauthorized Admin");
        done(null, user);
    } catch (error) {
        done(error, null);
    }
})

passport.use(
    new LocalStrategy(
        { usernameField: "aadhaarNo", passwordField: "password" },
        async (username, password, done) => {
            console.log("Inside Verification : ");
            console.log("AadhaarNo: ", username);
            console.log("Password : ", password);
            try {
                const user = await AdminDB.findOne({ aadhaarNo: username });
                if (!user) throw new Error("Admin does not exists");
                const comPass = encrypt.comparePassword(password, user.password);
                if (!comPass) throw new Error("Invalid credentials");
                done(null, user);
            } catch (error) {
                console.log("Error in passport : ", error);
                done(error, null);
            }
        }
    )
);

module.exports = passport;
