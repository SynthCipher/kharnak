import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoPersonCircleOutline, IoLocationOutline, IoBagHandleOutline, IoLogOutOutline, IoMailOutline, IoCalendarOutline, IoAlbumsOutline, IoAdd, IoTrashOutline, IoCopyOutline } from 'react-icons/io5';
import { ShopContext } from '../context/ShopContext';
import { useContext } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'bookings', 'addresses'
    const [showAddAddress, setShowAddAddress] = useState(false);

    // Address Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const navigate = useNavigate();
    const { logout } = useContext(ShopContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserData(token);
    }, [token]);

    const fetchUserData = async (token) => {
        setIsLoading(true);
        try {
            // Fetch Profile (User Info + Addresses)
            const profileRes = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
            if (profileRes.data.success) {
                setUser(profileRes.data.user);
                setAddresses(profileRes.data.user.addresses || []);
            }

            // Fetching orders
            const ordersRes = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
            if (ordersRes.data.success) {
                setOrders(ordersRes.data.orders);
            }

            // Fetching bookings
            const bookingsRes = await axios.post(backendUrl + '/api/booking/user-bookings', {}, { headers: { token } });
            if (bookingsRes.data.success) {
                setBookings(bookingsRes.data.bookings);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitAddress = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/user/add-address', { address: formData }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                setAddresses(data.addresses); // Update local state
                setShowAddAddress(false);
                setFormData({ firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' });
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

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            const { data } = await axios.post(backendUrl + '/api/user/delete-address', { addressId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                setAddresses(data.addresses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleSetDefault = async (addressId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/set-default-address', { addressId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                setAddresses(data.addresses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Order ID copied");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
                <div className="w-12 h-12 border-4 border-[#1e1964] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf9f2] pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* User Info Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-50 flex flex-col items-center text-center sticky top-28">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-sm">
                            <IoPersonCircleOutline className="text-6xl text-[#1e1964]" />
                        </div>
                        <h2 className="text-2xl font-black text-[#1e1964] mb-1">{user?.name ? `Jullay, ${user.name}!` : 'Welcome!'}</h2>
                        <p className="text-gray-400 text-sm font-medium mb-8">Kharnak Community Member</p>

                        <div className="w-full space-y-4 text-left">
                            <div className="bg-[#fcf9f2] p-4 rounded-2xl flex items-center gap-4">
                                <IoMailOutline className="text-xl text-[#1e1964]/50" />
                                <div className="overflow-hidden">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Account</p>
                                    <p className="text-sm font-bold text-[#1e1964] truncate" title={user?.email}>{user?.email || 'Active Member'}</p>
                                </div>
                            </div>
                            <div className="bg-[#fcf9f2] p-4 rounded-2xl flex items-center gap-4">
                                <IoLocationOutline className="text-xl text-[#1e1964]/50" />
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Default Region</p>
                                    <p className="text-sm font-bold text-[#1e1964]">{addresses.length > 0 ? `${addresses[0].city}, ${addresses[0].country}` : 'Not Set'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-10 w-full bg-red-50 text-red-600 font-black uppercase text-xs tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
                        >
                            <IoLogOutOutline className="text-xl" /> Log Out
                        </button>
                    </div>
                </div>

                {/* Dashboard Section */}
                <div className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <IoAlbumsOutline className="text-2xl text-[#1e1964]" />
                            </div>
                            <h2 className="text-3xl font-black text-[#1e1964] uppercase tracking-tighter">Activity</h2>
                        </div>

                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-50 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-[#1e1964] text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'bookings' ? 'bg-[#1e1964] text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                            >
                                Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'addresses' ? 'bg-[#1e1964] text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                            >
                                Addresses
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {activeTab === 'orders' && (
                            orders.length > 0 ? orders.map((order, index) => (
                                <div key={index} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-500 group">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-tighter bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{order.status}</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                                                <span className="text-gray-300">|</span>
                                                <div title={order._id} onClick={() => copyToClipboard(order._id)} className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors group/copy">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover/copy:text-[#1e1964]">#{order._id.slice(-6)}</span>
                                                    <IoCopyOutline className="text-[10px] text-gray-300 group-hover/copy:text-[#1e1964]" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {order.items.map((item, id) => (
                                                    <div key={id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                        <span className="text-[#1e1964] font-bold">{item.name} <span className="text-gray-400 font-medium">x {item.quantity}</span></span>
                                                        <span className="text-gray-500 font-bold text-sm">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:w-32 flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Total</p>
                                            <p className="text-2xl font-black text-[#1e1964]">₹{order.amount}</p>

                                            {order.trackingId && (
                                                <div className="mt-4 text-center md:text-right">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Tracking via {order.courierCompany}</p>
                                                    <p className="text-[10px] font-bold text-gray-800 mt-1 select-all">{order.trackingId}</p>
                                                    {order.expectedDate && (
                                                        <p className="text-[9px] font-medium text-blue-600 mt-1">Expected: {new Date(order.expectedDate).toLocaleDateString()}</p>
                                                    )}
                                                    {order.courierLink && (
                                                        <a href={order.courierLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[8px] font-black uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-lg hover:bg-[#1e1964] transition-colors">
                                                            Track Order
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : <EmptyState type="orders" navigate={navigate} />
                        )}

                        {activeTab === 'bookings' && (
                            bookings.length > 0 ? bookings.map((booking, index) => (
                                <div key={index} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-500 group">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${booking.paymentStatus === 'Paid' || (booking.paymentOption === 'Full' && booking.payment) ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                                    {booking.paymentStatus || (booking.paymentOption === 'Full' ? (booking.payment ? 'Paid' : 'Unpaid') : 'Deposit Paid')}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${booking.tourId ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {booking.tourId ? 'Expedition' : 'Custom Booking'}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{new Date(booking.date).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <IoCalendarOutline className="text-xl text-[#1e1964]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-[#1e1964] text-lg uppercase tracking-tight leading-none mb-1">
                                                        {booking.bookingType}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">
                                                        {booking.tourId ? 'Scheduled Group Tour' : 'Custom Itinerary'} • {booking.guests} Guests
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <div className="bg-[#fcf9f2] px-3 py-2 rounded-xl">
                                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-tight">Payment Plan</p>
                                                    <p className="text-[10px] font-bold text-[#1e1964]">{booking.paymentOption}</p>
                                                </div>
                                                <div className="bg-[#fcf9f2] px-3 py-2 rounded-xl">
                                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-tight">ID</p>
                                                    <p className="text-[10px] font-bold text-[#1e1964]">#{booking._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-40 flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                                            <div className="text-center md:text-right mb-4">
                                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Paid Status</p>
                                                <p className="text-lg font-black text-green-600">₹{booking.payment ? booking.amount : 0}</p>
                                            </div>
                                            <div className="text-center md:text-right">
                                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Total Stay</p>
                                                <p className="text-2xl font-black text-[#1e1964]">₹{booking.totalAmount || booking.amount}</p>
                                            </div>
                                            {booking.paymentOption === 'Deposit' && !booking.paymentStatus === 'Paid' && (
                                                <p className="mt-2 text-[9px] font-black text-red-500 uppercase tracking-widest">Pending: ₹{booking.totalAmount - (booking.payment ? booking.amount : 0)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : <EmptyState type="bookings" navigate={navigate} />
                        )}

                        {activeTab === 'addresses' && (
                            <div>
                                {showAddAddress ? (
                                    <form onSubmit={onSubmitAddress} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 animate-in fade-in zoom-in duration-300">
                                        <div className='flex justify-between items-center mb-6'>
                                            <h3 className="text-lg font-black text-[#1e1964] uppercase tracking-tighter">Add New Address</h3>
                                            <button type="button" onClick={() => setShowAddAddress(false)} className="text-xs font-bold text-gray-400 hover:text-red-500">CANCEL</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-200 rounded-xl py-3 px-4 w-full text-sm font-medium focus:outline-none focus:border-black' type="text" placeholder='First name' />
                                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-200 rounded-xl py-3 px-4 w-full text-sm font-medium focus:outline-none focus:border-black' type="text" placeholder='Last name' />
                                            <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-200 rounded-xl py-3 px-4 w-full md:col-span-2 text-sm font-medium focus:outline-none focus:border-black' type="email" placeholder='Email address' />
                                            <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-200 rounded-xl py-3 px-4 w-full md:col-span-2 text-sm font-medium focus:outline-none focus:border-black' type="text" placeholder='Street address' />
                                            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-200 rounded-xl py-3 px-4 w-full text-sm font-medium focus:outline-none focus:border-black' type="text" placeholder='City' />
                                            <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-200 rounded-xl py-3 px-4 w-full text-sm font-medium focus:outline-none focus:border-black' type="text" placeholder='State' />
                                            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-200 rounded-xl py-3 px-4 w-full text-sm font-medium focus:outline-none focus:border-black' type="number" placeholder='Zipcode' />
                                            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-200 rounded-xl py-3 px-4 w-full text-sm font-medium focus:outline-none focus:border-black' type="text" placeholder='Country' />
                                            <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-200 rounded-xl py-3 px-4 w-full md:col-span-2 text-sm font-medium focus:outline-none focus:border-black' type="number" placeholder='Phone' />
                                        </div>
                                        <button disabled={isSubmitting} type="submit" className="mt-6 w-full bg-black text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSubmitting ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div onClick={() => setShowAddAddress(true)} className="bg-white rounded-[2rem] p-8 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group min-h-[200px]">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:scale-110 transition-all">
                                                <IoAdd className="text-2xl text-gray-400 group-hover:text-black" />
                                            </div>
                                            <h3 className="font-bold text-[#1e1964] text-sm uppercase tracking-wider">Add New Address</h3>
                                        </div>
                                        {addresses.map((addr, index) => (
                                            <div key={index} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 hover:shadow-lg transition-all relative group flex flex-col">
                                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }} className="text-gray-400 hover:text-red-500 p-2">
                                                        <IoTrashOutline className="text-xl" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-blue-50 rounded-xl">
                                                        <IoLocationOutline className="text-blue-600" />
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Address #{index + 1}</span>
                                                        {index === 0 && <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">Default</span>}
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-[#1e1964] text-lg mb-1">{addr.firstName} {addr.lastName}</h4>
                                                <p className="text-gray-500 text-sm leading-relaxed">{addr.street}, {addr.city}</p>
                                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">{addr.state}, {addr.country} - {addr.zipcode}</p>
                                                <p className="text-gray-400 text-xs mt-1">{addr.phone}</p>

                                                {index !== 0 && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleSetDefault(addr._id); }} className="mt-4 w-full py-2 bg-gray-50 hover:bg-[#1e1964] hover:text-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                                                        Set as Default
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const EmptyState = ({ type, navigate }) => (
    <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            {type === 'orders' ? <IoBagHandleOutline className="text-3xl text-gray-200" /> : <IoCalendarOutline className="text-3xl text-gray-200" />}
        </div>
        <h3 className="text-xl font-bold text-[#1e1964] mb-2">No {type} yet</h3>
        <p className="text-gray-400 mb-8">Start your Kharnak journey by visiting our {type === 'orders' ? 'Shop' : 'Tourism'} section.</p>
        <button
            onClick={() => navigate(type === 'orders' ? '/shop' : '/tourism')}
            className="bg-[#1e1964] text-white font-black uppercase text-xs tracking-widest px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-900/10"
        >
            Go to {type === 'orders' ? 'Shop' : 'Tourism'}
        </button>
    </div>
);

export default Profile;
