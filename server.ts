import mongoose from "mongoose";
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXECPTION! Shutting down...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

import app from "./app";

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB connection successful");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
