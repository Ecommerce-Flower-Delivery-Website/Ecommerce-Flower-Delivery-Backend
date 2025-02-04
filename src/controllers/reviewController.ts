import { NextFunction, Request, Response } from "express";
import { User, UserType } from "./../models/userModel";
import Review from "./../models/reviewModel";

import {
  validateCreateReviewSchema,
  validateUpdateReviewSchema,
} from "../validation/reviewValidation";
import { sendResponse } from "../utils/sendResponse";
import { CustomRequest } from "@/types/customRequest";

export const createReview = async (
  req: Request & { user?: UserType & { _id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    await validateCreateReviewSchema.parseAsync(req.body);

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
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query : { [key: string]: RegExp } = req.queryFilter ?? {};
    const totalReviews = await Review.countDocuments(query);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || totalReviews;
    const skip = (page - 1) * limit;

    const reviews = await Review.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalReviews / limit);
    

    return sendResponse(res, 200, {
      status: "success",
      data: {
        reviews,
        pagination: {
          totalReviews,
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

export const editReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await validateUpdateReviewSchema.parseAsync(req.body);

    const findReview = await Review.findById(id);
    if (!findReview) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Review not found",
      });
    }

    findReview.name = req.body.name;
    findReview.text = req.body.text;

    const updatedReview = await findReview.save();

    return sendResponse(res, 201, {
      status: "success",
      data: updatedReview,
      
    });
  } catch (error) {
    next(error);
  }
};
