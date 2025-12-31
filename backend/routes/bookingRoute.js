import express from 'express'
import { createBooking, verifyBookingPayment, listBookings, updateBookingStatus, userBookings, getTourApplicants } from '../controllers/bookingController.js'
import adminAuth from '../middleware/adminAuth.js'
import auth from '../middleware/auth.js'

const bookingRouter = express.Router()

bookingRouter.post('/create', auth, createBooking)
bookingRouter.post('/verify', auth, verifyBookingPayment)

bookingRouter.get('/list', listBookings)
bookingRouter.post('/status', updateBookingStatus)
bookingRouter.post('/user-bookings', auth, userBookings)
bookingRouter.post('/get-applicants', adminAuth, getTourApplicants)

export default bookingRouter

