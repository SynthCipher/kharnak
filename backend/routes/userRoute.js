import express from 'express';
import { loginUser, registerUser, adminLogin, verifyEmail, sendResetOtp, resetPassword, allUsers, testEmail, updateUser, getUserHistory, addAdmin, getUserProfile, updateAddress, deleteAddress, setDefaultAddress, editAdmin, toggleAdminStatus } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin-login', adminLogin);
userRouter.post('/add-admin', adminAuth, addAdmin);
userRouter.post('/edit-admin', adminAuth, editAdmin);
userRouter.post('/toggle-admin-status', adminAuth, toggleAdminStatus);
userRouter.post('/verify-otp', verifyEmail);
userRouter.post('/send-reset-otp', sendResetOtp);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/all-users', adminAuth, allUsers);
userRouter.post('/update-user', adminAuth, updateUser);
userRouter.post('/user-history', adminAuth, getUserHistory);
userRouter.get('/test-email/:email', testEmail);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/add-address', authUser, updateAddress);
userRouter.post('/delete-address', authUser, deleteAddress);
userRouter.post('/set-default-address', authUser, setDefaultAddress);

export default userRouter;


