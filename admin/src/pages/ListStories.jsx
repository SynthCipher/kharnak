import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ListStories = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);

    const fetchStories = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/story/list", { headers: { token } });
            if (data.success) {
                setStories(data.stories);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const removeStory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this story?")) {
            return;
        }
        if (!window.confirm("FINAL WARNING: This action is permanent and cannot be undone. Proceed?")) {
            return;
        }
        try {
            const { data } = await axios.post(backendUrl + "/api/story/remove", { id }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                fetchStories();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const editStory = (id) => {
        navigate(`/edit-story/${id}`);
    };
    useEffect(() => {
        fetchStories();
    }, [])

    return (
        <div className="w-full">
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Story Archive</h1>
                <p className="text-gray-500 font-medium tracking-tight">Curating the collective memory and cultural transmissions of Kharnak.</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
                {/* ----LIST TABLE TITLE */}
                <div className="hidden md:grid grid-cols-[1fr_3.5fr_1.5fr_1.5fr_1fr] items-center py-6 px-10 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>Transmision</span>
                    <span>Title</span>
                    <span>Chronicler</span>
                    <span>Genre</span>
                    <span className="text-center">Protocol</span>
                </div>

                {/* -------Story List -------- */}
                <div className="divide-y divide-gray-50">
                    {stories.length > 0 ? stories.reverse().map((story, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1.5fr_1fr] gap-4 items-center py-6 px-10 hover:bg-gray-50/50 transition-all group"
                        >
                            <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={story.mediaUrl} alt={story.title} />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-black text-gray-800 tracking-tight">{story.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">UUID: {story._id.slice(-8)}</p>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-xs font-bold text-gray-600">{story.author}</p>
                            </div>

                            <div className="hidden md:block">
                                <span className="px-3 py-1 bg-blue-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-600">
                                    {story.type}
                                </span>
                            </div>

                            <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => removeStory(story._id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-600/20 active:scale-90"
                                >
                                    <MdDeleteOutline className="text-xl" />
                                </button>
                                <button
                                    onClick={() => editStory(story._id)}
                                    className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all shadow-sm hover:shadow-yellow-600/20 active:scale-90"
                                >
                                    <MdEdit className="text-xl" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No cultural records detected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ListStories
