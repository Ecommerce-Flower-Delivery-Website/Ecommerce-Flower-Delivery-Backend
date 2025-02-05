import { sendResponse } from "@/utils/sendResponse";
import Category from "../models/categoryModel";
import { NextFunction, Request, Response } from "express";
import {
  addCategorySchema,
  editCategorySchema,
} from "@/validation/categoryValidation";
import { CustomRequest } from "@/types/customRequest";
import productModel from "@/models/productModel";
import { removeProductFromAccessories } from "@/utils/databaseHelpers";

const CategoryController = {
  async getCategories(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const query : { [key: string]: RegExp } = req.queryFilter ?? {};
      const totalCategories = await Category.countDocuments(query);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || totalCategories;
      const skip = (page - 1) * limit;

      const categories = await Category.find(query).skip(skip).limit(limit);
      const totalPages = Math.ceil(totalCategories / limit);

      sendResponse(res, 200, {
        status: "success",
        data: {
          categories,
          pagination: {
            totalCategories,
            totalPages,
            currentPage: page,
            pageSize: limit,
          },
        },
      });
    } catch (err) {
      next(err); // Pass error to the next middleware
    }
  },

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const category = await Category.findById(id).populate("products");

      if (!category) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Category not found",
        });
        return;
      }

      sendResponse(res, 200, {
        status: "success",
        data: {
          category,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await addCategorySchema.parseAsync(req.body);

      const category = await Category.create({
        title: req.body.title,
        image: req.file
          ? `/upload/images/categories/${req.file.filename}`
          : null,
        description: req.body.description,
      });

      res.status(201).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (err) {

      next(err);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const findCategory = await Category.findById(id);
      if (!findCategory) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Category not found",
        });
        return;
      }

      // Removes all products related to the category`,
      // ensuring that each product is unlinked from the related accessories before deleting the product.
      const productsRelatedToCategory = await productModel.find({category_id: id});
      for (const product of productsRelatedToCategory) {
        await removeProductFromAccessories(product);
        await productModel.findByIdAndDelete(product._id);
      }
    
      await Category.findByIdAndDelete(id);

      sendResponse(res, 200, {
        status: "success",
        data: "Delete is done",
      });
    } catch (err) {
      next(err);
    }
  },

  async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await editCategorySchema.parseAsync(req.body);

      const id = req.params.id;

      const category = await Category.findById(id);

      if (!category) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Category not found",
        });
        return;
      }

      category.title = req.body.title ?? category.title;
      category.description = req.body.description ?? category.description;

      if (req.file) {
        category.image = `/upload/images/categories/${req.file.filename}`;
      }

      const updatedCategory = await category.save();

      res.status(200).json({
        status: "success",
        data: {
          updatedCategory,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default CategoryController;
