import mongoose, { Schema } from "mongoose";
const productFileSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
    },
    estiMatePrice: {
        type: Number,
    },
    fileLink: {
        type: String,
        required: [true, "File link is required"],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const ProductFileModel = mongoose.model("ProductFile", productFileSchema);
export default ProductFileModel;
