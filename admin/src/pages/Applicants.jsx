import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { IoArrowBackOutline, IoMailOutline, IoCallOutline, IoPeopleOutline, IoChatboxEllipsesOutline } from 'react-icons/io5';

const Applicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl, token } = useContext(AppContext);
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApplicants = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/booking/get-applicants', { tourId: id }, { headers: { token } });
            if (data.success) {
                setApplicants(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load applicants");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [id, backendUrl, token]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-10">
                <button
                    onClick={() => navigate('/list-tours')}
                    className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-black transition-colors mb-6 group"
                >
                    <IoArrowBackOutline className="text-lg group-hover:-translate-x-1 transition-transform" />
                    Back to Tours
                </button>
                <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2">Applicants Directory</h1>
                <p className="text-gray-500 font-medium">Viewing all travelers for Tour ID: <span className="text-black font-black">#{id.slice(-6)}</span></p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_2fr_1fr] items-center py-6 px-10 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>Name</span>
                    <span>Contact</span>
                    <span>Guests</span>
                    <span>Status</span>
                    <span>Special Requests</span>
                    <span className="text-center">Date</span>
                </div>

                <div className="divide-y divide-gray-50">
                    {applicants.length > 0 ? applicants.map((applicant, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_1fr_2fr_1fr] gap-4 items-center py-8 px-10 hover:bg-gray-50/50 transition-all">
                            <div>
                                <p className="text-sm font-black text-gray-800 tracking-tight">{applicant.userName}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">ID: {applicant._id.slice(-6)}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <IoMailOutline className="text-gray-400" />
                                    <span className="font-medium truncate">{applicant.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <IoCallOutline className="text-gray-400" />
                                    <span className="font-medium">{applicant.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <IoPeopleOutline className="text-gray-400" />
                                <span className="text-sm font-black text-gray-800">{applicant.guests}</span>
                            </div>

                            <div>
                                <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${applicant.paymentStatus === 'Paid' || applicant.payment ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {applicant.payment ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>

                            <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-2xl min-h-[60px]">
                                <IoChatboxEllipsesOutline className="text-gray-300 mt-1 flex-shrink-0" />
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                                    {applicant.specialRequests || "No special requests specified."}
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {new Date(applicant.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No applicants found for this tour</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Applicants;
