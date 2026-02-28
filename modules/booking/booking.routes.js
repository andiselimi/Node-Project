import express from 'express';
import { createBooking, getAllBookings, getMyBookings, cancelMyBooking, deleteBooking, updateStatus, getBookingStats } from './booking.controller.js';
import { isAuthenticated, isAuthorized } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/createBooking/:fieldId', isAuthenticated, createBooking);
router.get('/getAllBookings', isAuthenticated, isAuthorized(["admin", "moderator"]), getAllBookings);
router.get('/getMyBookings', isAuthenticated, isAuthorized(["user", "admin", "moderator"]), getMyBookings);
router.patch('/cancelMyBooking/:bookingId', isAuthenticated, isAuthorized(["user", "admin", "moderator"]), cancelMyBooking);
router.delete('/deleteBooking/:bookingId', isAuthenticated, isAuthorized(["admin", "moderator"]), deleteBooking);
router.patch('/updateStatus/:bookingId', isAuthenticated, isAuthorized(["admin", "moderator"]), updateStatus);
router.get('/getBookingStats', isAuthenticated, isAuthorized(["admin", "moderator"]), getBookingStats); 

export default router;