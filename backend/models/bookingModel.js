import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bookingType: { type: String, required: true }, // e.g., "Trek", "Shepherd Life", etc.
    dates: { type: Object, required: true }, // { start: Date, end: Date }
    guests: { type: Number, required: true },
    paymentOption: { type: String, enum: ['Full', 'Deposit'], required: true },
    amount: { type: Number, required: true }, // Amount to be paid now (initially)
    totalAmount: { type: Number, required: true }, // Total cost of the booking
    razorpayOrderId: { type: String },
    status: { type: String, required: true, default: 'Pending' },
    payment: { type: Boolean, default: false },
    tourId: { type: String }, // For scheduled tours
    specialRequests: { type: String },
    date: { type: Number, required: true }
})

const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema)

export default bookingModel
