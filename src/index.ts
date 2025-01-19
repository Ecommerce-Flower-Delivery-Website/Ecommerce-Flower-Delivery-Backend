import dotenv from "dotenv";
import mongoose from "mongoose";
import initSuperAdmin from "../src/utils/initAdmin";
import app from "./app";
import { seeding } from "./utils/seeding";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!");
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
  } else {
    console.log(err);
  }
  console.log("Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});

dotenv.config();

const PORT = process.env.PORT;

mongoose
  .connect(process.env.DATABASE as string)
  .then(() => {
    console.log("Connected to MongoDB");
    // seeding();
    initSuperAdmin();
  })
  .catch((error) => console.error("MongoDB connection error:", error));

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
  } else {
    console.log(err);
  }
  console.log("Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
