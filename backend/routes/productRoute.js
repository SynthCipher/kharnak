import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js'; // Assuming you have this or will create it

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.array('image'), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.post('/update', adminAuth, upload.array('image'), updateProduct);

export default productRouter;
