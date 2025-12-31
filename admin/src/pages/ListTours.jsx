import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoPeopleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ListTours = () => {
    const { backendUrl, token, currency } = useContext(AppContext);
    const [tours, setTours] = useState([]);
    const navigate = useNavigate();

    const fetchTours = async () => {
        try {
            const { data } = await axios.post(backendUrl + "/api/tour/admin-list", {}, {
                headers: { token },
            });
            if (data.success) {
                setTours(data.tours);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeTour = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tour?")) {
            return;
        }
        try {
            const { data } = await axios.post(
                backendUrl + "/api/tour/remove",
                { id },
                {
                    headers: { token },
                }
            );
            if (data.success) {
                toast.success(data.message);
                await fetchTours();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    return (
        <div className="w-full">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Tour Directory</h1>
                    <p className="text-gray-500 font-medium">Managing all scheduled group tours and expeditions.</p>
                </div>
                <button
                    onClick={() => navigate('/add-tour')}
                    className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                    Add New Tour +
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
                {/* ----LIST TABLE TITLE */}
                <div className="hidden md:grid grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr_1fr] items-center py-6 px-10 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>Visual</span>
                    <span>Tour Name</span>
                    <span>Dates</span>
                    <span>Price</span>
                    <span>Seats Left</span>
                    <span className="text-center">Protocol</span>
                </div>

                {/* -------Tour List -------- */}
                <div className="divide-y divide-gray-50">
                    {tours.length > 0 ? tours.map((tour, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr_1fr] gap-4 items-center py-6 px-10 hover:bg-gray-50/50 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={tour.image} alt={tour.name} />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-black text-gray-800 tracking-tight">{tour.name}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${tour.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {tour.status}
                                    </span>
                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                                        {tour.type}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-[10px] font-bold text-gray-600">
                                    {new Date(tour.startDate).toLocaleDateString()}
                                </p>
                                <p className="text-[10px] text-gray-400">to {new Date(tour.endDate).toLocaleDateString()}</p>
                            </div>

                            <div className="font-black text-gray-900 text-sm">
                                {currency}{tour.price}
                            </div>

                            <div className="font-bold text-gray-600 text-sm">
                                <span className={tour.availableSeats < 5 ? "text-red-500 font-black" : ""}>
                                    {tour.availableSeats} / {tour.totalSeats}
                                </span>
                            </div>

                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => navigate('/add-tour', { state: { tour } })}
                                    className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-600/20 active:scale-90"
                                >
                                    <FiEdit className="text-lg" />
                                </button>
                                <button
                                    onClick={() => navigate(`/applicants/${tour._id}`)}
                                    className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-green-600/20 active:scale-90"
                                >
                                    <IoPeopleOutline className="text-xl" />
                                </button>
                                <button
                                    onClick={() => removeTour(tour._id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-600/20 active:scale-90"
                                >
                                    <MdDeleteOutline className="text-xl" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No tour records detected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListTours;
