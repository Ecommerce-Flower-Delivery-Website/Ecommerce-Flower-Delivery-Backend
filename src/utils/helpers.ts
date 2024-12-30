import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  status: "success" | "fail" | "error",
  data: any
) => {
  res.status(statusCode).json({ status, data });
};
