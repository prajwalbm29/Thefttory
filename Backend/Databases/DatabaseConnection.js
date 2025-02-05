const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongodbConnection = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected", mongodbConnection.connection.host)
    } catch (error) {
        console.log("Error in database connection : ", error);
        process.exit(1);
    }
}

module.exports = connectDB