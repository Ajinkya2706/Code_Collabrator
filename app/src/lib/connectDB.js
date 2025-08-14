import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Validate DB_NAME
if (!DB_NAME || /[\\/\. "$*<>:|?]/.test(DB_NAME)) {
  console.error(
    `Invalid DB_NAME: '${DB_NAME}'. It must not be empty and cannot contain /, \\, ., space, ", $, *, <, >, :, |, or ?`
  );
  throw new Error(
    `Invalid DB_NAME: '${DB_NAME}'. It must not be empty and cannot contain /, \\, ., space, ", $, *, <, >, :, |, or ?`
  );
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Ensure no trailing slash in MONGO_URI
    const baseUri = MONGO_URI.endsWith("/") ? MONGO_URI.slice(0, -1) : MONGO_URI;
    const mongoUriWithDb = `${baseUri}/${DB_NAME}`;
    cached.promise = mongoose.connect(mongoUriWithDb).then((mongoose) => {
      console.log(
        `Connected to MongoDB database: ${DB_NAME} in ${process.env.NODE_ENV} mode`
      );
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
