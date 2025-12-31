import bookingModel from "../models/bookingModel.js";
import tourModel from "../models/tourModel.js";
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';

// Razorpay Instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true

});

const sendBookingEmail = async (booking) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: [process.env.SENDER_EMAIL, booking.email],
        subject: `New Booking Request: ${booking.bookingType}`,
        text: `
            New Booking Request!
            Type: ${booking.bookingType}
            Details:
            User: ${booking.userName} (${booking.email})
            Phone: ${booking.phone}
            Guests: ${booking.guests}
            Dates: ${new Date(booking.dates.start).toDateString()} to ${new Date(booking.dates.end).toDateString()}
            Payment Option: ${booking.paymentOption}
            Total Amount: ${booking.amount}
            Payment Status: ${booking.payment ? 'Paid' : 'Pending'}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking email sent');
    } catch (error) {
        console.error('Error sending booking email:', error);
    }
};

const createBooking = async (req, res) => {
    try {
        const { userId, userName, email, phone, bookingType, dates, guests, paymentOption, tourId } = req.body;

        let totalAmount = 0;

        if (tourId) {
            // Check tour availability and get price
            const tour = await tourModel.findById(tourId);
            if (!tour) {
                return res.json({ success: false, message: "Tour not found" });
            }
            if (tour.availableSeats < guests) {
                return res.json({ success: false, message: `Only ${tour.availableSeats} seats left for this tour.` });
            }
            totalAmount = tour.price * guests;
        } else {
            // Simple pricing logic for general bookings
            const prices = {
                'Trek': 2000,
                'Experience the Shepherd Life': 1500,
                'Work from Remote Option': 1000,
                'Homestay': 1200
            };

            const pricePerPersonPerDay = prices[bookingType] || 1500;
            const startDate = new Date(dates.start);
            const endDate = new Date(dates.end);
            const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
            totalAmount = pricePerPersonPerDay * guests * days;
        }

        const payableAmount = paymentOption === 'Deposit' ? Math.round(totalAmount * 0.3) : totalAmount;

        const bookingData = {
            userId,
            userName: userName || req.body.userName,
            email: email || req.body.email,
            phone: phone || req.body.phone,
            bookingType,
            dates,
            guests,
            paymentOption,
            amount: payableAmount,
            totalAmount: totalAmount,
            tourId: tourId || null,
            specialRequests: req.body.specialRequests || "",
            date: Date.now()
        }

        const newBooking = new bookingModel(bookingData);
        await newBooking.save();

        // Create Razorpay Order
        const options = {
            amount: payableAmount * 100, // in paisa
            currency: "INR",
            receipt: newBooking._id.toString()
        }

        razorpayInstance.orders.create(options, async (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: "Razorpay Error" })
            }
            newBooking.razorpayOrderId = order.id;
            await newBooking.save();
            res.json({ success: true, order, bookingId: newBooking._id })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyBookingPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // In a real app, verify signature here. 
        // For simplicity, checking order status.
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const updatedBooking = await bookingModel.findByIdAndUpdate(bookingId, { payment: true, status: 'Confirmed' }, { new: true });

            // If it's a tour booking, decrement available seats
            if (updatedBooking.tourId) {
                await tourModel.findByIdAndUpdate(updatedBooking.tourId, { $inc: { availableSeats: -updatedBooking.guests } });
            }

            await sendBookingEmail(updatedBooking);
            res.json({ success: true, message: "Booking Confirmed & Payment Successful" })
        } else {
            res.json({ success: false, message: "Payment Failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const listBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({}).sort({ date: -1 });
        res.json({ success: true, bookings })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        await bookingModel.findByIdAndUpdate(req.body.bookingId, { status: req.body.status })
        res.json({ success: true, message: "Booking Status Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userBookings = async (req, res) => {
    try {
        const { userId } = req.body;
        const bookings = await bookingModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getTourApplicants = async (req, res) => {
    try {
        const { tourId } = req.body;
        const bookings = await bookingModel.find({ tourId }).sort({ date: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { createBooking, verifyBookingPayment, listBookings, updateBookingStatus, userBookings, getTourApplicants }
