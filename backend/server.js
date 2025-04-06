import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// APP CONFIG
const app = express();
const port = process.env.PORT || 8080;
connectDB();
connectCloudinary();
// MIDDLE WARE
app.use(express.json());
app.use(cors());

// API END POINT
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("hello Server is Working");
  
});



// Set up a webhook endpoint in your backend
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update your order in the database
    await orderModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { payment: true }
    );
    // Clear the user's cart
    const order = await orderModel.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
    }
  }

  res.status(200).send();
});


app.listen(port, (req, res) => {
  console.log("app is litenign to port : ", port);
});
