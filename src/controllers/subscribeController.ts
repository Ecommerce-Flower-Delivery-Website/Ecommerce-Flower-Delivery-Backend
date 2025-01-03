import { Request, Response } from "express";
import { UserType } from "@/models/userModel";
import mongoose from "mongoose";

import Subscribe from "./../models/subscribeModel";
import { validateCreateSubscribeSchema } from "../validation/subscribeValidation";
import { sendResponse } from "../utils/helpers";



export const createSubscribePlan = async (req: Request & { user?: UserType }, res: Response)=>{

    const image = req.file?.filename;
    if(image){
      req.body = {...req.body, image:`/public/upload/images/subscribe-plans/${image}`}
    }else{
      req.body = {...req.body, image:''}
    }


      const { success, error, data } = await validateCreateSubscribeSchema.safeParseAsync(
        req.body
      );

      if (success) {

        const subscribePlan = await Subscribe.create(data);
        return sendResponse(res, 201, {
          status: "success",
          data:subscribePlan
        });
        }


      if (error) {
        return sendResponse(res, 400, {
          status: "error",
          message: 'Invalid request data',
          error: error.errors.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          })),

        });
      }



}

export const deleteSubscribePlan = async (req: Request & { user?: UserType }, res: Response)=>{
  
  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return sendResponse(res, 404, {
      status: "fail",
      message: 'Invalid subscribe plan id'
    });
    }

    const findSubscribePlan = await Subscribe.findById(id);
        if (!findSubscribePlan) {
          return sendResponse(res, 404, {
            status: "fail",
            message: 'Subscribe Plan not found'
          });
        }
        
        await Subscribe.findByIdAndDelete(id);
        return sendResponse(res, 200, {
          status: "success",
          data:"Delete Subscibe Plan is successfully"
        });

}

export const getSubscribePlans = async (req : Request, res: Response) => {

  try{
    const subscribePlans = await Subscribe.find()
    .populate({
      path: "users_id",
      select: "-password",
    });
  
    return sendResponse(res, 404, {
      status: "success",
      data: {
        subscribePlans,
    },
    });
  }catch{
    sendResponse(res, 500, {
      status: "error",
      message: "Failed to fetch orders",
      error: "Database error",
    });
  }
  
  

};

export const editSubscribePlan = async (req: Request & { user?: UserType }, res: Response)=>{

  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return sendResponse(res, 404, {
      status: "fail",
      message: 'Invalid subscribe plan id'
    });
    }

    const findSubscribePlan = await Subscribe.findById(id);
        if (!findSubscribePlan) {
          return sendResponse(res, 404, {
            status: "fail",
            message: 'Subscribe Plan not found'
          });
    }

  const image = req.file?.filename;
  if(image){
    req.body = {...req.body, image:`/public/upload/images/subscribe-plans/${image}`}
  }else{
    req.body = {...req.body, image:''}
  }


    const { success, error, data } = await validateCreateSubscribeSchema.safeParseAsync(
      req.body
    );

    if (success) {

      findSubscribePlan.title = data.title;
      findSubscribePlan.price = data.price;
      findSubscribePlan.deliveryCount = data.deliveryCount;
      findSubscribePlan.deliveryFrequency = data.deliveryFrequency;
      findSubscribePlan.isFreeDelivery = data.isFreeDelivery;
      findSubscribePlan.discount = data.discount;

      findSubscribePlan.features = data.features;
      findSubscribePlan.image =  `/public/upload/images/subscribe-plans/${data.image}`;


      const updatedSubscribePlan= await findSubscribePlan.save();

        return sendResponse(res, 201, {
          status: "success",
          data: updatedSubscribePlan
        });

      }


    if (error) {
      return sendResponse(res, 400, {
        status: "error",
        message: 'Invalid request data',
        error: error.errors.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        })),

      });
    }

}
