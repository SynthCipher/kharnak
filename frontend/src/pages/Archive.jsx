import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Archive = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { backendUrl } = useContext(ShopContext);

    const fetchPublications = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/publication/list');
            if (data.success) {
                setPublications(data.publications);
            }
        } catch (error) {
            console.error("Error fetching publications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return "";
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop().split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-[#1e1964] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">DIGITAL LIBRARY</h3>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1e1964] mb-4">Articles & <span className="text-[#EA4C89]">Publications</span></h1>
                    <p className="text-gray-500 text-lg font-light italic max-w-2xl mx-auto">A comprehensive archive of Kharnak’s legacy through published works, films, and documentaries.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {publications.map((pub, index) => (
                        <div key={index} className="group relative rounded-2xl overflow-hidden shadow-xl h-96 bg-white border border-gray-100 transition-all duration-500 hover:-translate-y-2">
                            {pub.type === 'YouTube Video' && pub.url ? (
                                <div className="w-full h-full flex flex-col">
                                    <iframe
                                        className="w-full h-64 border-0"
                                        src={getYouTubeEmbedUrl(pub.url)}
                                        title={pub.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <h4 className="italic text-sm text-[#EA4C89] font-serif mb-1">YouTube Video</h4>
                                            <h3 className="font-bold text-lg text-[#1e1964] leading-tight line-clamp-2">{pub.title}</h3>
                                        </div>
                                        <p className="text-gray-500 text-xs line-clamp-3 mt-2">{pub.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <img src={pub.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={pub.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <h4 className="italic text-lg mb-2 text-[#EA4C89] font-serif">
                                                {pub.type}
                                                <span className="text-[10px] text-white uppercase not-italic tracking-wider border border-white/30 px-2 py-0.5 ml-2 align-middle rounded-full">
                                                    {pub.type === 'YouTube Video' ? 'Video' : 'Read'}
                                                </span>
                                            </h4>
                                            <h3 className="font-bold text-xl leading-tight mb-4 line-clamp-2">{pub.title}</h3>
                                            <p className="text-gray-300 text-sm mb-6 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                {pub.description}
                                            </p>
                                            <div className="flex gap-4">
                                                {pub.url && (
                                                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] bg-white text-black px-6 py-3 rounded-xl hover:bg-[#EA4C89] hover:text-white transition-all transform hover:scale-105 shadow-lg">
                                                        {pub.type === 'YouTube Video' ? 'Watch Now' : 'View Link'}
                                                    </a>
                                                )}
                                                {pub.fileUrl && (
                                                    <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-lg">
                                                        Read PDF
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {publications.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest">No publications found</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archive;
