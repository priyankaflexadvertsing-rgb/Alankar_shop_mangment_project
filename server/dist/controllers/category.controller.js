import CategoryModel from "../models/category.model.js";
import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
/* =========================
   CREATE CATEGORY
========================= */
export const createCategory = CatchAsyncError(async (req, res, next) => {
    console.log(req.body);
    const { name, description } = req.body;
    if (!name) {
        return next(new ErrorHandler("Category name is required", 400));
    }
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
        return next(new ErrorHandler("Category already exists", 409));
    }
    const category = await CategoryModel.create({
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});
/* =========================
   GET ALL CATEGORIES
========================= */
export const getAllCategories = CatchAsyncError(async (_req, res) => {
    const categories = await CategoryModel.find({ isActive: true });
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});
/* =========================
   GET SINGLE CATEGORY
========================= */
export const getSingleCategory = CatchAsyncError(async (req, res, next) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    res.status(200).json({
        success: true,
        data: category,
    });
});
/* =========================
   UPDATE CATEGORY
========================= */
export const updateCategory = CatchAsyncError(async (req, res, next) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
});
/* =========================
   DELETE CATEGORY (SOFT DELETE)
========================= */
export const deleteCategory = CatchAsyncError(async (req, res, next) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    category.isActive = false;
    await category.save();
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});
