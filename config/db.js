import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Hardcoded MongoDB URI to ensure stable connection
        const MONGO_URI = "mongodb+srv://23521114_db_user:MasB80RaCs9oBB18@cluster0.qzsvxay.mongodb.net/mystere-meal?appName=Cluster0";

        const conn = await mongoose.connect(MONGO_URI);

        console.log(`[INFO] MongoDB Connected: ${conn.connection.host}`);
        console.log(`[INFO] Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error(`[ERROR] Connection failed: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;