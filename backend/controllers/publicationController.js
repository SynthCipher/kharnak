import publicationModel from "../models/publicationModel.js";
import { v2 as cloudinary } from "cloudinary";

// function for add publication
const addPublication = async (req, res) => {
    try {
        const { title, type, url, description } = req.body;

        const imageFile = req.files.image && req.files.image[0];
        const docFile = req.files.file && req.files.file[0];

        if (!imageFile && type !== 'YouTube Video') {
            return res.json({ success: false, message: "Thumbnail image is required" });
        }

        let imageUrl = "";
        if (imageFile) {
            const imageResult = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            imageUrl = imageResult.secure_url;
        } else if (type === 'YouTube Video' && url) {
            // Extract YouTube thumbnail
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop().split('?')[0];
            imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }

        let fileUrl = "";
        if (docFile) {
            const docResult = await cloudinary.uploader.upload(docFile.path, { resource_type: 'auto' });
            fileUrl = docResult.secure_url;
        }

        const publicationData = {
            title,
            type,
            url,
            fileUrl,
            imageUrl,
            description,
            date: Date.now()
        }

        const publication = new publicationModel(publicationData);
        await publication.save();

        res.json({ success: true, message: "Publication Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for listing publications
const listPublications = async (req, res) => {
    try {
        const publications = await publicationModel.find({}).sort({ date: -1 });
        res.json({ success: true, publications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for removing publication
const removePublication = async (req, res) => {
    try {
        await publicationModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Publication Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updatePublication = async (req, res) => {
    try {
        const { id, title, type, url, description } = req.body;
        const imageFile = req.files.image && req.files.image[0];
        const docFile = req.files.file && req.files.file[0];

        const updateData = { title, type, url, description };

        if (imageFile) {
            const imageResult = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            updateData.imageUrl = imageResult.secure_url;
        } else if (type === 'YouTube Video' && url) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop().split('?')[0];
            updateData.imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }

        if (docFile) {
            const docResult = await cloudinary.uploader.upload(docFile.path, { resource_type: 'auto' });
            updateData.fileUrl = docResult.secure_url;
        }

        await publicationModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Publication Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addPublication, listPublications, removePublication, updatePublication }
