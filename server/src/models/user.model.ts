import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the User interface extending Document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: (userType: string) => string;
  SignRefreshToken: (userType: string) => string;
}

// Define the user schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // required: true,
      enum: ["user", 'admin'],
      default: "admin",
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash Password before saving
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});



// sign access token
userSchema.methods.SignAccessToken = function (userType: string) {
  return jwt.sign(
    { id: this._id, role: userType },
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: "15m",
    }
  );
};

// sign refresh token
userSchema.methods.SignRefreshToken = function (userType: string) {
  return jwt.sign(
    { id: this._id, role: userType },
    process.env.REFRESH_TOKEN_SECRET || "",
    {
      expiresIn: "7d",
    }
  );
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
