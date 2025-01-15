import { sendResponse } from "@/utils/sendResponse";
import Product from "./../models/productModel";
import { NextFunction, Request, Response } from "express";
import {
  addProductSchema,
  editeProductSchema,
} from "@/validation/productValidation";

const ProductController = {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await Product.find(); //.populate("category_id");

      sendResponse(res, 200, {
        status: "success",
        data: {
          products,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const product = await Product.findById(id).populate(
        "category_id accessory_id"
      );

      if (!product) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Product not found",
        });
        return;
      }
      sendResponse(res, 200, {
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await addProductSchema.parseAsync(req.body);

      const product = await Product.create({
        title: req.body.title,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        priceAfterDiscount: req.body.priceAfterDiscount,
        discount: req.body.discount,
        quantity: req.body.quantity,
        category_id: req.body.category_id,
        accessory_id: req.body.accessory_id,
        // Handle image upload
        image: req.file
          ? `/public/upload/images/products/${req.file.filename}`
          : null,
      });

      res.status(201).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async deleteProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const findProduct = await Product.findById(id);
      if (!findProduct) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Product not found",
        });
        return;
      }
      await Product.findByIdAndDelete(id);
      sendResponse(res, 200, {
        status: "success",
        data: "delete is done",
      });
    } catch (err) {
      next(err);
    }
  },
  async editProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await editeProductSchema.parseAsync(req.body);
      const id = req.params.id;

      const product = await Product.findById(id);
      if (!product) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Product not found",
        });
        return;
      }

      product.title = req.body.title ?? product.title;
      product.price = req.body.price ?? product.price;
      product.stock = req.body.stock ?? product.stock;
      product.description = req.body.description ?? product.description;
      product.priceAfterDiscount =
        req.body.priceAfterDiscount ?? product.priceAfterDiscount;
      product.discount = req.body.discount ?? product.discount;
      product.quantity = req.body.quantity ?? product.quantity;
      product.category_id = req.body.category_id ?? product.category_id;
      product.accessory_id = req.body.accessory_id ?? product.accessory_id;
      if (req.file) {
        product.image = `/public/upload/images/products/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.status(200).json({
        status: "success",
        data: {
          updatedProduct,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default ProductController;
