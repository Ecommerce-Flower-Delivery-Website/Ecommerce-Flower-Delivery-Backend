import GiftDiscount from "./../models/giftDiscountModel";
import { NextFunction, Request, Response } from "express";
import { validateIdSchema } from "@/utils/databaseHelpers";
import { sendResponse } from "@/utils/helpers";
import {
  addGiftDiscountValidation,
  updateGiftDiscountValidation,
} from "@/validation/giftDiscountValidation";
import z from "zod";
import { CustomRequest } from "@/types/customRequest";

//this is useful for front end
//when user enter codeGift you can send request and know what is document match this code
const getByCodeGift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await z.string().parseAsync(req.params.code as string);

    const giftDiscount = await GiftDiscount.findOne({
      codeGift: req.params.code,
    });
    if (!giftDiscount) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "gift discount is not found",
      });
    }

    sendResponse(res, 200, {
      status: "success",
      data: {
        giftDiscount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const addGiftDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { codeGift, discountGift } = req.body;
    await addGiftDiscountValidation.parseAsync({ codeGift, discountGift });

    const giftDiscount = await GiftDiscount.create({
      codeGift,
      discountGift,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        giftDiscount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateGiftDiscountById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validateIdSchema("gift discount id is not valid").parseAsync(
      req.params.id
    );

    const { codeGift, discountGift } = req.body;
    await updateGiftDiscountValidation.parseAsync({
      codeGift,
      discountGift,
    });

    const giftDiscount = await GiftDiscount.findById(req.params.id);
    if (!giftDiscount) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "gift discount is not found",
      });
    }

    giftDiscount.codeGift = codeGift ?? giftDiscount.codeGift;
    giftDiscount.discountGift = discountGift ?? giftDiscount.discountGift;

    await giftDiscount.save();

    sendResponse(res, 200, {
      status: "success",
      data: {
        giftDiscount,
      },
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
};

const removeGiftDiscountById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validateIdSchema("gift discount id is not valid").parseAsync(
      req.params.id
    );
    const giftDiscount = await GiftDiscount.findByIdAndDelete(req.params.id);
    if (!giftDiscount) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "gift discount is not found",
      });
    }

    sendResponse(res, 200, {
      status: "success",
      data: "the gift discount deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getAllGiftDiscounts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query : { [key: string]: RegExp } = req.queryFilter ?? {};

    const giftDiscounts = await GiftDiscount.find(query).skip(skip).limit(limit);
    const totalGiftDiscounts = await GiftDiscount.countDocuments();
    const totalPages = Math.ceil(totalGiftDiscounts / limit);

    sendResponse(res, 200, {
      status: "success",
      data: {
        giftDiscounts,
        pagination: {
          totalGiftDiscounts,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  addGiftDiscount,
  updateGiftDiscountById,
  removeGiftDiscountById,
  getAllGiftDiscounts,
  getByCodeGift,
};
