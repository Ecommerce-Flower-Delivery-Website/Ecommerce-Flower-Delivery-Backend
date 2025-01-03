import Product from "./../models/productModel";
import mongoose from "mongoose";

const ProductController = {
    async getProducts (req: Request, res: any) {
        const products = await Product.find()
        // .populate("accessory_id");
        return res.status(200).json({
            status: "success",
            data: {
                products,
            },
        })
    },
    async getProduct (req: any, res: any) {
        const id = req.params.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: "fail",
                message: "Invalid product id",
            });
        }
        const product = await Product.findById(id)
        // .populate("accessory_id");
        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: "Product not found",
            });
        }
        return res.status(200).json({
            status: "success",
            data: {
                product,
            },
        });
    },
    async addProduct (req: any, res: any) {
        console.log(req.body);
        console.log(req.file);

        const { title, description, stock, price } = req.body;
        const image = req.file?.filename;

        if (!title || !stock || !price) {
            return res.status(404).json({
                status: "fail",
                message: "Please provide all required fields",
            });
        }
        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof Number(stock) !== "number" ||
            typeof Number(price) !== "number"
        ) {
            return res.status(404).json({
                status: "fail",
                message: "Invalid input type",
            });
        }
        const product = await Product.create({
            title,
            description,
            image: `/public/upload/images/products/${image}`,
            stock,
            price
        });
        return res.status(201).json({
            status: "success",
            data: {
                product
            },
        });
    },
    async deleteProducts (req: any, res: any)  {
        const id = req.params.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: "fail",
                message: "Invalid product id",
            });
        }
        const findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({
                status: "fail",
                message: "Product not found",
            });
        }
        await Product.findByIdAndDelete(id);
        return res.status(200).json({
            status: "success",
        });
    },
    async editProduct (req: any, res: any)  {
        const id = req.params.id;
        const { title, description, stock, price } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: "fail",
                message: "Invalid product id",
            });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: "Product not found",
            });
        }
        if (title) {
            product.title = title;
        }
        if (price) {
            product.price = price;
        }
        if (stock) {
            product.stock = stock;
        }
        if (description) {
            product.description = description;
        }
        if (req.file) {
            product.image = `/public/upload/images/products/${req.file.filename}`;
        }
        const updatedProduct = await product.save();
        return res.status(200).json({
            status: "success",
            data: updatedProduct
        });
    }
}

export default ProductController;
