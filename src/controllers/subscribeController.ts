import { NextFunction, Request, Response } from "express";
import { User, UserType } from "@/models/userModel";

import Subscribe from "./../models/subscribeModel";
import {
  validateCreateSubscribeSchema,
  validateCreateUserForSubscribeSchema,
  validateUpdateSubscribeSchema,
} from "../validation/subscribeValidation";
import { sendResponse } from "../utils/sendResponse";
import mongoose, { Document } from "mongoose";
import { CustomRequest } from "@/types/customRequest";

export const createSubscribePlan = async (
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
) => {
  try {
    const image = req.file?.filename;
    if (image) {
      req.body = {
        ...req.body,
        image: `/upload/images/subscribe-plans/${image}`,
      };
    } else {
      req.body = { ...req.body, image: "" };
    }

    await validateCreateSubscribeSchema.parseAsync(req.body);

    const subscribePlan = await Subscribe.create(req.body);
    return sendResponse(res, 201, {
      status: "success",
      data: subscribePlan,
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
  } catch (error) {
    next(error);
  }
};

export const deleteSubscribePlan = async (
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const findSubscribePlan = await Subscribe.findById(id);
    if (!findSubscribePlan) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Subscribe Plan not found",
      });
    }

    if (findSubscribePlan?.users_id)
      if (findSubscribePlan?.users_id?.length > 0) {
        for (const userId of findSubscribePlan.users_id) {

          const user_had_of_this_plan = await User.findById(userId?.user);

          if (user_had_of_this_plan) {
            user_had_of_this_plan.subscribe_id = undefined;
            await user_had_of_this_plan.save();
          }
        }
      }

    await Subscribe.findByIdAndDelete(id);
    return sendResponse(res, 200, {
      status: "success",
      data: "Delete Subscibe Plan is successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscribePlans = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query : { [key: string]: RegExp } = req.queryFilter ?? {};
    const totalPlans = await Subscribe.countDocuments(query);

    let page = parseInt(req.query.page as string) || 1;
    if (page === -1) page = 1;

    const limit = parseInt(req.query.limit as string) || totalPlans;
    const skip = (page - 1) * limit;

    const totalPages = Math.ceil(totalPlans / limit);

      const subscribePlans = await Subscribe.find(query)
        .populate({
          path: "users_id.user",
          select: "-password",
        })
        .skip(skip)
        .limit(limit);

      return sendResponse(res, 200, {
        status: "success",
        data: {
          subscribePlans,
          pagination: {
            totalPlans,
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

export const editSubscribePlan = async (
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const image = req.file?.filename;
    if (image) {
      req.body = {
        ...req.body,
        image: `/upload/images/subscribe-plans/${image}`,
      };
    } else {
      req.body = { ...req.body, image: "" };
    }

    await validateUpdateSubscribeSchema.parseAsync(req.body);

    const findSubscribePlan = await Subscribe.findById(id);
    if (!findSubscribePlan) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Subscribe Plan not found",
      });
    }

    findSubscribePlan.title = req.body.title;
    findSubscribePlan.price = req.body.price;
    findSubscribePlan.isFreeDelivery = req.body.isFreeDelivery;
    findSubscribePlan.discount = req.body.discount;

    findSubscribePlan.features = req.body.features;
    findSubscribePlan.image = req.body.image
      ? `/upload/images/subscribe-plans/${req.body.image}`
      : `/upload/images/subscribe-plans/${findSubscribePlan.image}`;

    const updatedSubscribePlan = await findSubscribePlan.save();

    return sendResponse(res, 201, {
      status: "success",
      data: updatedSubscribePlan,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscribePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscribePlan = await Subscribe.findById(req.params.id).populate({
      path: "users_id.user",
      select: "-password",
    });

    if (!subscribePlan) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `Subscribe Plan  with ID "${req.params.id}" not found.`,
      });
    }
    sendResponse(res, 200, { status: "success", data: subscribePlan });
  } catch (error) {
    next(error);
  }
};

export const addUserToPlan = async (
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const data = await validateCreateUserForSubscribeSchema.parseAsync(req.body);

    
    const findSubscribePlan = await Subscribe.findById(id);
    if (!findSubscribePlan) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Subscribe Plan not found",
      });
    }

    const user = req.user as UserType &
      Document & { _id: mongoose.Types.ObjectId };

    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "User not found",
      });
    }

    if (user?.subscribe_id) {
      const isUserExisted = await Subscribe.findById(user.subscribe_id);

      if (isUserExisted) {
        return sendResponse(res, 409, {
          status: "fail",
          message: "User already exists in this plan!",
        });
      }

      //user no have plan yet
    } else {
      if (findSubscribePlan.users_id) {
        findSubscribePlan.users_id.push(
          {
          user:user._id,
          deliveryFrequency:data.deliveryFrequency,
          deliveryCount:data.deliveryCount
          }
        );
        await findSubscribePlan.save();

        user.subscribe_id = findSubscribePlan._id as mongoose.Types.ObjectId;
        await user.save();
      }
    }

    // const subscribePlan = await Subscribe.create(req.body);
    return sendResponse(res, 201, {
      status: "success",
      data: findSubscribePlan,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserfromPlan = async (
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
)=>{

  try{
    const id = req.params.id;

    const findSubscribePlan  = await Subscribe.findById(id) ;
    if (!findSubscribePlan) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Subscribe Plan not found",
      });
    }

    const user = req.user as UserType &
    Document & { _id: mongoose.Types.ObjectId };

  if (!user) {
    return sendResponse(res, 404, {
      status: "fail",
      message: "User not found",
    });
  }

  if(user.subscribe_id?.toString()===findSubscribePlan._id.toString()){

    //user had subsciblePlan
    user.subscribe_id = undefined;
    await user.save();

    // Filter out the user from the users_id array
    if (findSubscribePlan?.users_id)
      if (findSubscribePlan?.users_id?.length > 0) {
    findSubscribePlan.users_id = findSubscribePlan.users_id.filter(
        (userId) => userId?.user.toString() !== user._id.toString()
      );
    
    }

    // Save the updated subscribe plan
    await findSubscribePlan.save();
  }

  return sendResponse(res, 200, {
    status: "success",
    data: "Delete User from Plan is successfully",
  });

  }catch(error){

    next(error);

  }


}