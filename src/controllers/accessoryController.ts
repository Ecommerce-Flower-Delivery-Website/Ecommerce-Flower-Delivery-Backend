import { Request, Response } from "express";
import Accessory from "../models/accessoryModel"; // Adjust the path based on your project structure
import { ZodError } from "zod";
import { accessorySchema, updateAccessorySchema } from "../validation/accessoryValidation";
import { Types } from "mongoose";

/**
 * @description Get All Accessories
 * @route /api/v1/accessory
 * @method GET
 * @access private (only admin)
 */

export const getAllAccessoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ACCESSORIES_PER_PAGE = 10;
    const { pageNumber } = req.query;

    const page = parseInt(pageNumber as string, 10) || 1;

    const totalAccessories = await Accessory.countDocuments();

    const totalPages = Math.ceil(totalAccessories / ACCESSORIES_PER_PAGE);

    const accessories = await Accessory.find()
      .skip((page - 1) * ACCESSORIES_PER_PAGE)
      .limit(ACCESSORIES_PER_PAGE)
      .sort({ createdAt: -1 });

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
  res: Response
): Promise<void> => {
  try {
    //? Validate request body with Zod schema
    const parsedBody = accessorySchema.parse(req.body);

    //* Create a new Accessory instance
    const newAccessory = new Accessory(parsedBody);

    //* Save the new accessory to the database
    const savedAccessory = await newAccessory.save();

    //* Respond with the saved accessory
    res.status(201).json(savedAccessory);
  } catch (err) {
    if (err instanceof ZodError) {
      //! Handle Zod validation errors
      res.status(400).json({
        error: "Validation Error",
        details: err.errors,
      });
    } else {
      //! Handle other errors
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
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
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

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
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
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
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid accessory ID" });
    }

    const deletedAccessory = await Accessory.findByIdAndDelete(id);

    if (!deletedAccessory) {
      res.status(404).json({ error: "Accessory not found" });
    }

    res.status(200).json({ message: "Accessory deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
