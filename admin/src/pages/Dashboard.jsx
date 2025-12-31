import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { RiMoneyDollarCircleLine, RiShoppingBag3Line, RiFileList3Line, RiMessage2Line, RiMapPinLine, RiTimeLine } from 'react-icons/ri'

const Dashboard = () => {
    const { backendUrl, token, currency } = useContext(AppContext)

    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        earnings: 0,
        messages: 0,
        bookings: 0
    })

    const [recentActivity, setRecentActivity] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (token) {
            fetchStats()
        }
    }, [token])

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            // Fetch products count
            const productsRes = await axios.get(backendUrl + '/api/product/list')

            // Fetch orders for count and earnings
            const ordersRes = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })

            // Fetch messages count
            const messagesRes = await axios.get(backendUrl + '/api/contact/list', { headers: { token } })

            // Fetch bookings
            const bookingsRes = await axios.get(backendUrl + '/api/booking/list', { headers: { token } })

            if (productsRes.data.success && ordersRes.data.success && messagesRes.data.success && bookingsRes.data.success) {
                const totalEarnings = ordersRes.data.orders.reduce((acc, order) => {
                    return order.payment ? acc + order.amount : acc
                }, 0)

                setStats({
                    products: productsRes.data.products.length,
                    orders: ordersRes.data.orders.length,
                    earnings: totalEarnings,
                    messages: messagesRes.data.contacts.length,
                    bookings: bookingsRes.data.bookings.length
                })

                // Combine and sort recent activity
                const combined = [
                    ...ordersRes.data.orders.map(o => ({ ...o, type: 'order' })),
                    ...bookingsRes.data.bookings.map(b => ({ ...b, type: 'booking' }))
                ].sort((a, b) => b.date - a.date).slice(0, 10)

                setRecentActivity(combined)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Dashboard Command</h1>
                <p className="text-gray-500 font-medium">Real-time overview of the Kharnak digital ecosystem.</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12'>
                {/* Earnings Card */}
                <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-green-900/5 group'>
                    <div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Revenue</p>
                        <p className='text-2xl font-black text-gray-900 mt-1'>{currency}{stats.earnings.toLocaleString()}</p>
                    </div>
                    <div className='w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-black group-hover:scale-110 transition-transform'>
                        <RiMoneyDollarCircleLine className='text-2xl' />
                    </div>
                </div>

                {/* Orders Card */}
                <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-blue-900/5 group'>
                    <div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Orders</p>
                        <p className='text-2xl font-black text-gray-900 mt-1'>{stats.orders}</p>
                    </div>
                    <div className='w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black group-hover:scale-110 transition-transform'>
                        <RiShoppingBag3Line className='text-2xl' />
                    </div>
                </div>

                {/* Bookings Card */}
                <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-purple-900/5 group'>
                    <div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Bookings</p>
                        <p className='text-2xl font-black text-gray-900 mt-1'>{stats.bookings}</p>
                    </div>
                    <div className='w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-black group-hover:scale-110 transition-transform'>
                        <RiMapPinLine className='text-2xl' />
                    </div>
                </div>

                {/* Products Card */}
                <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-orange-900/5 group'>
                    <div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Inventory</p>
                        <p className='text-2xl font-black text-gray-900 mt-1'>{stats.products}</p>
                    </div>
                    <div className='w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-black group-hover:scale-110 transition-transform'>
                        <RiFileList3Line className='text-2xl' />
                    </div>
                </div>

                {/* Messages Card */}
                <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-yellow-900/5 group'>
                    <div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Feedback</p>
                        <p className='text-2xl font-black text-gray-900 mt-1'>{stats.messages}</p>
                    </div>
                    <div className='w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 font-black group-hover:scale-110 transition-transform'>
                        <RiMessage2Line className='text-2xl' />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50'>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                            <RiTimeLine className="text-xl" />
                        </div>
                        <h2 className='text-2xl font-black text-gray-800 tracking-tighter uppercase'>Recent Pulse</h2>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map((item) => (
                            <div key={item._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${item.type === 'order' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {item.type === 'order' ? <RiShoppingBag3Line /> : <RiMapPinLine />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {item.type === 'order' ? `New Order #${item._id.slice(-5)}` : `Booking Request: ${item.bookingType}`}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                            {item.type === 'order' ? `${item.items.length} items • ₹${item.amount}` : `${item.userName} • ${item.guests} Guests`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${item.payment ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {item.payment ? 'Paid' : 'Pending'}
                                    </span>
                                    <p className="text-[10px] text-gray-300 font-bold mt-1">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No Recent Pulses Detected</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className='bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden'>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h2 className='text-2xl font-black text-white tracking-tighter uppercase mb-4'>System Status</h2>
                            <div className="space-y-6 mt-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Server Connectivity</span>
                                    <span className="text-green-400 text-xs font-black uppercase tracking-widest animate-pulse">Synchronized</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Database Health</span>
                                    <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Payment Gateway</span>
                                    <span className="text-green-400 text-xs font-black uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Management Token</p>
                            <p className="text-white text-xs font-bold truncate mt-2 opacity-50">{token.slice(0, 30)}...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
