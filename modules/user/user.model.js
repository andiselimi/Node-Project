import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        phoneNumber: {type: String, default: null},
        identityCard: {type: Number, default: null},
        role:{
            type: String,
            enum: ["admin", "moderator", "user"],
            default: "user",
        },
        isActive: {type: Boolean, default: true},
    },
    {timestamps: true},
);

const User = mongoose.model("User", userSchema);

export default User;
