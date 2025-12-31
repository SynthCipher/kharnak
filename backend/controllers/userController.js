import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import orderModel from "../models/orderModel.js";
import bookingModel from "../models/bookingModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: true, // show debug output
    logger: true // log information in console
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Connection Error Details:", error);
    } else {
        console.log("SMTP Server is ready to take messages");
    }
});



// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            if (!user.isVerified) {
                return res.json({ success: false, message: "Account not verified. Please verify your email.", isNotVerified: true });
            }
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verifyOTP: otp,
            verifyOTPExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        const user = await newUser.save()

        // Send Verification OTP Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account Verification OTP',
            text: `Your verification OTP is: ${otp}. It will expire in 24 hours.`
        };

        // Send Admin Notification Email
        const adminMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: process.env.SENDER_EMAIL,
            subject: 'New User Registered - Kharnak',
            text: `A new user has registered on Kharnak.\n\nName: ${name}\nEmail: ${email}\nTime: ${new Date().toLocaleString()}`
        };

        try {
            // Send both emails
            const userEmailInfo = await transporter.sendMail(mailOptions);
            console.log("Verification Email Sent:", userEmailInfo.messageId);

            const adminEmailInfo = await transporter.sendMail(adminMailOptions);
            console.log("Admin Notification Sent:", adminEmailInfo.messageId);
        } catch (mailError) {
            console.error("Email Error:", mailError);
        }

        const token = createToken(user._id)
        res.json({ success: true, token, message: "Registration successful. Please verify your email with the OTP sent." })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Verify Email OTP
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOTP === '' || user.verifyOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOTPExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        user.isVerified = true;
        user.verifyOTP = '';
        user.verifyOTPExpiresAt = 0;
        await user.save();

        res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Sent Reset Password OTP
const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is: ${otp}. Use this to reset your password.`
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Reset Email Sent:", info.messageId);
        } catch (mailError) {
            console.error("Reset Email Error:", mailError);
        }


        res.json({ success: true, message: "Reset OTP sent to your email" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiresAt = 0;
        await user.save();

        res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get all users for admin
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update user details or status (admin)
const updateUser = async (req, res) => {
    try {
        const { userId, name, email, isVerified } = req.body;
        await userModel.findByIdAndUpdate(userId, { name, email, isVerified });
        res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get user history (admin)
const getUserHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        const bookings = await bookingModel.find({ userId });
        res.json({ success: true, orders, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1. Check Env Credentials (Master Fallback)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token, role: 'master_admin' })
            return;
        }

        // 2. Check DB Admin
        const user = await userModel.findOne({ email });
        if (user) {
            // Check if user is active
            if (user.isActive === false) {
                return res.json({ success: false, message: "Account setup is pending or deactivated. Contact Master Admin." })
            }

            // Check if the user has an admin role
            if (user.role !== 'admin' && user.role !== 'master_admin') {
                return res.json({ success: false, message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = createToken(user._id);
                // Return role to frontend
                res.json({ success: true, token, role: user.role })
            } else {
                res.json({ success: false, message: "Invalid credentials" })
            }
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Add new Admin (Master Admin only)
const addAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Ensure requester is Master Admin (Middleware sets req.userRole)
        // For Env creds, we set it manually in middleware, or we can check token again if needed.
        // But adminAuth middleware already handles logic. We assume if it passes here, it's an admin.
        // Ideally we check req.userRole === 'master_admin' but for now let's allow any admin to add admin?
        // Requirement said "Master admin give option to add extra admin".
        // Let's enforce strict Master check if possible, or relax for now.
        // Since middleware update above sets req.userRole, we can use it.

        if (req.userRole !== 'master_admin') {
            return res.json({ success: false, message: "Only Master Admin can create new admins." })
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isVerified: true // Admins verified by default
        })

        await newAdmin.save()
        res.json({ success: true, message: "New Admin Added Successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Test Email Route
const testEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Test Email from Kharnak',
            text: 'If you are reading this, your email configuration is working correctly!'
        };
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get User Profile (User Access)
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select("-password -resetOtp -verifyOTP");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User Address (User Access)
const updateAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        // Address object { street, city, state, zipcode, country, phone }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Add new address to array
        user.addresses.push(address);
        await user.save();

        res.json({ success: true, message: "Address added successfully", addresses: user.addresses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Add Admin (Already Exists in code above, just ensuring context)

// Delete User Address (User Access)
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.json({ success: true, message: "Address deleted successfully", addresses: user.addresses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Set Default Address (User Access) - Moves address to index 0
const setDefaultAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.json({ success: false, message: "Address not found" });
        }

        const [addressToMove] = user.addresses.splice(addressIndex, 1);
        user.addresses.unshift(addressToMove);

        await user.save();
        res.json({ success: true, message: "Default address updated", addresses: user.addresses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Edit Admin Details (Master Admin Only)
const editAdmin = async (req, res) => {
    try {
        const { userId, name, email, password, isActive } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (isActive !== undefined) updateData.isActive = isActive;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await userModel.findByIdAndUpdate(userId, updateData);
        res.json({ success: true, message: "Admin Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Toggle Admin Active Status (Master Admin Only) -- Simplified endpoint if just toggling
const toggleAdminStatus = async (req, res) => {
    try {
        const { userId, isActive } = req.body;
        await userModel.findByIdAndUpdate(userId, { isActive });
        res.json({ success: true, message: isActive ? "Admin Activated" : "Admin Deactivated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, verifyEmail, sendResetOtp, resetPassword, allUsers, testEmail, updateUser, getUserHistory, addAdmin, getUserProfile, updateAddress, deleteAddress, setDefaultAddress, editAdmin, toggleAdminStatus }

