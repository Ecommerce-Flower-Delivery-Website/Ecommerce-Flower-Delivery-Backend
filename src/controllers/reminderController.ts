const nodemailer = require("nodemailer");
import { Request, Response } from "express";
import Reminder from "./../models/reminderModel";
import { User } from "../models/userModel";

exports.addReminder = async (req : any, res : Response) => {
    const user = await User.findById(req.user?._id);
    if(!user){
        return res.status(404).json({
            status: "fail",
            message: "User not found",
        });
    };
    user.isReminder = true;
    await user.save();
    return res.json({
        status: "success",
        message: "You are now a subscriber in this feature",
    })
}

exports.getReminders = async (req : Request, res : Response) => {
    const reminderUsers = await User.find({ isReminder: true }).select('-password'); 
    if(!reminderUsers) {
        return res.status(404).json({
            status: "fail",
            message: "No users found",
        });
    }
    return res.json({
        status: "success",
        data: reminderUsers,
    });
}

exports.removeReminder = async (req : any, res : Response) => {
    const user = await User.findById(req.user?._id);
    if(!user){
        return res.status(404).json({
            status: "fail",
            message: "User not found",
        });
    };
    user.isReminder = false;
    await user.save();
    return res.json({
        status: "success",
        message: "You have been removed from this feature",
    })
}


const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "97984da651af3d",
        pass: "adf12721817edf"
    }
});

exports.sendEmail = async (req : Request, res : Response) => {
    const { to, subject, text, festivalName, festivalDate } = req.body;
    if(!to || !subject || !text || !festivalDate || !festivalName){
        return res.status(400).json({
            status: "fail",
            message: "Please provide all required fields",
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
            text : customText,
        };

        const message = await Reminder.create({
            text,
            festivalName,
            festivalDate
        })
    
        const info = await transport.sendMail(mailOptions);
    
        return res.status(200).json({
            status: "success",
             message: "Email sent successfully!" 
        });
    } catch (error) {
        res.status(500).json({ 
            status: "fail",
            message: "Error sending email"
         });
    }
    
}
