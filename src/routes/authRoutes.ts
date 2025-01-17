import express from "express";
import * as authController from "./../controllers/authController";

const authRouter = express.Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/login_admin", authController.login_admin);
authRouter.post("/verify_compare", authController.compareVerificationCode);
authRouter.post("/resend_verify_code", authController.resendCode);

authRouter.post("/forgot_password", authController.forgotPassword);


export default authRouter;
