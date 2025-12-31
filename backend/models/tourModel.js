import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    description: { type: String, required: true },
    highlights: { type: [String], required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['Planned', 'Published'], default: 'Planned' },
    dateCreated: { type: Date, default: Date.now }
});

const tourModel = mongoose.models.tour || mongoose.model("tour", tourSchema);

export default tourModel;
