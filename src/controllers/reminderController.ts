import { NextFunction, Request, Response } from "express";
import { sendResponse } from "@/utils/helpers";
import Reminder from "./../models/reminderModel";
import { User, UserType } from "@/models/userModel";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "97984da651af3d",
    pass: "adf12721817edf",
  },
});

const ReminderController = {
  async addReminder(
    req: Request & { user?: UserType & { _id: string } },
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "user not found",
        });
      }
      user.isReminder = true;
      await user.save();
      sendResponse(res, 200, { status: "success", data: "" });
    } catch (err) {
      next(err);
    }
  },
  async getReminders(
    req: Request & { user?: UserType & { _id: string } },
    res: Response,
    next: NextFunction
  ) {
    const reminderUsers = await User.find({ isReminder: true }).select(
      "-password"
    );
    if (!reminderUsers) {
      sendResponse(res, 404, { status: "fail", message: "user not found" });
    }
    sendResponse(res, 200, { status: "success", data: reminderUsers });
  },
  async removeReminder(
    req: Request & { user?: UserType & { _id: string } },
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "user not found",
        });
      }
      user.isReminder = false;
      await user.save();
      sendResponse(res, 200, { status: "success", data: "" });
    } catch (err) {
      next(err);
    }
  },
  async sendEmail(req: Request, res: Response, next: NextFunction) {
    const { to, subject, text, festivalName, festivalDate } = req.body;
    if (!to || !subject || !text || !festivalDate || !festivalName) {
      sendResponse(res, 404, {
        status: "fail",
        message: "please provide a valid data",
      });
    }
    try {
      const customText = `
        Dear Customer,

        We are excited to inform you about the upcoming festival: ${festivalName}.
        Date: ${festivalDate}.

        ${text}

        Best regards,
        Flower Delivery Team
        `;
      const mailOptions = {
        from: "FlowerDelivery@company.com",
        to,
        subject,
        text: customText,
      };

      const message = await Reminder.create({
        text,
        festivalName,
        festivalDate,
      });

      const info = await transport.sendMail(mailOptions);

      sendResponse(res, 200, { status: "success", data: "" });
    } catch (error) {
      next(error);
    }
  },
};

export default ReminderController;
