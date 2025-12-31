import mongoose from 'mongoose'

const publicationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Article', 'Feature Documentary', 'Film', 'YouTube Video']
    },
    url: { type: String }, // For YouTube or external links
    fileUrl: { type: String }, // For PDF files stored in cloud
    imageUrl: { type: String, required: true }, // Thumbnail image
    description: { type: String },
    date: { type: Number, required: true }
}, { timestamps: true })

const publicationModel = mongoose.models.publication || mongoose.model('publication', publicationSchema)

export default publicationModel
