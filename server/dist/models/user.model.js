import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    /** ✅ Store ONLY ObjectIds */
    printing: [
        {
            type: Schema.Types.ObjectId,
            ref: "PrintingFile",
        },
    ],
    rate: {
        type: Object,
        // select: false,
    },
}, {
    timestamps: true,
});
// Hash Password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 10);
});
// sign access token
userSchema.methods.SignAccessToken = function (userType) {
    return jwt.sign({ id: this._id, role: userType }, process.env.ACCESS_TOKEN_SECRET || "", {
        expiresIn: "15m",
    });
};
// sign refresh token
userSchema.methods.SignRefreshToken = function (userType) {
    return jwt.sign({ id: this._id, role: userType }, process.env.REFRESH_TOKEN_SECRET || "", {
        expiresIn: "7d",
    });
};
// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const userModel = mongoose.model("User", userSchema);
export default userModel;
