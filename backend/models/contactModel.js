import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, required: true, enum: ['tourist', 'researcher', 'other'] },
    date: { type: Number, default: Date.now }
});

const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);

export default contactModel;
