import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const EditPublication = () => {
    const { backendUrl, token } = useContext(AppContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState(false);
    const [file, setFile] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Article");
    const [url, setUrl] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [existingFileUrl, setExistingFileUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPublicationDetails = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/publication/list");
            if (data.success) {
                const pub = data.publications.find(p => p._id === id);
                if (pub) {
                    setTitle(pub.title);
                    setDescription(pub.description);
                    setType(pub.type);
                    setUrl(pub.url);
                    setExistingImageUrl(pub.imageUrl);
                    setExistingFileUrl(pub.fileUrl);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch details");
        }
    }

    useEffect(() => {
        fetchPublicationDetails();
    }, [id]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("id", id);
            if (image) formData.append("image", image);
            if (file) formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("type", type);
            formData.append("url", url);

            const { data } = await axios.post(
                backendUrl + "/api/publication/update",
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                navigate("/list-publications");
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
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Edit Publication</h1>
                <p className="text-gray-500 font-medium tracking-tight">Refine and update library contents.</p>
            </div>

            <div className="w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50">
                <div className="flex flex-wrap gap-10 mb-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Thumbnail Image</p>
                        <label htmlFor="image" className="cursor-pointer group relative block w-40 h-40">
                            <div className="w-full h-full bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Upload" />
                                ) : existingImageUrl ? (
                                    <img className="w-full h-full object-cover" src={existingImageUrl} alt="Existing" />
                                ) : (
                                    <img className="w-12 opacity-30 group-hover:opacity-50 transition-opacity" src={assets.upload_area} alt="Upload" />
                                )}
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                        </label>
                    </div>

                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 mb-4">PDF Document</p>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="file" className="cursor-pointer group relative block w-40 h-40">
                                <div className="w-full h-full bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 group-hover:border-purple-400 group-hover:bg-purple-50/30 transition-all flex flex-col items-center justify-center overflow-hidden p-4">
                                    {file ? (
                                        <div className="text-center">
                                            <i className="fa fa-file-pdf-o text-4xl text-red-500 mb-2"></i>
                                            <p className="text-[10px] font-bold text-gray-600 truncate w-32">{file.name}</p>
                                        </div>
                                    ) : existingFileUrl ? (
                                        <div className="text-center">
                                            <i className="fa fa-file-pdf-o text-4xl text-green-500 mb-2"></i>
                                            <p className="text-[10px] font-bold text-gray-600">Existing PDF</p>
                                        </div>
                                    ) : (
                                        <img className="w-12 opacity-30 group-hover:opacity-50 transition-opacity" src={assets.upload_area} alt="Upload" />
                                    )}
                                </div>
                                <input onChange={(e) => setFile(e.target.files[0])} type="file" id="file" accept=".pdf" hidden />
                            </label>
                            {(file || existingFileUrl) && <button type="button" onClick={() => { setFile(false); setExistingFileUrl("") }} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Remove File</button>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Publication Title</p>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="text"
                                required
                            />
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Content Type</p>
                            <select
                                onChange={(e) => setType(e.target.value)}
                                value={type}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                            >
                                <option value="Article">Article</option>
                                <option value="Feature Documentary">Feature Documentary</option>
                                <option value="Film">Film</option>
                                <option value="YouTube Video">YouTube Video</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">URL / Link</p>
                            <input
                                onChange={(e) => setUrl(e.target.value)}
                                value={url}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="text"
                            />
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Short Description</p>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 font-medium text-gray-700 leading-relaxed"
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
                        {isSubmitting ? 'Updating...' : 'Update Publication'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditPublication;
