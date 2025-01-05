import { authMiddleware } from './../middleware/authMiddleware';
import express from "express";
import reminderController from "./../controllers/reminderController";
import { adminAuthMiddleware } from '@/middleware/adminAuthMiddleware';

const router = express.Router();

router.route("/")
    .get(authMiddleware, reminderController.getReminders)
    .post(authMiddleware,adminAuthMiddleware, reminderController.addReminder)
    .delete(authMiddleware,adminAuthMiddleware, reminderController.removeReminder)

router.route("/send-email")
    .post(authMiddleware,adminAuthMiddleware, reminderController.sendEmail)

export default router;
