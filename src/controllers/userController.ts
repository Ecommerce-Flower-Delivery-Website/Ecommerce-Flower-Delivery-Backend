import { NextFunction, Request, Response } from "express";
import User from "./../models/userModel";
import { sendResponse } from "@/utils/sendResponse";
import { userUpdateSchema } from "@/validation/userValidation";
import { CustomRequest } from "@/types/customRequest";
import contactModel from "@/models/contactModel";
import mongoose from "mongoose";

const getUsers = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const query : { [key: string]: RegExp } = req.queryFilter ?? {};
    const totalUsers = await User.countDocuments(query);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || totalUsers;
    const skip = (page - 1) * limit;

    const users = await User.find(query).select("-password").skip(skip).limit(limit);

    console.log("new", page);
    

    const totalPages = Math.ceil(totalUsers / limit);

    sendResponse(res, 200, {
      status: "success",
      data: {
        users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
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

    //remove it from contact if you have document with isChesked: false
    await contactModel.deleteOne({
      user_id: userId,
      isChecked: false
    })    
    
    await User.findByIdAndDelete(userId);
    sendResponse(res, 200, { status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export default { getUsers, getUser, deleteUser, updateUser };
