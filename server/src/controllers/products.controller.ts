
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
import userModel from "../models/user.model.js";

import ProductFileModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user as any;
    const { name, description, price, estiMatePrice, categoryId } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!name || !description || !price || !categoryId) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (!files || files.length === 0) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    const user = await userModel.findById(_id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    const product = await ProductFileModel.create({
      name,
      description,
      price,
      estiMatePrice,
      fileLink: files[0].path,
      category: category._id,
      user: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  }
);


export const getAllProducts = CatchAsyncError(
  async (_req: Request, res: Response) => {
    const products = await ProductFileModel
      .find()
      .populate("category")
      .populate("user");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  }
);


export const getSingleProduct = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductFileModel
      .findById(req.params.id)
      .populate("category")
      .populate("user");

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

export const updateProduct = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductFileModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const updatedProduct = await ProductFileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
);


export const deleteProduct = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductFileModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);

