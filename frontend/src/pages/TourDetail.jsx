import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { IoCalendarOutline, IoPersonOutline, IoLocationOutline, IoCheckmarkCircleOutline, IoArrowBackOutline, IoWalletOutline, IoFlashOutline } from 'react-icons/io5';
import BookTourModal from '../components/BookTourModal';

const TourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [tour, setTour] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const sidebarRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSidebarVisible(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (sidebarRef.current) {
            observer.observe(sidebarRef.current);
        }

        // Auto-reopen if redirected back from login
        const shouldOpen = localStorage.getItem('pending_tour_booking_modal_open');
        if (shouldOpen === 'true' && token) {
            setIsModalOpen(true);
            localStorage.removeItem('pending_tour_booking_modal_open');
        }

        return () => {
            if (sidebarRef.current) {
                observer.unobserve(sidebarRef.current);
            }
        };
    }, [isLoading, tour, token]);

    useEffect(() => {
        const fetchTour = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.post(backendUrl + '/api/tour/single', { tourId: id });
                if (data.success) {
                    setTour(data.tour);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load tour details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTour();
        window.scrollTo(0, 0);
    }, [id, backendUrl]);

    const initPayment = (orderData, bookingId) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Kharnak Expeditions',
            description: `Tour: ${tour.name}`,
            order_id: orderData.id,
            receipt: bookingId,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/booking/verify', { ...response, bookingId }, { headers: { token } });
                    if (data.success) {
                        toast.success("Booking Confirmed!");
                        navigate('/profile');
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            theme: { color: "#1e1964" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleBookingStart = () => {
        setIsModalOpen(true);
    };

    const onBookingSuccess = async (bookingData) => {
        setIsModalOpen(false);
        setIsSubmitting(true);
        try {
            const bookingPayload = {
                tourId: tour._id,
                bookingType: tour.type,
                guests: Number(bookingData.guests),
                paymentOption: 'Full', // Defaulting to full for tour bookings in modal for simplicity
                dates: {
                    start: tour.startDate,
                    end: tour.endDate
                },
                specialRequests: bookingData.specialRequests,
                userName: bookingData.fullName,
                email: bookingData.email,
                phone: bookingData.phone
            };

            const { data } = await axios.post(backendUrl + '/api/booking/create', bookingPayload, { headers: { token } });
            if (data.success) {
                // Clear persistence data on success
                localStorage.removeItem('pending_tour_booking_data');
                localStorage.removeItem('pending_tour_booking_modal_open');

                initPayment(data.order, data.bookingId);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
                <div className="w-12 h-12 border-4 border-[#1e1964] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf9f2] p-6 text-center">
                <h1 className="text-4xl font-black text-[#1e1964] mb-4 uppercase tracking-tighter">Tour Not Found</h1>
                <button onClick={() => navigate('/tourism')} className="text-blue-600 font-bold hover:underline">Back to Tourism</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf9f2] pt-28 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/tourism')}
                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#1e1964] transition-colors mb-10 group"
                >
                    <IoArrowBackOutline className="text-xl group-hover:-translate-x-1 transition-transform" />
                    BACK TO TOURISM
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-12">
                        <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-12 border border-white/20">
                            <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-12 left-12 right-12">
                                <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                    {tour.type} Expedition
                                </span>
                                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{tour.name}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-12">
                        <section className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-sm border border-gray-50">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1e1964] underline underline-offset-8">Expedition Overview</h2>
                                <div className="flex items-center gap-2 text-[#1e1964]">
                                    <IoCalendarOutline className="text-xl" />
                                    <span className="text-sm font-black uppercase tracking-widest">{tour.duration}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed mb-10 italic">
                                "{tour.description}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-gray-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Launch Date</p>
                                    <p className="text-xl font-black text-[#1e1964]">
                                        {new Date(tour.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Conclusion</p>
                                    <p className="text-xl font-black text-[#1e1964]">
                                        {new Date(tour.endDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-lg font-black text-[#1e1964] uppercase tracking-tighter mb-8">Journey Highlights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {tour.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                                                <IoCheckmarkCircleOutline className="text-xl text-green-500" />
                                            </div>
                                            <span className="text-gray-700 font-bold text-sm tracking-tight leading-snug">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar Simplified */}
                    <div className="lg:col-span-4">
                        <div ref={sidebarRef} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-50 sticky top-28 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e1964]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />

                            <div className="relative z-10">
                                <div className="mb-8">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Expedition Fee</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-[#1e1964]">₹{tour.price}</span>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/ person</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <IoPersonOutline className="text-2xl text-[#1e1964]/50" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available</p>
                                            <p className="text-sm font-black text-[#1e1964]">{tour.availableSeats} Seats Left</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <IoWalletOutline className="text-2xl text-[#1e1964]/50" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Policy</p>
                                            <p className="text-sm font-black text-[#1e1964]">Instant Booking</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookingStart}
                                    disabled={isSubmitting || tour.availableSeats === 0}
                                    className="w-full bg-[#1e1964] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl shadow-blue-900/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {tour.availableSeats === 0 ? 'SOLD OUT' : (isSubmitting ? 'PROCESSING...' : 'Book My Expedition')}
                                </button>

                                <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4">
                                    Safe & Secure Payment via Razorpay
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Booking Bar for Mobile/Scroll */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-md transition-all duration-500 ${!isSidebarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl">
                    <div className="pl-4">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Fee</p>
                        <p className="text-xl font-black text-white leading-none">₹{tour.price}</p>
                    </div>
                    <button
                        onClick={handleBookingStart}
                        disabled={isSubmitting || tour.availableSeats === 0}
                        className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                        {tour.availableSeats === 0 ? 'SOLD OUT' : (isSubmitting ? '...' : <><IoFlashOutline className="text-lg" /> BOOK NOW</>)}
                    </button>
                </div>
            </div>

            <BookTourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tour={tour}
                onBookingSuccess={onBookingSuccess}
            />
        </div>
    );
};

export default TourDetail;
