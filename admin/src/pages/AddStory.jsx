import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets"; // Reusing assets if needed or placeholders

const AddStory = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();
    const [image, setImage] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("Story"); // Story or Documentary
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (!image) {
                toast.error("Please upload a cover image");
                setIsSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", title);
            formData.append("content", content);
            formData.append("type", type);
            formData.append("author", author);

            const { data } = await axios.post(
                backendUrl + "/api/story/add",
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                // reset fields
                setTitle("");
                setContent("");
                setAuthor("");
                setImage(false);
                // navigate to list of stories
                navigate("/list-stories");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="w-full">
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Story Forge</h1>
                <p className="text-gray-500 font-medium tracking-tight">Archiving nomadic tales and cultural documentaries.</p>
            </div>

            <div className="w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50">
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Cinematic Cover</p>
                    <label htmlFor="image" className="cursor-pointer group relative block w-40 h-40">
                        <div className="w-full h-full bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all flex items-center justify-center overflow-hidden">
                            {image ? (
                                <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Upload" />
                            ) : (
                                <img className="w-12 opacity-30 group-hover:opacity-50 transition-opacity" src={assets.upload_area} alt="Upload" />
                            )}
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Narrative Title</p>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="text"
                                placeholder="The Silent Peaks of Kharnak"
                                required
                            />
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Author / Chronicler</p>
                            <input
                                onChange={(e) => setAuthor(e.target.value)}
                                value={author}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="text"
                                placeholder="Name of the narrator"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Content Genre</p>
                            <select
                                onChange={(e) => setType(e.target.value)}
                                value={type}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                            >
                                <option value="Story">Nomadic Story</option>
                                <option value="Documentary">Cultural Documentary</option>
                            </select>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Narrative Body</p>
                            <textarea
                                onChange={(e) => setContent(e.target.value)}
                                value={content}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 font-medium text-gray-700 leading-relaxed"
                                placeholder="Unfold the tale here..."
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`group relative px-12 py-5 ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-black hover:bg-blue-600'} text-white font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-2xl shadow-black/20 hover:shadow-blue-600/30 active:scale-95 disabled:opacity-50`}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Transmission'}
                    </button>
                </div>
            </div>
        </form>
    );
};


export default AddStory
