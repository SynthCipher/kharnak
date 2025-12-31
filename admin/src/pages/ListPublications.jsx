import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const ListPublications = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [publications, setPublications] = useState([]);

    const fetchPublications = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/publication/list", { headers: { token } });
            if (data.success) {
                setPublications(data.publications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const removePublication = async (id) => {
        if (!window.confirm("Are you sure you want to delete this publication?")) {
            return;
        }
        try {
            const { data } = await axios.post(backendUrl + "/api/publication/remove", { id }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                fetchPublications();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchPublications();
    }, [])

    return (
        <div className="w-full">
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Digital Library</h1>
                <p className="text-gray-500 font-medium tracking-tight">Managing the dynamic publications and media of Kharnak.</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="hidden md:grid grid-cols-[1fr_3.5fr_1.5fr_1.5fr_1fr] items-center py-6 px-10 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>Cover</span>
                    <span>Title</span>
                    <span>Type</span>
                    <span>Resources</span>
                    <span className="text-center">Action</span>
                </div>

                <div className="divide-y divide-gray-50">
                    {publications.length > 0 ? publications.map((pub, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_3.5fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1.5fr_1fr] gap-4 items-center py-6 px-10 hover:bg-gray-50/50 transition-all group"
                        >
                            <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={pub.imageUrl} alt={pub.title} />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-black text-gray-800 tracking-tight">{pub.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">UUID: {pub._id.slice(-8)}</p>
                            </div>

                            <div className="hidden md:block">
                                <span className="px-3 py-1 bg-purple-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-purple-600">
                                    {pub.type}
                                </span>
                            </div>

                            <div className="hidden md:block">
                                <div className="flex gap-2">
                                    {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline">Link</a>}
                                    {pub.fileUrl && <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">PDF</a>}
                                </div>
                            </div>

                            <div className="flex justify-center gap-2">
                                <Link
                                    to={`/edit-publication/${pub._id}`}
                                    className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-600/20 active:scale-90"
                                >
                                    <MdOutlineEdit className="text-xl" />
                                </Link>
                                <button
                                    onClick={() => removePublication(pub._id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-600/20 active:scale-90"
                                >
                                    <MdDeleteOutline className="text-xl" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">Library is empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListPublications;
