import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, Promise: null };

export default async function connectDB() {
    if (cached.conn) return cached.conn; // ✅ Fixed syntax

    if (!cached.Promise) {
        cached.Promise = mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(mongoose => mongoose); // ✅ Fixed arrow function
    }

    try {
        cached.conn = await cached.Promise; // ✅ Fixed property reference
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        cached.conn = null; // Prevents using a failed connection
    }

    return cached.conn;
}
