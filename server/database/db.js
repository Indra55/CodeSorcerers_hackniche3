require('dotenv').config();
const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is not defined. Check your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ Connected to DB');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

// ✅ Fix incorrect export
module.exports = { connectToDB };
