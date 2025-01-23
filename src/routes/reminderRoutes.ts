import { authMiddleware } from './../middleware/authMiddleware';
import express from "express";
import reminderController from "./../controllers/reminderController";
import { adminAuthMiddleware } from '@/middleware/adminAuthMiddleware';

const router = express.Router();
    
router.route("/")
    .get( reminderController.getReminders)
    .post(authMiddleware, reminderController.addReminder)
    .delete(adminAuthMiddleware, reminderController.removeReminder)

router.route("/send-email")
    .post(adminAuthMiddleware, reminderController.sendEmail)


export default router;
