import mongoose from 'mongoose';

const MONGO_URI = "mongodb://localhost:27017/typestrike_test";

// Global connection variable
let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return mongoose.connection;
    }

    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('Connected to MongoDB with Mongoose');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
