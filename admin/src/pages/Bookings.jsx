import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { RiCalendarEventLine } from "react-icons/ri"; // Using react-icons

const Bookings = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        if (!token) return null;
        try {
            const { data } = await axios.get(backendUrl + "/api/booking/list", {
                headers: { token },
            });
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const statusHandler = async (bookingId, status) => {
        if (!token) return null;
        try {
            const { data } = await axios.post(
                backendUrl + "/api/booking/status",
                { bookingId, status },
                { headers: { token } }
            );
            if (data.success) {
                await fetchBookings();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) fetchBookings();
    }, [token]);

    return (
        <div className="w-full">
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Booking Nexus</h1>
                <p className="text-gray-500 font-medium">Curating and managing traveler experiences in Kharnak.</p>
            </div>

            <div className="flex flex-col gap-6">
                {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                        <div
                            key={index}
                            className="group grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.7fr_2.5fr_1.5fr_1.2fr_1.5fr] gap-6 items-start bg-white border border-gray-50 p-6 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <RiCalendarEventLine className="text-3xl text-blue-600" />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-lg font-black text-gray-900 leading-none">{booking.userName}</p>
                                    <p className="text-xs font-bold text-blue-500 mt-1">{booking.email}</p>
                                    <p className="text-xs font-bold text-gray-600 mt-1">{booking.phone}</p>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-3 py-1 rounded-full">
                                        {booking.bookingType}
                                    </span>
                                    <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-tighter">Capacity: {booking.guests} Guests</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Timeframe</p>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-800">Start: {new Date(booking.dates.start).toLocaleDateString()}</p>
                                        <p className="text-xs font-bold text-gray-800">End: {new Date(booking.dates.end).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Detail</p>
                                    <p className="text-sm font-black text-indigo-600">₹{booking.amount} <span className="text-[10px] font-bold text-gray-400">({booking.paymentOption})</span></p>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${booking.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {booking.payment ? 'PAID' : 'UNPAID'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status Protocol</p>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {booking.status}
                                    </span>
                                    <p className="mt-2 text-[10px] text-gray-300 font-bold">Logged: {new Date(booking.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Update Status</p>
                                <select
                                    onChange={(e) => statusHandler(booking._id, e.target.value)}
                                    value={booking.status}
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl font-bold text-xs text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No explorer requests detected</p>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Bookings;
