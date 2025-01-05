import { NextFunction, Request, Response } from "express";
import { User, UserType } from "./../models/userModel";
import Review from "./../models/reviewModel";

import { validateCreateReviewSchema, validateUpdateReviewSchema } from "../validation/reviewValidation";
import { sendResponse } from "../utils/helpers";

export const createReview = async (
    req: Request & { user?: UserType & { _id: string } },
    res: Response,
    next: NextFunction
) => {
    try {
        await validateCreateReviewSchema.parseAsync(req.body);

        const user = await User.findById(req.user?._id);
        if (!user) {
            return sendResponse(res, 404, {
                status: "fail",
                message: "user not found",
            });
        }

        const user_id = user._id;
        req.body = { ...req.body, user_id: user_id };

        const ReviewData = await Review.create(req.body);

        return sendResponse(res, 201, {
            status: "success",
            data: ReviewData,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (
    req: Request & { user?: UserType & { _id: string } },
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;

        const findReview = await Review.findById(id);

        if (!findReview) {
            return sendResponse(res, 404, {
                status: "fail",
                message: "Review Plan not found",
            });
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return sendResponse(res, 404, {
                status: "fail",
                message: "user not found",
            });
        }

        if (findReview.user_id.toString() !== user._id.toString()) {
            return sendResponse(res, 403, {
                status: "fail",
                message: "User is not authorized to access this Review",
            });
        }

        await Review.findByIdAndDelete(id);
        return sendResponse(res, 200, {
            status: "success",
            data: "Delete Review is successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Reviews = await Review.find().populate({
            path: "users_id",
            select: "-password",
        });

        return sendResponse(res, 200, {
            status: "success",
            data: Reviews, //the result will be as : data.data only
        });
    } catch (error) {
        next(error);
    }
};


export const editReview = async (req: Request , res: Response,next:NextFunction)=>{

  try{
const id = req.params.id;

  await validateUpdateReviewSchema.parseAsync(
  req.body
);

    const findReview = await Review.findById(id);
        if (!findReview) {
          return sendResponse(res, 404, {
            status: "fail",
            message: 'Review not found'
          });
    }


      findReview.name =  req.body.name;
      findReview.text =  req.body.text;
      findReview.shouldShow =  req.body.shouldShow;

      const updatedReview= await findReview.save();

        return sendResponse(res, 201, {
          status: "success",
          data: updatedReview
        });

  } 
  catch(error){

    next(error)
  }


}

