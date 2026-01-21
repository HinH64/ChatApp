import mongoose from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Connect to MongoDB: ", error.message);
    }
  }
};

export default connectToMongoDB;
