import { NextFunction, Request, Response } from "express";
import { UserType } from "@/models/userModel";

import Subscribe from "./../models/subscribeModel";
import { validateCreateSubscribeSchema } from "../validation/subscribeValidation";
import { sendResponse } from "../utils/helpers";



export const createSubscribePlan = async (req: Request & { user?: UserType }, res: Response,next:NextFunction)=>{

  try{
    const image = req.file?.filename;
    if(image){
      req.body = {...req.body, image:`/public/upload/images/subscribe-plans/${image}`}
    }else{
      req.body = {...req.body, image:''}
    }


      await validateCreateSubscribeSchema.parseAsync(
        req.body
      );


        const subscribePlan = await Subscribe.create(req.body);
        return sendResponse(res, 201, {
          status: "success",
          data:subscribePlan
        });


      // if (error) {
      //   return sendResponse(res, 400, {
      //     status: "error",
      //     message: 'Invalid request data',
      //     error: error.errors.map((issue) => ({
      //       path: issue.path.join('.'),
      //       message: issue.message
      //     })),

      //   });
      // }
  }catch(error){

    next(error)
  }
    



}

export const deleteSubscribePlan = async (req: Request & { user?: UserType }, res: Response,next:NextFunction)=>{
  
  try{
    const id = req.params.id;
  
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
  }catch(error){
    next(error)
  }
  

}

export const getSubscribePlans = async (req : Request, res: Response,next:NextFunction) => {

  try{
    const subscribePlans = await Subscribe.find()
    .populate({
      path: "users_id",
      select: "-password",
    });
  
    return sendResponse(res, 200, {
      status: "success",
      data: {
        subscribePlans,
    },
    });
  }  
  catch(error){

    next(error)
  }
  
  

};

export const editSubscribePlan = async (req: Request & { user?: UserType }, res: Response,next:NextFunction)=>{

  try{
const id = req.params.id;

const image = req.file?.filename;
if(image){
  req.body = {...req.body, image:`/public/upload/images/subscribe-plans/${image}`}
}else{
  req.body = {...req.body, image:''}
}


  await validateCreateSubscribeSchema.parseAsync(
  req.body
);

    const findSubscribePlan = await Subscribe.findById(id);
        if (!findSubscribePlan) {
          return sendResponse(res, 404, {
            status: "fail",
            message: 'Subscribe Plan not found'
          });
    }


      findSubscribePlan.title =  req.body.title;
      findSubscribePlan.price =  req.body.price;
      findSubscribePlan.deliveryCount =  req.body.deliveryCount;
      findSubscribePlan.deliveryFrequency =  req.body.deliveryFrequency;
      findSubscribePlan.isFreeDelivery =  req.body.isFreeDelivery;
      findSubscribePlan.discount =  req.body.discount;

      findSubscribePlan.features =  req.body.features;
      findSubscribePlan.image =  `/public/upload/images/subscribe-plans/${ req.body.image}`;

      const updatedSubscribePlan= await findSubscribePlan.save();

        return sendResponse(res, 201, {
          status: "success",
          data: updatedSubscribePlan
        });

  } 
  catch(error){

    next(error)
  }


}
