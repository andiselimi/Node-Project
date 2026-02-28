import Booking from "./booking.model.js";
import Field from "../fields/field.model.js";
import { sendBookingEmail } from "../../config/email.js";

export const createBooking = async (req, res) => {
    try {
        const fieldId = req.params.fieldId;
        const {startTime, endTime, sport} = req.body;

        if(!startTime || !endTime || !sport){
            return res.status(400).json({message: "Missing required fields", success: false});
        }

        if(startTime >= endTime){
            return res.status(400).json({message: "Invalid time range", success: false});
        }

        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({message: "Field not found", success: false});
        }

        const start = new Date(startTime * 1000);
        const end = new Date(endTime * 1000);

        const startHour = start.getHours();
        const endHour = end.getHours();

        if( (startHour - 1) < field.openTime || ( endHour - 1) > field.closeTime){
            return res.status(400).json({message: `Booking time must be within field operating hours: ${field.openTime}:00 to ${field.closeTime}:00`, success: false});
        }

        console.log(startHour, endHour, "start and end hour");
        console.log(field.openTime, field.closeTime, "field open and close time");

        const overLap = await Booking.findOne({
            field: fieldId,
            isActive: true,
            status: { $ne: "canceled"},
            endTime: { $gt: startTime},
            startTime: { $lt: endTime},
        });

        if (overLap) {
            return res.status(400).json({message: "Time slot already booked", success: false});
        }

        const hours = (endTime - startTime) / 3600;
        const totalPrice = hours * field.pricePerHour;

        const booking = await Booking.create({
            user: req.user._id,
            field: fieldId,
            startTime,
            endTime,
            sport,
            pricePerHour: field.pricePerHour,
            totalPrice
        })

        await booking.save();

        sendBookingEmail(req.user.email, req.user.name, field.name, start, end, totalPrice);

        res.status(201).json({
            message: "Booking created successfully",
            booking: booking,
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}

export const getAllBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({isActive: true})
        .populate("user", "firstName lastName")
        .populate("field", "name pricePerHour")
        .sort({createdAt: -1});

        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings: bookings,
            success: true,
            length: bookings.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}

export const getMyBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({isActive: true, user: req.user._id})
        .populate("user", "firstName lastName")
        .populate("field", "name pricePerHour")
        .sort({createdAt: -1});

        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings: bookings,
            success: true,
            length: bookings.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}

export const cancelMyBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const booking = await Booking.findOne({_id: bookingId, user: req.user._id, isActive: true});
        
        if(!booking){
            return res.status(404).json({message: "Booking not found", success: false});
        }

        booking.status = "cancelled";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: booking,
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}

export const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        await Booking.findByIdAndUpdate(bookingId, {isActive: false});

        res.status(200).json({
            message: "Booking deleted successfully",
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        const status = req.body.status;
        
        if(!booking){
            return res.status(404).json({message: "Booking not found", success: false});
        }

        booking.status = status;

        await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking: booking,
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}

export const getBookingStats = async (req, res) => {
    try {
        const startDate = req.query.startDate
            ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate
            ? new Date(req.query.endDate) : null;

        const baseQuery = { isActive: true };

        if(startDate && endDate){
            baseQuery.createdAt = { $gte: startDate, $lte: endDate };
        }
        
        const totalBookings = await Booking.countDocuments(baseQuery);

        const bookingByStatus = await Booking.aggregate([
            { $match: baseQuery },
            { $group: { 
                _id: "$status",
                count: { $sum: 1  } ,
                totalRevenue: { $sum: "$totalPrice" },
            }},
        ]);

        const totalRevenueResults = await Booking.aggregate([
            { $match: {...baseQuery, status: "paid" } },
            { $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
            }},
        ]);

        const averageTotalRevenueResults = await Booking.aggregate([
            { $match: {...baseQuery, status: "paid" } },
            { $group: {
                _id: null,
                avgRevenue: { $avg: "$totalPrice" },
            }},
        ]);

        const bookingBySport = await Booking.aggregate([
            { $match: baseQuery },
            { $group: {
                _id: "$sport",
                count: { $sum: 1 },
                totalRevenue: { $cond: [ { $eq: [ "$status", "paid" ] }, { $sum: "$totalPrice" }, 0 ] },
            }},
            { $sort: { count: -1 } },
        ]);

        const bookingByField = await Booking.aggregate([
            { $match: baseQuery },
            { $group: {
                _id: "$field",
                count: { $sum: 1 },
                totalRevenue: { $cond: [ { $eq: [ "$status", "paid" ] }, { $sum: "$totalPrice" }, 0 ] },
            }},
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const bookingByMonth = await Booking.aggregate([
            { $match: baseQuery },
            { $group: {
                _id: { $year: "$createdAt"},
                month: { $month: "$createdAt"},
            },
            count: { $sum: 1 },
            totalRevenue: { $cond: [ { $eq: [ "$status", "paid" ] }, { $sum: "$totalPrice" }, 0 ] },
            },
            { $sort: { "_id.year": 1 }, "_id.month": 1 },
            { $limit: 12 },
        ]);

        res.status(200).json({
            message: "Booking stats fetched successfully",
            data: {
                overView: {
                    totalBookings,
                    totalRevenueResults,
                    averageRevenueResults,
                },
                bookingByStatus: {
                    pending: bookingByStatus.pending,
                    paid: bookingByStatus.paid,
                    cancelled: bookingByStatus.cancelled,
                },
                bookingBySport,
                bookingByField,
                bookingByMonth,
            },
            success: true,
        }); 



    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error,
            success: false,
        })
    }
}