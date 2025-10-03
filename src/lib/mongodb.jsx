import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        console.log("DB already connected");
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = conn.connections[0].readyState;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Connection Failed:", error);
        throw new Error("Error in MongoDB");
    }
}
