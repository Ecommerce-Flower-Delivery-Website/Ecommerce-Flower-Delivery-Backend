import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";

import app from "./app";
dotenv.config();

//? Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

//? MongoDB Connection
const PORT = process.env.PORT;
mongoose
  .connect(process.env.DATABASE!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//? Global Error Handling Middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong, try again later",
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
