import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;