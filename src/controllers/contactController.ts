import { UserType } from "@/models/userModel";
import { sendResponse } from "@/utils/helpers";
import { NextFunction, Request, Response } from "express";
import Contact from "./../models/contactModel";

export default {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const isCheckedFilter =
        req.query.isChecked !== undefined
          ? { isChecked: req.query.isChecked === "true" }
          : {};

      const contacts = await Contact.find(isCheckedFilter)
        .skip(skip)
        .limit(limit)
        .populate("user_id");

      const totalContacts = await Contact.countDocuments(isCheckedFilter);
      const totalPages = Math.ceil(totalContacts / limit);

      sendResponse(res, 200, {
        status: "success",
        data: {
          contacts,
          pagination: {
            totalContacts,
            totalPages,
            currentPage: page,
            pageSize: limit,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-expect-error authenticated route
      const user = req.user as UserType & { _id: string };
      const newContact = await Contact.create({ user_id: user._id });
      sendResponse(res, 201, { status: "success", data: newContact });
    } catch (error) {
      next(error);
    }
  },

  toggleCheck: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const updatedContact = await Contact.findById(id);
      if (!updatedContact) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "Contact not found",
        });
      }
      updatedContact.isChecked = !updatedContact.isChecked;
      updatedContact.save();
      sendResponse(res, 200, { status: "success", data: updatedContact });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const deletedContact = await Contact.findByIdAndDelete(id);

      if (!deletedContact) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "Contact not found",
        });
      }

      sendResponse(res, 200, { status: "success", data: null });
    } catch (error) {
      next(error);
    }
  },
};
