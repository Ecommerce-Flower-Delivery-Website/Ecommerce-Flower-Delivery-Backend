import { Request, Response, NextFunction } from "express";
import { createToken } from "../lib/jwt";
import { validateSchemas } from "../validation/userValidation";
import { User } from "../models/userModel";
import { sendResponse } from "@/utils/helpers";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.signup.parseAsync(req.body);

    const user = await User.create({ ...data, isAdmin: false });
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.login.parseAsync(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User doesn't exists`,
      });
    }
    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      return sendResponse(res, 401, {
        status: "fail",
        message: `invalid user name or password`,
      });
    }
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.login.parseAsync(req.body);

    const user = await User.findOne({
      email: data.email,
      isAdmin: true,
    });
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User doesn't exists`,
      });
    }
    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      return sendResponse(res, 401, {
        status: "fail",
        message: `invalid credential`,
      });
    }
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
