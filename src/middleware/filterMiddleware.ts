import { CustomRequest } from "@/types/customRequest";
import { Request, Response, NextFunction } from "express";

const filterMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const field = req.query.field as string | undefined;
      const value = req.query.value as string | undefined;
      const query : { [key: string]: RegExp } = {};

      console.log(req.query);
  
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
  