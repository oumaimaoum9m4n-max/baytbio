// import mongoose from "mongoose";
// let isConnected = false;
// const connectMongoose = async () => {
//   if (!isConnected) {
//     await mongoose.connect(process.env.MONGO_URL!);
//     isConnected = true;
//   }
// };

// export default connectMongoose;
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB connecté");
  } catch (error) {
    console.error(error);
  }
}