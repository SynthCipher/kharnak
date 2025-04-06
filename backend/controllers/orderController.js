import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { Stripe } from "stripe";
import razorpay from "razorpay";

// global variable
// const currency = "inr";
const currency = process.env.CURRENCY;
let deliveryCharge = 10;

// Gateway inistilaize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const razorpayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// COD order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Place" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Strike order
const placeOrderStripe = async (req, res) => {
  console.log("Stripe key available:", !!process.env.STRIPE_SECRET_KEY);
  try {
    const { userId, address, items, amount } = req.body;

    if (!userId || !address || !items || !amount) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    const { origin } = req.headers;
    deliveryCharge = amount - 60 < 999 ? 60 : 0;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    // Save the paymentIntentId in the order for later verification
    await orderModel.findByIdAndUpdate(newOrder._id, {
      paymentIntentId: session.payment_intent, // Save the paymentIntentId
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// verify stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// // Backend: Secure Stripe verification controller
// const verifyStripe = async (req, res) => {
//   try {
//     const { orderId ,userId } = req.body;
//     const order = await orderModel.findById(orderId);

//       // Retrieve the paymentIntentId from the order
//       const paymentIntentId = order.paymentIntentId;

//       // If no paymentIntentId exists, it indicates the order is not linked to Stripe
//       if (!paymentIntentId) {
//         return res.status(400).json({
//           success: false,
//           message: "Order is not linked to a Stripe payment",
//         });
//       }

//     // Validate the order belongs to this user
//     if (!order || order.userId.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid order or unauthorized access"
//       });
//     }

//     // Verify payment with Stripe API instead of trusting client params
//     // Use your Stripe instance to check the actual payment status
//     const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//     const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       // Update order payment status to true
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       // Clear user's cart
//       await userModel.findByIdAndUpdate(userId, { cartData: {} });

//       return res.json({ success: true });
//     } else {
//       // Payment failed - you may choose not to delete the order,
//       // but keep it with payment=false status
//       return res.json({
//         success: false,
//         message: "Payment verification failed"
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// REazorpay order
const placeOrderRazorpay = async (req, res) => {
  console.log(process.env.RAZORPAY_KEY_ID);
  console.log(process.env.RAZORPAY_KEY_SECRET);
  try {
    const { userId, address, items, amount } = req.body;

    if (!userId || !address || !items || !amount) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    deliveryCharge = amount - 60 < 999 ? 60 : 0;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: "HELLLO" });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// VERIFY RAZORPAY

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    // console.log(orderInfo);
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment SuccessFull" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ALl order Data for Admin panle
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// order Data for forntment
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// update order staus from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
