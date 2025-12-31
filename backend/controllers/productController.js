import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary"

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller, quantity, artisanName, gender, projectType } = req.body;
        // Handle sizes as JSON if sent as string (Multipart form data)
        const sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];

        // Handle dynamic images array
        // req.files is an array when using upload.array()
        const images = req.files.map(file => file.path);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            quantity: Number(quantity) || 0,
            sizes: sizes,
            image: imagesUrl,
            date: Date.now(),
            artisanName,
            gender,
            projectType,
            owner: req.userId // Attach owner ID from auth middleware
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for listing products (Filtered by Owner if not Master Admin)
const listProducts = async (req, res) => {
    try {
        let filter = {};
        // If user is Admin (Seller) but NOT Master Admin, filter by owner
        // Note: adminAuth middleware attaches req.userRole and req.userId
        if (req.userRole === 'admin') {
            filter.owner = req.userId;
        }

        const products = await productModel.find(filter).sort({ date: -1 });

        res.json({ success: true, products: products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Ownership Check: Only Owner or Master Admin can delete
        if (req.userRole !== 'master_admin' && product.owner !== req.userId) {
            return res.json({ success: false, message: "Not Authorized to delete this product" })
        }

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, subCategory, bestseller, quantity, artisanName, gender, projectType, oldImages } = req.body;

        const sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
        const parsedOldImages = oldImages ? JSON.parse(oldImages) : [];

        // Handle new uploaded images
        const newImages = req.files.map(file => file.path);
        let newImagesUrls = await Promise.all(
            newImages.map(async (item) => {
                let result = await cloudinary.uploader.upload(item, { resource_type: 'image' });
                return result.secure_url
            })
        )

        // Combine old and new images
        // We assume frontend sends 'oldImages' array of URLs that should be kept.
        const updatedImages = [...parsedOldImages, ...newImagesUrls];

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            quantity: Number(quantity) || 0,
            sizes,
            image: updatedImages,
            sizes,
            image: updatedImages,
            artisanName,
            gender,
            projectType
        }

        await productModel.findByIdAndUpdate(productId, updateData);

        res.json({ success: true, message: "Product Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }
