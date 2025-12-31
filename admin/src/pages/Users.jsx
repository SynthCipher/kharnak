import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { IoMailOutline, IoCalendarOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoPencilOutline, IoTimeOutline, IoBagHandleOutline, IoMapOutline, IoArrowBackOutline, IoPersonOutline, IoPencil } from 'react-icons/io5';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list', 'edit', 'history'
    const [selectedUser, setSelectedUser] = useState(null);
    const [userHistory, setUserHistory] = useState({ orders: [], bookings: [] });
    const [isActionLoading, setIsActionLoading] = useState(false);

    const { token, backendUrl } = useContext(AppContext);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/user/all-users', { headers: { token } });
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleEditUser = (user) => {
        setSelectedUser({ ...user });
        setView('edit');
    };

    const handleViewHistory = async (user) => {
        setSelectedUser(user);
        setIsActionLoading(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/user/user-history', { userId: user._id }, { headers: { token } });
            if (data.success) {
                setUserHistory({ orders: data.orders, bookings: data.bookings });
                setView('history');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/user/update-user', {
                userId: selectedUser._id,
                name: selectedUser.name,
                email: selectedUser.email,
                isVerified: selectedUser.isVerified
            }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                fetchUsers();
                setView('list');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const toggleVerification = async (user) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/update-user', {
                userId: user._id,
                isVerified: !user.isVerified
            }, { headers: { token } });

            if (data.success) {
                toast.success(`User ${!user.isVerified ? 'Verified' : 'Unverified'}`);
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (view === 'edit') {
        return (
            <div className="p-4 md:p-8 max-w-2xl mx-auto">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-gray-400 hover:text-black mb-6 font-bold transition-all text-sm">
                    <IoArrowBackOutline /> Back to Users
                </button>
                <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl border border-gray-50">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 tracking-tighter uppercase">Edit User Profile</h2>
                    <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Member Name</label>
                            <input
                                type="text"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                            />
                        </div>
                        <div
                            onClick={() => setSelectedUser({ ...selectedUser, isVerified: !selectedUser.isVerified })}
                            className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border ${selectedUser.isVerified ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}
                        >
                            <div className="flex items-center gap-3">
                                {selectedUser.isVerified ? <IoCheckmarkCircleOutline className="text-2xl text-green-600" /> : <IoCloseCircleOutline className="text-2xl text-gray-400" />}
                                <span className={`font-bold ${selectedUser.isVerified ? 'text-green-700' : 'text-gray-500'}`}>Verified Member</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-all ${selectedUser.isVerified ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedUser.isVerified ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                        <button
                            disabled={isActionLoading}
                            className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isActionLoading ? 'Synchronizing...' : 'Save Member Details'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (view === 'history') {
        return (
            <div className="p-4 md:p-8">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-gray-400 hover:text-black mb-6 font-bold transition-all text-sm">
                    <IoArrowBackOutline /> Back to Users
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2">Member Journey</h2>
                        <p className="text-gray-500 font-medium">Tracking history for <span className="text-blue-600 font-bold">{selectedUser.name}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    {/* Orders History */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                <IoBagHandleOutline className="text-xl text-orange-500" />
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter">Shopping History</h3>
                        </div>
                        {userHistory.orders.length > 0 ? userHistory.orders.map(order => (
                            <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Order ID</p>
                                        <p className="font-bold text-[10px] md:text-xs truncate max-w-[150px]">{order._id}</p>
                                    </div>
                                    <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{order.status}</span>
                                </div>
                                <div className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs py-2 border-b border-gray-50 last:border-0 font-bold">
                                            <span>{item.name} <span className="text-gray-400 font-medium">x{item.quantity}</span></span>
                                            <span className="text-gray-600">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-400 text-[10px] font-black">{new Date(order.date).toLocaleDateString()}</span>
                                    <span className="text-lg md:text-xl font-black text-gray-900">₹{order.amount}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-gray-50/50 p-10 rounded-3xl text-center border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold text-sm">No shopping activity yet</p>
                            </div>
                        )}
                    </div>

                    {/* Bookings History */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <IoMapOutline className="text-xl text-blue-500" />
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter">Tourism Bookings</h3>
                        </div>
                        {userHistory.bookings.length > 0 ? userHistory.bookings.map(booking => (
                            <div key={booking._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Booking Style</p>
                                        <p className="font-black text-blue-600 text-sm">{booking.bookingType}</p>
                                    </div>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{booking.status}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl mb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Schedule</p>
                                        <p className="text-[11px] font-bold">{new Date(booking.dates.start).toLocaleDateString()} - {new Date(booking.dates.end).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capacity</p>
                                        <p className="text-[11px] font-bold">{booking.guests} Guest(s)</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-[10px] font-black">Registered: {new Date(booking.date).toLocaleDateString()}</span>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${booking.payment ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                        {booking.payment ? 'Finalized' : 'Pending Payment'}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-gray-50/50 p-10 rounded-3xl text-center border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold text-sm">No tourism bookings found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2">Member Command</h1>
                    <p className="text-gray-500 font-medium">Managing the digital core of the Kharnak community.</p>
                </div>
                <div className="bg-[#1e1964] px-6 md:px-8 py-4 rounded-2xl md:rounded-[1.5rem] shadow-xl self-start">
                    <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">{users.length}  User</span>
                </div>
            </div>

            {/* Content Section - Responsive Wrapper */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">

                {/* Desktop Table View (Hidden on mobile) */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/70 border-b border-gray-100 font-black text-gray-400 uppercase tracking-widest text-[9px]">
                            <tr>
                                <th className="pl-8 py-6">Member Identity</th>
                                <th className="pl-8 py-6">Status</th>
                                <th className="pl-4 py-6">Registered On</th>
                                <th className="pl-4 py-6 ">Management Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-bold text-[#1e1964]">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-all border-l-4 border-transparent hover:border-blue-600">
                                    <td className="pl-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-lg border-2 border-white shadow-sm overflow-hidden font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black mb-0.5">{user.name}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                    <IoMailOutline className="text-base" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleVerification(user)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${user.isVerified ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
                                        >
                                            {/* <IoCheckmarkCircleOutline className="text-sm" /> */}
                                            {user.isVerified ? 'Verified' : 'Unverified'}
                                        </button>
                                    </td>
                                    <td className="pl-4 py-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            {/* <IoCalendarOutline className="text-base" /> */}
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
                                            >
                                                <IoPencil className="text-lg" />
                                                {/* <span className="text-[10px] font-black uppercase tracking-widest">Edit </span> */}
                                            </button>
                                            <button
                                                onClick={() => handleViewHistory(user)}
                                                className="flex items-center gap-2 bg-[#1e1964] text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg shadow-blue-900/10"
                                            >
                                                <IoTimeOutline className="text-lg" />
                                                {/* <span className="text-[10px] font-black uppercase tracking-widest">Activity</span> */}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet Card View (Hidden on desktop) */}
                <div className="lg:hidden divide-y divide-gray-100">
                    {users.map((user) => (
                        <div key={user._id} className="p-6 space-y-6 hover:bg-gray-50/30 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xl font-black border-2 border-white shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1"><IoMailOutline /> {user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleVerification(user)}
                                    className={`p-2 rounded-xl border ${user.isVerified ? 'bg-green-50 border-green-100 text-green-600' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}
                                >
                                    {user.isVerified ? <IoCheckmarkCircleOutline className="text-xl" /> : <IoCloseCircleOutline className="text-xl" />}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-3 rounded-xl">
                                <IoCalendarOutline className="text-sm" />
                                <span>Registered Since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-100 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all"
                                >
                                    <IoPencilOutline className="text-base" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleViewHistory(user)}
                                    className="flex items-center justify-center gap-2 bg-[#1e1964] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-md shadow-blue-900/10"
                                >
                                    <IoTimeOutline className="text-base" />
                                    History
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="p-20 md:p-32 text-center bg-gray-50/10">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IoPersonOutline className="text-3xl md:text-4xl text-gray-200" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-gray-400 uppercase tracking-tighter">No members discovered</h3>
                        <p className="text-gray-300 text-xs md:text-sm mt-1 max-w-xs mx-auto">Waiting for nomadic wanderers to join your digital community.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
