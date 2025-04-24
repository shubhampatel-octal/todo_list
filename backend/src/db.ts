import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("strictQuery", false);

async function startServer() {
  try {
    console.log("connecting...");
    await mongoose.connect(process.env.DATABASE || "");
    console.log("Connection Successful!!");
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
