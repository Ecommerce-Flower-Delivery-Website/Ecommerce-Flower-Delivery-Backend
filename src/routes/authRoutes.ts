import express from "express";
import * as authController from "./../controllers/authController";

const authRouter = express.Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/login_admin", authController.login_admin);

export default authRouter;
