import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import storyRouter from "./routes/storyRoute.js";
import contactRouter from "./routes/contactRoute.js";
import publicationRouter from "./routes/publicationRoute.js";
import tourRouter from "./routes/tourRoute.js";

// APP CONFIG
const app = express();
const port = process.env.PORT || 8080;
connectDB();
connectCloudinary();
// MIDDLE WARE
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://kharnak.vercel.app',
    'https://kharnak.in', 'https://www.kharnak.in',
    'https://kharnak-nfjr.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// API END POINT
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/story", storyRouter);
app.use("/api/contact", contactRouter);
app.use("/api/publication", publicationRouter);
app.use("/api/tour", tourRouter);

app.get("/", (req, res) => {
  res.send("hello Server is Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`)
})


