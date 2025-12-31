import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    bestseller: { type: Boolean },
    quantity: { type: Number, required: true, default: 0 },
    date: { type: Number, required: true },
    artisanName: { type: String },
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'] },
    projectType: { type: String },
    owner: { type: String, required: true } // Stores the Admin User ID who created this product
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
