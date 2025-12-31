import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true }, // "Story" or "Documentary"
    mediaUrl: { type: String }, // Image or Video URL
    author: { type: String },
    date: { type: Number, required: true },
    likes: { type: Number, default: 0 }
})

const storyModel = mongoose.models.story || mongoose.model('story', storySchema)

export default storyModel
