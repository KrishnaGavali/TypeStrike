import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
console.log(process.env.MONGO_URI);
const MONGO_URI = process.env.MONGO_URI;

// Global connection variable
let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return mongoose.connection;
    }

    try {
        await mongoose.connect(MONGO_URI,
            { dbName: "typeStrikeDB" }
        );
        isConnected = true;
        console.log('Connected to MongoDB with Mongoose');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
