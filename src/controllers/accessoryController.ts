import { NextFunction, Request, Response } from "express";
import Accessory from "../models/accessoryModel"; // Adjust the path based on your project structure
import Product from "./../models/productModel";

import { ZodError } from "zod";
import {
  accessorySchema,
  updateAccessorySchema,
} from "../validation/accessoryValidation";
import { Types } from "mongoose";
import { CustomRequest } from "@/types/customRequest";
import productModel from "@/models/productModel";
import mongoose from "mongoose";
import { access } from "fs";

/**
 * @description Get All Accessories
 * @route /api/v1/accessory
 * @method GET
 * @access private (only admin)
 */

export const getAllAccessoriesController = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const query : { [key: string]: RegExp } = req.queryFilter ?? {};
    const totalAccessories = await Accessory.countDocuments(query);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || totalAccessories;
    const skip = (page - 1) * limit;

    const totalPages = Math.ceil(totalAccessories / limit);

    const accessories = await Accessory.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("products_array");
    

    res.status(200).json({
      message: "Accessories received",
      accessories,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch accessories",
      error: error,
    });
  }
};

/**
 * @description Create Accessory
 * @route /api/v1/accessory
 * @method POST
 * @access private (only admin)
 */

export const createAccessoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //? Validate request body with Zod schema
     await accessorySchema.parseAsync(req.body);

    const products_array = JSON.parse(req.body.products_array) as Array<mongoose.Types.ObjectId>;

    const accessory = await Accessory.create({
      title: req.body.title,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      description: req.body.description,
      image: req.file
        ? `/public/upload/images/accessories/${req.file.filename}`
        : null,
        products_array
    });   

    // The product model has an accessory_id array. We will add the current accessory's _id to this array 
    for (const productId of products_array) {
      const product = await productModel.findById(productId);
      if (product) {
        product.accessory_id.push(accessory._id);
        await product.save();
      }
    }

    //* Respond with the saved accessory
    res.status(201).json({
      status: "success",
      data: accessory
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get Single Accessory
 * @route /api/v1/accessory/:id
 * @method GET
 * @access private (only admin)
 */

export const getAccessoryByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Type guard to ensure id is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid accessory ID" });
    }

    const accessory = await Accessory.findById(id);

    if (!accessory) {
      res.status(404).json({ error: "Accessory not found" });
    }

    res.status(200).json(accessory);
  } catch (err) {
    res.status(500).json({ error: err, message: "Internal Server Error" });
  }
};

/**
 * @description Delete Accessory
 * @route /api/v1/accessory/:id
 * @method DELETE
 * @access private (only admin)
 */

export const updateAccessoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    console.log(req.body);
    

    const parsedBody = updateAccessorySchema.parse(req.body);

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid accessory ID" });
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(id, parsedBody, {
      new: true,
    });        

    if (!updatedAccessory) {
      return res.status(404).json({ error: "Accessory not found" });
    }

    res.status(200).json(updatedAccessory);
  } catch (err) {
    next(err);
  }
};

/**
 * @description Delete Accessory
 * @route /api/v1/accessory/:id
 * @method DELETE
 * @access private (only admin)
 */

export const deleteAccessoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid accessory ID" });
    }

    const accessory = await Accessory.findById(id).populate("products_array");

    if (!accessory) {
     res.status(404).json({ error: "Accessory not found" });
      return;
    }

    // Remove the current accessory reference from the accessory_id array field of all related products
    if (accessory.products_array) {
      const arrayProductRelatedToAccessory = accessory.products_array;

      for (const productId of arrayProductRelatedToAccessory) {
        const product = await Product.findById(productId);

        if (product) {
          product.accessory_id = product.accessory_id.filter(
            (id) => id.toString() !== accessory._id.toString()
          );

          await product.save();
        }
      }
    }

    await Accessory.deleteOne({_id: accessory._id});
    res.status(200).json({ message: "Accessory deleted successfully" });
  } catch (err) {
   next(err);
  }
};


