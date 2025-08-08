import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

// Load environment variables before using them
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// Load port and MongoDB URI
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.set("port", PORT);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);

// Start server
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB:", connectionDb.connection.host);

    server.listen(app.get("port"), () => {
      console.log(`Server is running on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

start();
