import express from "express";
import userRoutes from "../modules/user/user.routes.js";
import fieldsRoutes from  "../modules/fields/field.routes.js";
import authRouter from "../modules/auth/auth.routes.js";
import bookingRoutes from "../modules/booking/booking.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/fields", fieldsRoutes);
router.use("/auth", authRouter);
router.use("/bookings", bookingRoutes);

export default router;