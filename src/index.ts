import dotenv from "dotenv";
import mongoose from "mongoose";
import initSuperAdmin from "../src/utils/initAdmin";
import app from "./app";
import { Server } from "http";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!");
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
  } else {
    console.log(err);
  }
  console.log("Shutting down...");

  if (myServer) {
    myServer.close(() => {
      process.exit(1);
    });
  }
});

dotenv.config();

const PORT = process.env.PORT;

let myServer : Server | undefined;

mongoose
   .connect(process.env.DATABASE as string)
  // .connect("mongodb://localhost:27017/EcommerceFlowerDeliveryWebsite")
  .then(async () => {
    console.log("Connected to MongoDB");
    // seeding();
    await initSuperAdmin();

   myServer = app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));


process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
  } else {
    console.log(err);
  }
  console.log("Shutting down...");

  if (myServer) {
    myServer.close(() => {
      process.exit(1);
    });
  }
});
