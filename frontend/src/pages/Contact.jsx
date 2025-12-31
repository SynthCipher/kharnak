import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { RiMailSendLine, RiUserLocationLine } from 'react-icons/ri'

const Contact = () => {
    const [contact, setContact] = useState({
        name: "",
        email: "",
        message: "",
        category: ""
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/contact/add', contact);
            if (data.success) {
                toast.success(data.message);
                setContact({ name: "", email: "", message: "", category: "" });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <div className='bg-gray-50 min-h-screen pt-10 pb-20'>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-yellow-600 uppercase tracking-widest text-sm font-bold mb-2">Let's Connect</h3>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">Whether you are a tourist planning a visit, a researcher interested in our culture, or just want to say hello, we'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Form */}
                    <div className="bg-white text-gray-800 p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
                        <div className='flex items-center gap-3 mb-8'>
                            <RiMailSendLine className='text-3xl text-yellow-600' />
                            <h3 className="text-2xl font-bold">Send us a Message</h3>
                        </div>

                        <form onSubmit={onSubmitHandler} className="space-y-6">

                            <div className="flex flex-col text-left">
                                <label htmlFor="NAME" className="mb-2 font-medium text-gray-700">Name</label>
                                <input onChange={(e) => setContact({ ...contact, name: e.target.value })} value={contact.name} type="text" id="NAME" name="name" required placeholder="Your name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none w-full transition-shadow" />
                            </div>

                            <div className="flex flex-col text-left">
                                <label htmlFor="EMAIL" className="mb-2 font-medium text-gray-700">Email</label>
                                <input onChange={(e) => setContact({ ...contact, email: e.target.value })} value={contact.email} type="email" id="EMAIL" name="email" required placeholder="Your email address" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none w-full transition-shadow" />
                            </div>

                            <div className="flex flex-col text-left">
                                <label htmlFor="category" className="mb-2 font-medium text-gray-700">Inquiry Type</label>
                                <select onChange={(e) => setContact({ ...contact, category: e.target.value })} value={contact.category} id="category" name="category" required className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none w-full bg-white transition-shadow">
                                    <option value="" disabled>Select Category</option>
                                    <option value="tourist">Tourist Inquiry</option>
                                    <option value="researcher">Researcher Inquiry</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex flex-col text-left">
                                <label htmlFor="DESCRIPTION" className="mb-2 font-medium text-gray-700">Message</label>
                                <textarea onChange={(e) => setContact({ ...contact, message: e.target.value })} value={contact.message} id="DESCRIPTION" name="message" rows="5" placeholder="Write your message here..." className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none w-full resize-none transition-shadow"></textarea>
                            </div>

                            <div className="text-center pt-4">
                                <button type="submit" className="bg-black text-white font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer w-full text-center block shadow-lg hover:shadow-xl transform hover:-translate-y-1">Send Message</button>
                            </div>
                        </form>
                    </div>

                    {/* Map and Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
                            <div className='bg-yellow-100 p-3 rounded-full'>
                                <RiUserLocationLine className='text-2xl text-yellow-700' />
                            </div>
                            <div>
                                <h4 className='font-bold text-lg'>Visit Kharnak</h4>
                                <p className='text-gray-600'>Experience the nomadic lifestyle in the heart of Ladakh.</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-xl overflow-hidden shadow-lg border border-gray-700 relative group">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6153.5638456532!2d77.50704346080455!3d33.51008585562052!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390241005af7755d%3A0xe9ce917141948d87!2sDhat-%20kharnak!5e1!3m2!1sen!2sin!4v1736305341031!5m2!1sen!2sin" width="100%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ border: 0 }} className="w-full h-[400px] opacity-90 group-hover:opacity-100 transition-opacity"></iframe>
                        </div>

                        <div className='text-center'>
                            <p className='text-gray-500'>Email: <a href="mailto:kharnakchangthang@gmail.com" className='text-blue-600 hover:underline'>kharnakchangthang@gmail.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
