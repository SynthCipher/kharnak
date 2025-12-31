import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoHomeOutline, IoFootstepsOutline, IoPawOutline, IoLaptopOutline } from 'react-icons/io5';
import TourCard from '../components/TourCard';
import tourism_hero from '../assets/tourism_hero.png';
import SEO from '../components/SEO';

const Tourism = () => {
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

    const fetchTours = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/tour/list');
            if (data.success) {
                setTours(data.tours);
            }
        } catch (error) {
            console.error(error);
            // Non-blocking error for tourism page
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    return (
        <div className="min-h-screen bg-[#fcf9f2]">
            <SEO
                title="Tour & Travels"
                description="Book curated Leh Ladakh tours and winter tourism expeditions. Experience authentic nomadism with Kharnak's bespoke travel packages."
                keywords="Ladakh tour, Leh Ladakh travel, winter tourism Ladakh, Himalayan expeditions, Kharnak tours, nomad experience Ladakh"
            />
            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={tourism_hero}
                        alt="Kharnak Landscape"
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e1964]/40 via-transparent to-[#fcf9f2]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <span className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">Explore the Wild</span>
                    <h1 className="text-6xl md:text-8xl font-black text-[#1e1964] mb-8 tracking-tighter uppercase leading-none animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">Experience <br /><span className="text-white drop-shadow-2xl">Kharnak</span></h1>
                    <p className="text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                        Immerse yourself in nomadic culture, breathtaking high-altitude landscapes, and ancient hospitality traditions that have survived for centuries.
                    </p>
                </div>
            </div>

            {/* Scheduled Expeditions */}
            <div className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Limited Availability</p>
                        <h2 className="text-4xl md:text-5xl font-black text-[#1e1964] uppercase tracking-tighter">Scheduled Expeditions</h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-500 font-medium leading-relaxed">Join our curated group journeys designed for specific seasons and highlights of the Changthang plateau.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#1e1964] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {tours.length > 0 ? tours.map((tour) => (
                            <TourCard key={tour._id} tour={tour} />
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No scheduled tours at the moment</p>
                                <p className="text-xs text-gray-400 mt-2 italic">Check back soon for new expeditions</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stay with Us */}
            <div className="pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-sm border border-gray-50 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50/50 rounded-full blur-[100px] -ml-32 -mb-32" />

                        <div className="relative z-10 w-full">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 mx-auto">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-[#1e1964] uppercase tracking-tighter mb-8 max-w-2xl mx-auto leading-tight">Authentic Kharnak Living</h2>
                            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-3xl mb-16 mx-auto leading-relaxed">
                                Beyond scheduled tours, we offer year-round stays with local families. Experience the true nomadic rhythm, taste traditional Tsampa, and sleep under the star-studded high-altitude sky.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-[90rem] mx-auto">
                                {/* Homestays Card */}
                                <div
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-book-stay-modal', { detail: { bookingType: 'Homestay' } }))}
                                    className="p-8 md:p-10 bg-[#fcf9f2] rounded-[3rem] text-left border border-gray-100 hover:border-[#1e1964] transition-all duration-500 group relative overflow-hidden cursor-pointer flex flex-col h-full"
                                >
                                    <div className="mb-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#1e1964] group-hover:text-white transition-colors duration-500">
                                        <IoHomeOutline size={28} />
                                    </div>
                                    <h3 className="font-black text-2xl text-[#1e1964] mb-4 uppercase tracking-tighter relative z-10">Rebo Homestays</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed relative z-10 mb-8 flex-grow">
                                        Live like a local, not just a visitor. Stay in an authentic <span className="text-[#1e1964] font-bold underline decoration-blue-200">Rebo</span> (yak-hair tent) or a cozy nomadic home. Share stories over butter tea and learn the ancient wisdom of a culture that thrives in the high altitude.
                                    </p>
                                    <div className="flex items-center gap-2 text-[#1e1964] font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all mt-auto pt-4 border-t border-gray-200/50">
                                        <span>Inquire Now</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>

                                {/* Shepherd Life Card */}
                                <div
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-book-stay-modal', { detail: { bookingType: 'Experience the Shepherd Life' } }))}
                                    className="p-8 md:p-10 bg-[#fcf9f2] rounded-[3rem] text-left border border-gray-100 hover:border-[#1e1964] transition-all duration-500 group relative overflow-hidden cursor-pointer flex flex-col h-full"
                                >
                                    <div className="mb-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#1e1964] group-hover:text-white transition-colors duration-500">
                                        <IoPawOutline size={28} />
                                    </div>
                                    <h3 className="font-black text-2xl text-[#1e1964] mb-4 uppercase tracking-tighter relative z-10">Shepherd's Life</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed relative z-10 mb-8 flex-grow">
                                        Trace the ancient cycle of the herds. Journey alongside nomads as they guide thousands of sheep and goats across vast pastures. Witness the harvest of the world's finest <span className="text-[#1e1964] font-bold underline decoration-orange-200">Pashmina</span> at its source.
                                    </p>
                                    <div className="flex items-center gap-2 text-[#1e1964] font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all mt-auto pt-4 border-t border-gray-200/50">
                                        <span>Trace the Flock</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>

                                {/* Bespoke Treks Card */}
                                <div
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-book-stay-modal', { detail: { bookingType: 'Trek' } }))}
                                    className="p-8 md:p-10 bg-[#fcf9f2] rounded-[3rem] text-left border border-gray-100 hover:border-[#1e1964] transition-all duration-500 group relative overflow-hidden cursor-pointer flex flex-col h-full"
                                >
                                    <div className="mb-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#1e1964] group-hover:text-white transition-colors duration-500">
                                        <IoFootstepsOutline size={28} />
                                    </div>
                                    <h3 className="font-black text-2xl text-[#1e1964] mb-4 uppercase tracking-tighter relative z-10">Bespoke Treks</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed relative z-10 mb-8 flex-grow">
                                        Pathways known only to the locals. Explore custom-tailored routes through silent valleys and turquoise lakes. From the high passes of Rupshu to the hidden valleys of Kharnak, embark on a trek designed for the true explorer.
                                    </p>
                                    <div className="flex items-center gap-2 text-[#1e1964] font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all mt-auto pt-4 border-t border-gray-200/50">
                                        <span>Plan Your Journey</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>

                                {/* Remote Sanctuary Card */}
                                <div
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-book-stay-modal', { detail: { bookingType: 'Work from Remote Option' } }))}
                                    className="p-8 md:p-10 bg-[#fcf9f2] rounded-[3rem] text-left border border-gray-100 hover:border-[#1e1964] transition-all duration-500 group relative overflow-hidden cursor-pointer flex flex-col h-full"
                                >
                                    <div className="mb-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#1e1964] group-hover:text-white transition-colors duration-500">
                                        <IoLaptopOutline size={28} />
                                    </div>
                                    <h3 className="font-black text-2xl text-[#1e1964] mb-4 uppercase tracking-tighter relative z-10">Remote Focus</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed relative z-10 mb-8 flex-grow">
                                        Find your focus in the silence. Whether you are a digital nomad seeking a high-altitude office or a seeker looking for a quiet space to reflect, we offer unique <span className="text-[#1e1964] font-bold underline decoration-blue-200">Remote Stays</span> with connection to nature.
                                    </p>
                                    <div className="flex items-center gap-2 text-[#1e1964] font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all mt-auto pt-4 border-t border-gray-200/50">
                                        <span>Work Remotely</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Tourism;

