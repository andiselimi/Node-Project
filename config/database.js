import mongoose from "mongoose"

const connectDB = async() => {
    try {
        const connectionString = process.env.MONGODB_URI;
        await mongoose.connect(connectionString);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ Connection Failed:");
        console.error(error.message);
        proccess.exit(1);
    };
};

export default connectDB;