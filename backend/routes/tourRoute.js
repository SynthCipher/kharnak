import express from 'express';
import { addTour, listTours, adminListTours, removeTour, getTourById, updateTour } from '../controllers/tourController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const tourRouter = express.Router();

tourRouter.post('/add', adminAuth, upload.single('image'), addTour);
tourRouter.post('/update', adminAuth, upload.single('image'), updateTour);
tourRouter.post('/remove', adminAuth, removeTour);
tourRouter.get('/list', listTours);
tourRouter.post('/admin-list', adminAuth, adminListTours);
tourRouter.post('/single', getTourById);

export default tourRouter;
