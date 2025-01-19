import { UserType } from "@/models/userModel";
import { Request } from "express";

export type CustomRequest = Request & {
  queryFilter?: { [key: string]: RegExp };
  user?: UserType;
};