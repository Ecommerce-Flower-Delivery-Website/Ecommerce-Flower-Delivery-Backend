import { Request, Response } from "express";

const globalErrorHandling = (err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong, try again later",
  });
};

export default globalErrorHandling;
