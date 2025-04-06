import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// API TO NEW PRODUCT
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // console.log(image1, image2, image3, image4);

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          //   folder: "ecommerce" // This specifies the folder in Cloudinary
          folder: "ecommerce/products",

          //   // For user profile images or other user-related images
          // const uploadUserImage = async (imagePath) => {
          //     let result = await cloudinary.uploader.upload(imagePath, {
          //       resource_type: "image",
          //       folder: "ecommerce/users" // Subfolder for user images
          //     });
          //     return result.secure_url;
          //   };
        });
        return result.secure_url;
      })
    );
    const productData = {
      name,
      description,
      price: Number(price),
      image: imagesUrl,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
    };
    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO list productF
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    // console.log(products)
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body; // Getting product ID from the body

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }
    // Finding and deleting the product by ID
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for dingle  PRODUCT info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    console.log(product);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
