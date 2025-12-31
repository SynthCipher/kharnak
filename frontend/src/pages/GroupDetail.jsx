import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { groupsData } from '../assets/assets';
import { IoArrowBackOutline, IoPersonOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const GroupDetail = () => {
    const { id } = useParams();
    const group = groupsData.find(g => g.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!group) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf9f2] p-6 text-center">
                <h1 className="text-4xl font-bold text-[#1e1964] mb-4">Group Not Found</h1>
                <p className="text-gray-600 mb-8">The group you are looking for does not exist.</p>
                <Link to="/" className="px-8 py-3 bg-[#1e1964] text-white rounded-full hover:bg-[#2a247a] transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#fcf9f2] pt-24 pb-20 px-6"
        >
            <div className="max-w-4xl mx-auto mt-5">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-[#1e1964] font-bold mb-10 hover:translate-x-[-4px] transition-transform"
                >
                    <IoArrowBackOutline className="mr-2 text-xl" /> Back to Home
                </Link>

                {/* Hero Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12 border border-blue-50">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-lg border-4 border-[#fcf9f2]">
                            <img src={group.logo} alt={group.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h4 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">United in Tradition</h4>
                            <h1 className="text-4xl md:text-5xl font-black text-[#1e1964] mb-3 leading-tight">{group.name}</h1>
                            <h2 className="text-2xl md:text-3xl font-serif text-[#1e1964]/80 mb-6">{group.tibetanName}</h2>

                            <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                <IoPersonOutline className="text-blue-600 mr-2" />
                                <span className="text-[#1e1964] font-bold">{group.president} <span className="text-blue-500 font-normal text-xs uppercase ml-1">President</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none text-gray-700">
                        <p className="text-xl leading-relaxed font-light italic text-[#1e1964]/70 mb-8 border-l-4 border-blue-200 pl-6">
                            {group.description}
                        </p>
                        <div className="text-lg leading-relaxed whitespace-pre-line text-gray-600">
                            {group.longDescription}
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {group.images.map((img, index) => (
                        <div key={index} className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group">
                            <img
                                src={img}
                                alt={`${group.name} gallery ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default GroupDetail;
