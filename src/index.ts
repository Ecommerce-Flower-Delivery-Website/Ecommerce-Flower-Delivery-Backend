import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import initSuperAdmin from "../src/utils/initAdmin";
import { Server } from "http";

dotenv.config();

let server: Server | undefined;
const PORT = process.env.PORT;

mongoose
  .connect(process.env.DATABASE!)
  .then(() => {
    console.log("Connected to MongoDB");

    initSuperAdmin();

    server = app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
