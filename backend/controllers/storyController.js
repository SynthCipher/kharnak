import storyModel from "../models/storyModel.js";
import { v2 as cloudinary } from "cloudinary"

const addStory = async (req, res) => {
    try {
        const { title, content, type, author } = req.body;
        // Assuming single file upload for cover image/media
        const mediaFile = req.file;

        let mediaUrl = "";
        if (mediaFile) {
            const result = await cloudinary.uploader.upload(mediaFile.path, { resource_type: 'auto' });
            mediaUrl = result.secure_url;
        }

        const storyData = {
            title,
            content,
            type,
            author,
            mediaUrl,
            date: Date.now()
        }

        const story = new storyModel(storyData);
        await story.save();

        res.json({ success: true, message: "Story/Documentary Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const listStories = async (req, res) => {
    try {
        const stories = await storyModel.find({}).sort({ date: -1 });
        res.json({ success: true, stories })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeStory = async (req, res) => {
    try {
        await storyModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Story Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getSingleStory = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await storyModel.findById(id);
        if (story) {
            res.json({ success: true, story });
        } else {
            res.json({ success: false, message: "Story not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, author } = req.body;
        const mediaFile = req.file;

        const updateData = { title, content, type, author };

        if (mediaFile) {
            const result = await cloudinary.uploader.upload(mediaFile.path, { resource_type: 'auto' });
            updateData.mediaUrl = result.secure_url;
        }

        await storyModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Story Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const likeStory = async (req, res) => {
    try {
        const { id } = req.body;
        await storyModel.findByIdAndUpdate(id, { $inc: { likes: 1 } });
        res.json({ success: true, message: "Story Liked" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addStory, listStories, removeStory, getSingleStory, updateStory, likeStory }
