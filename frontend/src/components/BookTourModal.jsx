import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoPersonOutline, IoMailOutline, IoCallOutline, IoPeopleOutline, IoCalendarOutline, IoChatboxEllipsesOutline } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const BookTourModal = ({ isOpen, onClose, tour, onBookingSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, backendUrl } = useContext(ShopContext);

    const [isLoading, setIsLoading] = useState(false);
    const [isBookingForOther, setIsBookingForOther] = useState(false);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        guests: 1,
        specialRequests: ''
    });

    useEffect(() => {
        // Load saved data if exists (for guests returning as users)
        const savedData = localStorage.getItem('pending_tour_booking_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Only load if it's the same tour
                if (parsed.tourId === tour._id) {
                    setUserData(prev => ({ ...prev, ...parsed.userData }));
                }
            } catch (e) {
                console.error("Error parsing saved tour booking data", e);
            }
        }
    }, [isOpen, tour._id]);

    useEffect(() => {
        if (isOpen && token && !isBookingForOther) {
            fetchUserProfile();
        } else if (isBookingForOther) {
            // Clear identity fields if booking for other
            setUserData(prev => ({
                ...prev,
                fullName: '',
                email: '',
                phone: ''
            }));
        }
    }, [isOpen, token, isBookingForOther]);

    const fetchUserProfile = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
            if (data.success) {
                setUserData(prev => ({
                    ...prev,
                    fullName: data.user.name || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '' // Assuming phone exists in profile
                }));
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (userData.guests > tour.availableSeats) {
            toast.error(`Only ${tour.availableSeats} seats available.`);
            setIsLoading(false);
            return;
        }

        if (!token) {
            // Save data for persistence
            localStorage.setItem('pending_tour_booking_data', JSON.stringify({
                tourId: tour._id,
                userData
            }));
            localStorage.setItem('pending_tour_booking_modal_open', 'true');

            toast.info("Please login to proceed with your expedition booking");
            onClose();
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            // This will call the same handleBooking logic but from the parent or here.
            // For consistency, let's just pass the data back to parents or handle it here.
            // I'll handle it here for simplicity.
            onBookingSuccess(userData);
        } catch (error) {
            console.error(error);
            toast.error("Booking failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
                            <IoClose className="text-2xl text-gray-400" />
                        </button>

                        <div className="mb-10 text-center md:text-left">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">Expedition Booking</span>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight mb-2">
                                Forge Your Journey
                            </h2>
                            <p className="text-gray-500 font-medium">Securing your spot for {tour.name}</p>
                        </div>

                        <div className="mb-8 flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Booking for someone else?</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Toggle to enter traveler details manually</p>
                            </div>
                            <button
                                onClick={() => setIsBookingForOther(!isBookingForOther)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isBookingForOther ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <motion.div
                                    animate={{ x: isBookingForOther ? 26 : 4 }}
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Full Name *</label>
                                    <div className="relative">
                                        <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            name="fullName"
                                            value={userData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Email *</label>
                                    <div className="relative">
                                        <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Phone Number *</label>
                                    <div className="relative">
                                        <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Number of People *</label>
                                    <div className="relative">
                                        <IoPeopleOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="number"
                                            name="guests"
                                            min="1"
                                            max={tour.availableSeats}
                                            value={userData.guests}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Preferred Tour Dates</label>
                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <IoCalendarOutline className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 tracking-tight">
                                            {new Date(tour.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' })} – {new Date(tour.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' })}
                                        </p>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Dates are fixed for this scheduled tour</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Special Requests / Questions</label>
                                <div className="relative">
                                    <IoChatboxEllipsesOutline className="absolute left-4 top-4 text-gray-400" />
                                    <textarea
                                        name="specialRequests"
                                        value={userData.specialRequests}
                                        onChange={handleInputChange}
                                        placeholder="Any special requests, dietary restrictions, or questions..."
                                        rows="3"
                                        className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed group active:scale-[0.98]"
                            >
                                {isLoading ? "Processing..." : "Continue to Payment"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookTourModal;
