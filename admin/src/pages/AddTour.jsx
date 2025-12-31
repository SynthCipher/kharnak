import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";

const AddTour = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isEdit = location.state && location.state.tour;
    const tourData = location.state?.tour;

    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("Trek");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [price, setPrice] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [description, setDescription] = useState("");
    const [highlights, setHighlights] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("Planned");

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setName(tourData.name);
            setType(tourData.type);
            setStartDate(new Date(tourData.startDate).toISOString().split('T')[0]);
            setEndDate(new Date(tourData.endDate).toISOString().split('T')[0]);
            setPrice(tourData.price);
            setTotalSeats(tourData.totalSeats);
            setDescription(tourData.description);
            setHighlights(tourData.highlights.join(', '));
            setDuration(tourData.duration);
            setStatus(tourData.status);
        }
    }, [isEdit, tourData]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!image && !isEdit) {
                setIsSubmitting(false);
                return toast.error("Please upload a tour image.");
            }

            const formData = new FormData();
            if (isEdit) formData.append("tourId", tourData._id);
            formData.append("name", name);
            formData.append("type", type);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("price", price);
            formData.append("totalSeats", totalSeats);
            formData.append("description", description);
            formData.append("highlights", highlights);
            formData.append("duration", duration);
            formData.append("status", status);
            if (image) formData.append("image", image);

            const endpoint = isEdit ? "/api/tour/update" : "/api/tour/add";
            const { data } = await axios.post(backendUrl + endpoint, formData, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                navigate("/list-tours");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="w-full">
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>{isEdit ? "Tour Refinement" : "Tour Forge"}</h1>
                <p className="text-gray-500 font-medium">{isEdit ? "Update and modify existing tour details." : "Create and publish new scheduled group tours for Kharnak Tourism."}</p>
            </div>

            <div className="w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50">
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">{isEdit ? "Update Visual (Optional)" : "Tour Visual"}</p>
                    <div className="flex gap-4 flex-wrap">
                        <label className="cursor-pointer group relative">
                            <div className="w-40 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-50/10 transition-all flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                                ) : isEdit ? (
                                    <img src={tourData.image} alt="Current" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <img className="w-8 opacity-40 group-hover:opacity-60 transition-opacity mb-1" src={assets.upload_area} alt="Upload" />
                                        <span className="text-[9px] font-bold text-gray-400 group-hover:text-blue-500 uppercase tracking-wider">Upload +</span>
                                    </div>
                                )}
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" hidden />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tour Name *</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="text"
                                placeholder="e.g. Ladakh Winter Adventure"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description *</p>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 font-medium text-gray-700"
                                placeholder="Tour description..."
                                required
                            />
                        </div>

                        <div className="w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Highlights (comma separated) *</p>
                            <textarea
                                onChange={(e) => setHighlights(e.target.value)}
                                value={highlights}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 font-medium text-gray-700"
                                placeholder="e.g. Snow Leopard Tracking, Photography Opportunities, Expert Guides"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tour Type *</p>
                                <select
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                >
                                    <option value="Trek">Trek</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Photography">Photography</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Duration *</p>
                                <input
                                    onChange={(e) => setDuration(e.target.value)}
                                    value={duration}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                    type="text"
                                    placeholder="e.g. 7 Days / 6 Nights"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Start Date *</p>
                                <input
                                    onChange={(e) => setStartDate(e.target.value)}
                                    value={startDate}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                    type="date"
                                    required
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">End Date *</p>
                                <input
                                    onChange={(e) => setEndDate(e.target.value)}
                                    value={endDate}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Price Per Person (₹) *</p>
                                <input
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                    type="number"
                                    placeholder="e.g. 45000"
                                    required
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Available Seats *</p>
                                <input
                                    onChange={(e) => setTotalSeats(e.target.value)}
                                    value={totalSeats}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                    type="number"
                                    placeholder="e.g. 15"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Publish Status</p>
                                <select
                                    onChange={(e) => setStatus(e.target.value)}
                                    value={status}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                                >
                                    <option value="Planned">Planned</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-12 py-5 bg-black hover:bg-blue-600 text-white font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-2xl shadow-black/20 hover:shadow-blue-600/30 active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Processing..." : isEdit ? "Update Tour Details" : "Create Tour Entry"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddTour;
