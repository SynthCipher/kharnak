import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5';

const StoryDetail = () => {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

    useEffect(() => {
        const fetchStories = async () => {
            try {
                // Ideally use getSingleStory endpoint if available, but sticking to existing pattern for safety or switching if easy. 
                // The previous code fetched all. Let's verify if I should switch.
                // The backend has router.get('/:id', getSingleStory). Let's use that for efficiency and better practice.
                const { data } = await axios.get(backendUrl + '/api/story/' + id);
                if (data.success) {
                    setStory(data.story);
                } else {
                    toast.error("Story not found");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load story");
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, [id]);

    const handleLike = async () => {
        const storageKey = `liked_story_${id}`;
        if (localStorage.getItem(storageKey)) {
            toast.info("You've already liked this story.");
            return;
        }

        try {
            // Optimistic update
            setStory(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
            localStorage.setItem(storageKey, 'true');

            // API Call
            await axios.post(backendUrl + '/api/story/like', { id });
        } catch (error) {
            console.error("Like error:", error);
            toast.error("Failed to like story");
            // Revert logic could go here
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f2]">
                <h2 className="text-2xl font-serif mb-4">Story not found</h2>
                <Link to="/culture" className="text-blue-600 underline">Back to Culture</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-[#f8f5f2] font-serif pt-15 pb-20">
            {/* Hero Image */}
            {story.mediaUrl && (
                <div className="w-full h-[50vh] md:h-[60vh] relative mb-12">
                    <img
                        src={story.mediaUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
            )}

            <article className="container mx-auto px-6 max-w-3xl">
                {/* Back Link */}
                <Link to="/culture" className="inline-flex items-center text-gray-500 hover:text-black mb-8 font-sans text-sm tracking-wide uppercase transition-colors">
                    <IoArrowBack className="mr-2" /> Back to Stories
                </Link>

                {/* Header */}
                <header className="text-center mb-12">
                    <span className="text-red-800 font-bold uppercase tracking-widest text-xs mb-4 block font-sans">
                        {story.type}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        {story.title}
                    </h1>
                    <div className="flex items-center justify-center text-gray-500 text-sm font-sans gap-6">
                        <span>By {story.author}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{new Date(story.date).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>

                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 ${localStorage.getItem(`liked_story_${story._id}`) ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-300 hover:border-red-300 hover:text-red-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{story.likes || 0}</span>
                        </button>
                    </div>
                    <div className="w-24 h-1 bg-red-800/20 mx-auto mt-8"></div>
                </header>

                {/* Content */}
                <div className="prose prose-lg prose-stone mx-auto">
                    <p className="text-xl text-gray-700 leading-loose whitespace-pre-wrap break-words font-light first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gray-900">
                        {story.content}
                    </p>
                </div>

                {/* Footer Section */}
                <div className="mt-20 pt-10 border-t border-gray-200 text-center">
                    <p className="italic text-gray-500 font-sans">
                        Documented by the Kharnak Cultural Preservation Project
                    </p>
                </div>
            </article>
        </div>
    );
};

export default StoryDetail;
