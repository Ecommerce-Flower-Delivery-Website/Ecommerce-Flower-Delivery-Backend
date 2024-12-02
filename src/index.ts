import dotenv from "dotenv";
import { Request, Response } from "express";
import mongoose from "mongoose";
import app from "./app";
import { User } from "./models/userModel";
async function initSuperAdmin() {
  const superAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (superAdmin) {
    console.log("Admin user already exists");
  } else {
    const admin = new User({
      name: "super admin",
      email: "admin@gmail.com",
      phone: "0934108130 ",
      password: "admin123",
      isAdmin: true,
    });

    await admin.save();
    console.log("Admin user created successfully");
  }
}

dotenv.config();

//? MongoDB Connection
const PORT = process.env.PORT;
mongoose
  .connect(process.env.DATABASE!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

initSuperAdmin();

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
