import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        rating: {type: Number, required: true, min: 1, max: 5},
        comment: {type: String},
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            require: true,
        },
    },
    {timestamps: true},
);

const fieldSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        sports:{
            type: [String],
            enum: ["football", "volleyball", "basketball", "handball", "tennis"],
            required: true,
        },
        dimensions: {length: Number, width: Number},
        pricePerHour: {type: Number, required: true},
        surface: {type: String, required: true},
        isActive: {type: Boolean, default: true},
        openTime: {type: Number, required: true}, // 8-22
        closeTime: {type: Number, required: true}, // 22-8
        reviews: [reviewSchema],
        averageRating: {type: Number, default: 0},
        image: {type: String},
    },
    {timestamps: true},
);

const Field = mongoose.model("Field", fieldSchema);

export default Field;