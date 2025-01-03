import { NextFunction, Request, Response } from "express";
import User from "./../models/userModel";
import { sendResponse } from "@/utils/helpers";
import { userUpdateSchema } from "@/validation/userValidation";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    sendResponse(res, 200, { status: "success", data: users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User  with ID "${req.params.id}" not found.`,
      });
    }
    sendResponse(res, 200, { status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userUpdateSchema.parseAsync(req.body);

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User  with ID "${userId}" not found.`,
      });
    }

    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.password = req.body.password ?? user.password;
    user.subscribe_id = req.body.subscribe_id ?? user.subscribe_id;

    await user.save();

    sendResponse(res, 200, { status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User  with ID "${userId}" not found.`,
      });
    }

    await User.findByIdAndDelete(userId);
    sendResponse(res, 200, { status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export default { getUsers, getUser, deleteUser, updateUser };
