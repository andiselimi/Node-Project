import mongoose, {mongo} from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field",
            required: true,
        },
        startTime: {
            type: Number,
            required: true,
        },
        endTime: {
            type: Number,
            required: true,
        },
        sport:{
            type: String,
            enum: ["football", "volleyball", "basketball", "handball", "tennis"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending"
        },
        isActive: {
            type: Boolean,
            default: true}
        },
    {timestamps: true},
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;