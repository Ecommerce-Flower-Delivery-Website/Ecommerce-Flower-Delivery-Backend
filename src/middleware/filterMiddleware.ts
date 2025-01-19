import { CustomRequest } from "@/types/customRequest";
import { Request, Response, NextFunction } from "express";

const filterMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const field = req.query.field as string;
      const value = req.query.value as string;
      const query : { [key: string]: RegExp } = {};
  
      if (field && value) {
        query[field] = new RegExp(value, "i");
      }
  
      req.queryFilter = query;
      next();
    } catch (err) {
      next(err);
    }
  };

export default filterMiddleware;
  