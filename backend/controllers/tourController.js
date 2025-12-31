import tourModel from "../models/tourModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add Tour (Admin)
const addTour = async (req, res) => {
    try {
        const { name, type, startDate, endDate, price, totalSeats, description, highlights, duration, status } = req.body;

        const imageFile = req.file; // Assuming single image upload using multer
        if (!imageFile) {
            return res.json({ success: false, message: "Tour image is required" });
        }

        const uploadResult = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const tourData = {
            name,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            price: Number(price),
            totalSeats: Number(totalSeats),
            availableSeats: Number(totalSeats),
            description,
            highlights: highlights.split(',').map(h => h.trim()),
            duration,
            image: uploadResult.secure_url,
            status: status || 'Planned'
        };

        const tour = new tourModel(tourData);
        await tour.save();

        res.json({ success: true, message: "Tour Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Published Tours (Frontend)
const listTours = async (req, res) => {
    try {
        const tours = await tourModel.find({ status: 'Published' }).sort({ startDate: 1 });
        res.json({ success: true, tours });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List All Tours (Admin)
const adminListTours = async (req, res) => {
    try {
        const tours = await tourModel.find({}).sort({ dateCreated: -1 });
        res.json({ success: true, tours });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove Tour (Admin)
const removeTour = async (req, res) => {
    try {
        await tourModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Tour Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Single Tour Details
const getTourById = async (req, res) => {
    try {
        const { tourId } = req.body;
        const tour = await tourModel.findById(tourId);
        res.json({ success: true, tour });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Tour (Admin)
const updateTour = async (req, res) => {
    try {
        const { tourId, name, type, startDate, endDate, price, totalSeats, description, highlights, duration, status } = req.body;

        const updateData = {
            name,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            price: Number(price),
            totalSeats: Number(totalSeats),
            description,
            highlights: highlights.split(',').map(h => h.trim()),
            duration,
            status
        };

        const imageFile = req.file;
        if (imageFile) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = uploadResult.secure_url;
        }

        await tourModel.findByIdAndUpdate(tourId, updateData);

        res.json({ success: true, message: "Tour Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addTour, listTours, adminListTours, removeTour, getTourById, updateTour };
