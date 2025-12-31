import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendarOutline, IoPersonOutline, IoArrowForward } from 'react-icons/io5';

const TourCard = ({ tour }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1e1964]">
                        {tour.type}
                    </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <p className="text-white text-lg font-black tracking-tight leading-tight">{tour.name}</p>
                    </div>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <IoCalendarOutline className="text-lg text-blue-600" />
                        <span className="text-xs font-bold">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <IoPersonOutline className="text-lg text-green-600" />
                        <span className="text-xs font-bold">{tour.availableSeats} Seats Left</span>
                    </div>
                </div>

                <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                    {tour.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Per Person</span>
                        <span className="text-2xl font-black text-[#1e1964]">₹{tour.price}</span>
                    </div>
                    <button
                        onClick={() => navigate(`/tour/${tour._id}`)}
                        className="bg-[#1e1964] text-white p-4 rounded-2xl hover:bg-black transition-all group/btn shadow-lg shadow-blue-900/20"
                    >
                        <IoArrowForward className="text-xl group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
