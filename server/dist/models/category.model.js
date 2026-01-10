import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
categorySchema.pre("findOneAndDelete", async function (next) {
    const categoryId = this.getQuery()._id;
    const productCount = await mongoose
        .model("ProductFile")
        .countDocuments({ category: categoryId });
    if (productCount > 0) {
        throw new Error("Cannot delete category with products");
    }
    next();
});
const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
