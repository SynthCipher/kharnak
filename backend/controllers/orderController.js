import orderModel from "../models/orderModel.js";
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';

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


const sendOrderEmail = async (order) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: [process.env.SENDER_EMAIL, order.address.email], // Send to admin and user
        subject: `New Order Received: #${order._id}`,
        text: `
            New Order Placed!
            Order ID: ${order._id}
            Amount: ${order.amount}
            Items: ${order.items.map(item => item.name).join(', ')}
            
            Customer Details:
            Name: ${order.address.firstName} ${order.address.lastName}
            Email: ${order.address.email}
            Address: ${order.address.street}, ${order.address.city}, ${order.address.zipcode}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // await sendOrderEmail(newOrder); // Disabled to save quota

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing orders using Stripe Method
// Razorpay Instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // amount in paisa
            currency: "INR",
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment Successful" })
        } else {
            res.json({ success: false, message: "Payment Failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 }); // Sort by newest first

        let filteredOrders = orders;

        // If user is Admin (Seller) but NOT Master Admin, filter orders
        if (req.userRole === 'admin') {
            const sellerId = req.userId;

            // Filter orders to only include those that contain at least one item owned by this seller
            filteredOrders = orders.filter(order => {
                return order.items.some(item => item.owner === sellerId);
            });

            filteredOrders = filteredOrders.map(order => {
                // Return a new object (mongoose doc to object)
                const orderObj = order.toObject();
                orderObj.items = orderObj.items.filter(item => item.owner === sellerId);
                return orderObj;
            });
        }

        res.json({ success: true, orders: filteredOrders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ... (existing code)

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId }).sort({ date: -1 }) // Sort by newest first
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update Order Tracking Details (Admin)
const updateOrder = async (req, res) => {
    try {
        const { orderId, trackingId, courierCompany, courierLink, expectedDate } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { trackingId, courierCompany, courierLink, expectedDate });
        res.json({ success: true, message: "Order Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus, updateOrder }
