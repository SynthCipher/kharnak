import express from 'express'
import { placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyRazorpay, updateOrder } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js' // Auth middleware needed
import authUser from '../middleware/auth.js' // User auth needed

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/update', adminAuth, updateOrder)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

// User Feature
orderRouter.post('/userorders', authUser, userOrders)


export default orderRouter
