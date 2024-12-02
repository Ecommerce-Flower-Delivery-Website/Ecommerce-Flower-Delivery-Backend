import { Request, Response } from "express";
import { createToken } from "../lib/jwt";
import { validateSchemas } from "../lib/zod";
import { User } from "../models/userModel";

export const register = async (req: Request, res: Response) => {
  const { success, error, data } = await validateSchemas.signup.safeParseAsync(
    req.body
  );
  if (error) {
    res.status(400).json({
      message: error.errors[0].message,
      user: null,
      token: null,
    });
    return;
  }
  if (success) {
    const existedUser = await User.findOne({
      email: data.email,
    });

    if (existedUser) {
      res.status(400).json({
        message: "User already exists",
        user: null,
        token: null,
      });
      return;
    }

    const user = await User.create({ ...data, isAdmin: false });
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    res.status(200).json({
      message: "Signed up successfully",
      token,
      user: await user.toFrontend(),
    });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { success, error, data } = await validateSchemas.login.safeParseAsync(
    req.body
  );
  if (error) {
    res.status(400).json({
      message: error.errors[0].message,
      user: null,
      token: null,
    });
    return;
  }
  if (success) {
    const user = await User.findOne({
      email: data.email,
    });
    if (!user) {
      res
        .status(404)
        .json({ message: "User doesn't exists", user: null, token: null });
      return;
    }
    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      res.status(401).json({
        message: "invalid user name or password",
        user: null,
        token: null,
      });
      return;
    }
    const token = createToken({
      id: user._id,
      email: user.email,
    });
    res.status(200).json({
      message: "login successfully",
      token,
      user: await user.toFrontend(),
    });
  }
};
export const login_admin = async (req: Request, res: Response) => {
  const { success, error, data } = await validateSchemas.login.safeParseAsync(
    req.body
  );
  if (error) {
    res.status(400).json({
      message: error.errors[0].message,
      user: null,
      token: null,
    });
    return;
  }
  if (success) {
    const user = await User.findOne({
      email: data.email,
      isAdmin: true,
    });
    if (!user) {
      res
        .status(404)
        .json({ message: "User doesn't exists", user: null, token: null });
      return;
    }
    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      res.status(401).json({
        message: "invalid credential",
      });
      return;
    }
    const token = createToken({
      id: user._id,
      email: user.email,
    });
    res.status(200).json({
      message: "login successfully",
      token,
      user: await user.toFrontend(),
    });
  }
};
