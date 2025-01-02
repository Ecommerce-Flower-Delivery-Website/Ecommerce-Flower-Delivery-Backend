import { authMiddleware } from './../middleware/authMiddleware';
import express from "express";
const reminderController = require("./../controllers/reminderController");

const router = express.Router();

router.route("/")
      .get(authMiddleware, reminderController.getReminders)
      .post(authMiddleware, reminderController.addReminder)
      .delete(authMiddleware, reminderController.removeReminder)

router.route("/send-email")
      .post(authMiddleware, reminderController.sendEmail)

export default router;
