import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets"; // placeholder for upload area image

const EditStory = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("Story");
    const [author, setAuthor] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");

    // Fetch story details
    useEffect(() => {
        const fetchStory = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/story/${id}`, { headers: { token } });
                if (data.success) {
                    const story = data.story;
                    setTitle(story.title || "");
                    setContent(story.content || "");
                    setType(story.type || "Story");
                    setAuthor(story.author || "");
                    setExistingImageUrl(story.mediaUrl || "");
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        };
        fetchStory();
    }, [backendUrl, token, id]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }
        formData.append("title", title);
        formData.append("content", content);
        formData.append("type", type);
        formData.append("author", author);
        try {
            const { data } = await axios.put(`${backendUrl}/api/story/${id}`, formData, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                navigate("/list-stories");
            } else {
                toast.error(data.message);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="w-full max-w-2xl mx-auto p-8 bg-white rounded-[2rem] shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Edit Story</h1>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <label htmlFor="image" className="cursor-pointer group relative block w-40 h-40">
                    <div className="w-full h-full bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all flex items-center justify-center overflow-hidden">
                        {image ? (
                            <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Upload" />
                        ) : existingImageUrl ? (
                            <img className="w-full h-full object-cover" src={existingImageUrl} alt="Current" />
                        ) : (
                            <img className="w-12 opacity-30 group-hover:opacity-50 transition-opacity" src={assets.upload_area} alt="Upload" />
                        )}
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-4">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Narrative Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                        placeholder="Story Title"
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Author / Chronicler</label>
                    <input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                        placeholder="Author / Chronicler"
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Content Genre</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                    >
                        <option value="Story">Nomadic Story</option>
                        <option value="Documentary">Cultural Documentary</option>
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Narrative Body</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-40 font-medium text-gray-700 leading-relaxed"
                        placeholder="Story content..."
                        required
                    />
                </div>
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default EditStory;
