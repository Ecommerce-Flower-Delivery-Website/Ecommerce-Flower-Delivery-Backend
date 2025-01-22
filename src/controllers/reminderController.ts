import { NextFunction, Request, Response } from "express";
import { sendResponse } from "@/utils/sendResponse";
import Reminder from "./../models/reminderModel";
import { User, UserType } from "@/models/userModel";
import { sendEmail } from "../utils/sendEmail";


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
    try{
      const reminderUsers = await User.find({ isReminder: true }).select(
        "name email phone"
      );
      if (!reminderUsers) {
        return sendResponse(res, 404, { status: "fail", message: "user not found" });
      }
      return sendResponse(res, 200, { status: "success", data: reminderUsers });
    }catch(err){
      next(err);
    }
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
    const { subject, text, festivalName, festivalDate } = req.body;
    const mailList = await User.find({ isReminder: true }).select("email -_id");

    if (!subject || !text || !festivalDate || !festivalName) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Please provide valid data",
      });
    }

    try {
      const customHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Dear Customer,</h2>
      <p>We are excited to inform you about the upcoming festival:</p>
      <h3 style="color: #FF5722;">${festivalName}</h3>
      <p><strong>Date:</strong> ${festivalDate}</p>
      <p>${text}</p>
      <br>
      <p>Best regards,</p>
      <p><strong>Flower Delivery Team</strong></p>
    </div>
  `;

      const promise = mailList.map((mail) => {
          return sendEmail(mail.email,subject,customHtml);
      });

      await Promise.all(promise);

      await Reminder.create({
        text,
        festivalName,
        festivalDate,
      });

      sendResponse(res, 200, {
        status: "success",
        data: "Emails sent successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ReminderController;
