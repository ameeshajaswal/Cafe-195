import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;

  if (!connectionPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be configured");
    }

    // Concurrent cold requests share one attempt; warm requests reuse the pool.
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    }).then((connection) => {
      console.log("✅ MongoDB Connected Successfully");
      return connection;
    }).finally(() => {
      // A failed attempt must not prevent a later request from retrying.
      connectionPromise = undefined;
    });
  }

  return connectionPromise;
};

export default connectDB;
