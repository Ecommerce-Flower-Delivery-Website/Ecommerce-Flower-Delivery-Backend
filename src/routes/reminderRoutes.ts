import { authMiddleware } from './../middleware/authMiddleware';
import express from "express";
import reminderController from "./../controllers/reminderController";
import { adminAuthMiddleware } from '@/middleware/adminAuthMiddleware';

const router = express.Router();

router.route("/")
    .get(reminderController.getReminders)
    .post( reminderController.addReminder)
    .delete( reminderController.removeReminder)

router.route("/send-email")
    .post(reminderController.sendEmail)


export default router;
