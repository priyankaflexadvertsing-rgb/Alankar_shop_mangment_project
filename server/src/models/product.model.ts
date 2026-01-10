import mongoose, { Schema, Document } from "mongoose";

export interface IProductFile extends Document {
  name: string;
  description: string;
  price: number;
  estiMatePrice?: number;
  fileLink: string;
  category: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productFileSchema = new Schema<IProductFile>(
  {
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
  },
  {
    timestamps: true,
  }
);

const ProductFileModel = mongoose.model<IProductFile>(
  "ProductFile",
  productFileSchema
);

export default ProductFileModel;
