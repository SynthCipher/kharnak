import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    isVerified: { type: Boolean, default: false },
    verifyOTP: { type: String, default: '' },
    verifyOTPExpiresAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: '' },
    resetOtpExpiresAt: { type: Number, default: 0 },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'master_admin'] },
    addresses: [
        {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zipcode: { type: String }, // changed zip to zipcode for consistency if needed, but keeping generic
            country: { type: String },
            phone: { type: String }
        }
    ],
    isActive: { type: Boolean, default: true }
}, { minimize: false, timestamps: true })



const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel
