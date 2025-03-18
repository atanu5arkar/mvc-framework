import mongoose from "mongoose";

// Mongo connection string is needed for the DB connection
async function connectDB() {
    try {
        const dbName = 'cs23';
        await mongoose.connect(`${URI}${dbName}`);
        console.log('Connected to MongoDB.');
    } catch (error) {
        console.log('Unable to connect MongoDB!');
    }
}

connectDB();