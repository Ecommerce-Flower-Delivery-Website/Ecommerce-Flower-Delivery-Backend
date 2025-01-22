import cartModel from "@/models/cartModel";
import { User } from "../models/userModel";

async function initSuperAdmin() {
  try {
    const superAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (superAdmin) {
      console.log("Admin user already exists");
    } else {
      const admin = new User({
        name: "super admin",
        email: "admin@gmail.com",
        phone: "0934108130",
        password: "admin123",
        isAdmin: true,
        isAccountVerified: true
      });
      await admin.save();

      await cartModel.create({
         userId: admin._id,
      });

      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error initializing super admin:", error);
  }
}

export default initSuperAdmin;
