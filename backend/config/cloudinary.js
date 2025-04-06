import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    // Testing the connection by listing resources
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log("Cloudinary connected");
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error);
  }
};

export default connectCloudinary;
