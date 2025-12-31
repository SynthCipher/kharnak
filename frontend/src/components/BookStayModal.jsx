import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoClose, IoCalendarOutline } from 'react-icons/io5';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const BookStayModal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useContext(ShopContext);
    const [isOpen, setIsOpen] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phone: '',
        bookingType: 'Trek',
        guests: 1,
        startDate: '',
        endDate: '',
        paymentOption: 'Full',
        agreedToTerms: false
    });

    // Handle Persistence & Auto-open
    useEffect(() => {
        // Load saved data if exists
        const savedData = localStorage.getItem('pending_stay_booking_data');
        if (savedData) {
            try {
                setFormData(JSON.parse(savedData));
            } catch (e) {
                console.error("Error parsing saved booking data", e);
            }
        }

        // Auto-open if redirected back from login
        const shouldOpen = localStorage.getItem('pending_stay_booking_modal_open');
        if (shouldOpen === 'true' && token) {
            setIsOpen(true);
            localStorage.removeItem('pending_stay_booking_modal_open');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const initPayment = (orderData, bookingId) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Experience Kharnak',
            description: `Booking for ${formData.bookingType}`,
            order_id: orderData.id,
            receipt: bookingId,
            handler: async (response) => {
                try {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.post(backendUrl + '/api/booking/verify', { ...response, bookingId }, { headers: { token } });
                    if (data.success) {
                        toast.success(data.message);
                        setIsOpen(false);
                        navigate('/profile');
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            // Save data for persistence
            localStorage.setItem('pending_stay_booking_data', JSON.stringify(formData));
            localStorage.setItem('pending_stay_booking_modal_open', 'true');

            toast.info("Please login to proceed with your booking");
            setIsOpen(false);
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (isSubmitting) return;
        if (!formData.agreedToTerms) {
            toast.error("Please agree to the Terms and Conditions to proceed");
            return;
        }
        setIsSubmitting(true);
        try {
            const bookingPayload = {
                userName: formData.userName,
                email: formData.email,
                phone: formData.phone,
                bookingType: formData.bookingType,
                guests: formData.guests,
                paymentOption: formData.paymentOption,
                dates: {
                    start: formData.startDate,
                    end: formData.endDate
                }
            };

            const { data } = await axios.post(backendUrl + '/api/booking/create', bookingPayload, { headers: { token } });

            if (data.success) {
                // Clear persistence data on success
                localStorage.removeItem('pending_stay_booking_data');
                localStorage.removeItem('pending_stay_booking_modal_open');

                initPayment(data.order, data.bookingId);
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
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 bg-[#1e1964] text-white px-6 py-4 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center gap-3 font-bold uppercase tracking-widest text-xs border-2 border-white/20"
            >
                <IoCalendarOutline className="text-xl" />
                Book Stay
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="bg-[#1e1964] p-6 flex justify-between items-center">
                            <h2 className="text-white text-xl font-black uppercase tracking-widest">Plan Your Trip</h2>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                <IoClose size={28} />
                            </button>
                        </div>

                        <div className="flex justify-center py-4 bg-gray-50/50 border-b border-gray-100">
                            <img src={assets.logo} alt="Kharnak Logo" className="h-16 w-auto" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]" placeholder="+91 9876543210" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]" placeholder="email@example.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Experience Type</label>
                                <select name="bookingType" value={formData.bookingType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]">
                                    <option value="Trek">Trek</option>
                                    <option value="Experience the Shepherd Life">Experience the Shepherd Life</option>
                                    <option value="Work from Remote Option">Work from Remote Option</option>
                                    <option value="Homestay">Homestay</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Check-in</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Check-out</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} min={formData.startDate || new Date().toISOString().split('T')[0]} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Number of Guests</label>
                                <input type="number" name="guests" min="1" value={formData.guests} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e1964]/20 focus:border-[#1e1964]" />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Payment Option</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-lg border border-gray-100 hover:border-[#1e1964] transition-colors">
                                        <input type="radio" name="paymentOption" value="Full" checked={formData.paymentOption === 'Full'} onChange={handleChange} className="w-4 h-4 accent-[#1e1964]" />
                                        <div>
                                            <span className="block text-sm font-bold text-gray-800">Full Payment</span>
                                            <span className="block text-[10px] text-gray-500">Pay the entire amount now for a confirmed booking.</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-lg border border-gray-100 hover:border-[#1e1964] transition-colors">
                                        <input type="radio" name="paymentOption" value="Deposit" checked={formData.paymentOption === 'Deposit'} onChange={handleChange} className="w-4 h-4 accent-[#1e1964]" />
                                        <div>
                                            <span className="block text-sm font-bold text-gray-800">30% Deposit</span>
                                            <span className="block text-[10px] text-red-500 font-bold uppercase tracking-tight">Non-refundable</span>
                                            <span className="block text-[10px] text-gray-500">Pay 30% to reserve your spot (Non-refundable).</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    name="agreedToTerms"
                                    id="agreedToTerms"
                                    checked={formData.agreedToTerms}
                                    onChange={handleChange}
                                    required
                                    className="w-4 h-4 accent-[#1e1964] cursor-pointer"
                                />
                                <label htmlFor="agreedToTerms" className="text-xs font-bold text-gray-500 cursor-pointer">
                                    I agree to the <Link to="/terms-and-conditions" onClick={() => setIsOpen(false)} className="text-[#1e1964] underline">Terms and Conditions</Link>
                                </label>
                            </div>

                            <button disabled={isSubmitting} type="submit" className="w-full bg-[#1e1964] hover:bg-black text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Processing...' : 'Book Now & Pay'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookStayModal;
