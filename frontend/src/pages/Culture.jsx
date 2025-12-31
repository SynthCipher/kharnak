import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookStayModal from '../components/BookStayModal';
import culture_hero from '../assets/culture_hero.png';

const Culture = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/story/list');
                if (data.success) {
                    setStories(data.stories);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        };
        fetchStories();
    }, []);

    const handleLike = async (e, id) => {
        e.preventDefault(); // Prevent navigation to detail page
        e.stopPropagation();

        const storageKey = `liked_story_${id}`;
        if (localStorage.getItem(storageKey)) {
            toast.info("You've already liked this story.");
            return;
        }

        try {
            // Optimistic update
            setStories(prev => prev.map(story =>
                story._id === id ? { ...story, likes: (story.likes || 0) + 1 } : story
            ));
            localStorage.setItem(storageKey, 'true');

            // API Call
            await axios.post(backendUrl + '/api/story/like', { id });
            // toast.success("Liked!"); // Optional: Feedback might be too noisy if optimistic
        } catch (error) {
            console.error("Like error:", error);
            // Revert if failed (optional, but good practice. For now keeping simple as per request)
            toast.error("Failed to like story");
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f2]">
            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={culture_hero}
                        alt="Kharnak Nomadic Culture"
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e1964]/60 via-transparent to-[#fcf9f2]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <Link to="/" className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/10 hover:bg-white/40 transition-all">← Back to Home</Link>
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-none drop-shadow-2xl">
                        Stories of <br /><span className="text-[#fcf9f2]">Kharnak</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed italic drop-shadow-lg">
                        "Documenting the oral histories, myths, and daily lives of our people."
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-24">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {stories.map((story) => (
                        <Link to={`/culture/${story._id}`} key={story._id} className="group block h-full">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                                {story.mediaUrl && (
                                    <div className="overflow-hidden rounded-lg mb-6 h-64 bg-[#f5f5dc] shrink-0">
                                        <img src={story.mediaUrl} alt={story.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                )}
                                <span className="text-red-800 font-bold uppercase tracking-widest text-[10px] mb-3 block break-words">{story.type}</span>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif group-hover:text-red-900 transition-colors line-clamp-2 break-words">{story.title}</h2>
                                <div className="flex items-center text-gray-400 text-xs mb-6 font-sans uppercase tracking-wide">
                                    <span>By {story.author}</span>
                                    <span className="mx-2">•</span>
                                    <span>{new Date(story.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-light text-base line-clamp-2 mb-6 flex-grow break-words">{story.content}</p>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-red-800 font-bold uppercase text-xs tracking-widest group-hover:gap-2 transition-all">
                                        Read Story <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </div>

                                    <button
                                        onClick={(e) => handleLike(e, story._id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${localStorage.getItem(`liked_story_${story._id}`) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                        title="Like this story"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-sans font-medium">{story.likes || 0}</span>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {stories.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p>No stories documented yet.</p>
                    </div>
                )}
            </div>
            <BookStayModal />
        </div>
    );
};

export default Culture;
