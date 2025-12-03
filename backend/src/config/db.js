import mongoose from "mongoose";

const dbConnect = ()=>{
   try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URL;
    if (!uri) {
      console.error('MongoDB connection string missing. Set MONGODB_URI or MONGO_URL in environment.');
      return;
    }
    mongoose.connect(uri)
    console.log("Database Connected")
   } catch (error) {
     console.log("Error in db connnection",error)
   }
}

export default dbConnect