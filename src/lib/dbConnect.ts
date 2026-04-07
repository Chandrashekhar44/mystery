import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const globalAny: any = globalThis;
globalAny.mongoose = globalAny.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<void> {
  if (globalAny.mongoose.conn) {
    console.log("Already connected to database");
    return;
  }

  if (!globalAny.mongoose.promise) {
    globalAny.mongoose.promise = mongoose
      .connect(process.env.MONGODB_URI || "")
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    globalAny.mongoose.conn = await globalAny.mongoose.promise;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Failed to connect DB", error);
    process.exit(1);
  }
}

export default dbConnect;
