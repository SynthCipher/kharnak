import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Messages = () => {
    const { backendUrl, token } = useContext(AppContext)
    const [messages, setMessages] = useState([])

    const fetchMessages = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/contact/list', { headers: { token } })
            if (response.data.success) {
                setMessages(response.data.contacts)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            fetchMessages()
        }
    }, [token])

    return (
        <div className='w-full'>
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Feedback Hub</h1>
                <p className="text-gray-500 font-medium tracking-tight">Monitoring community transmissions and inquiries.</p>
            </div>

            <div className='flex flex-col gap-6'>
                {messages.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No transmissions received</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className='group bg-white border border-gray-50 p-6 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-yellow-900/5 transition-all duration-500'>
                            <div className='flex justify-between items-start mb-6'>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 font-black group-hover:scale-110 transition-transform duration-500">
                                        {msg.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className='font-black text-xl text-gray-900 tracking-tighter'>{msg.name}</h3>
                                        <a href={`mailto:${msg.email}`} className='text-blue-500 font-bold text-xs hover:underline'>{msg.email}</a>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 ${msg.category === 'tourist' ? 'bg-green-50 text-green-600' :
                                        msg.category === 'researcher' ? 'bg-purple-50 text-purple-600' :
                                            'bg-gray-50 text-gray-500'
                                        }`}>
                                        {msg.category}
                                    </span>
                                    <p className='text-[10px] text-gray-300 font-black'>{new Date(msg.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className='bg-gray-50/50 p-6 rounded-2xl text-gray-700 text-sm font-medium leading-relaxed border border-gray-50'>
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


export default Messages
