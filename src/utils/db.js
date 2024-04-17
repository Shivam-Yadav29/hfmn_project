import mongoose from "mongoose";

const connetToDb = async () => {
    // if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("MongoDB connected successfully!");
        });
    } catch {
        throw new Error("Error connecting to database")
    }
}

export default connetToDb;