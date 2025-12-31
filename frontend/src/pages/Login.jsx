import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoArrowForwardOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
    const [view, setView] = useState('login'); // 'login', 'signup', 'verify', 'forgot', 'reset'
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, setToken } = useContext(ShopContext);
    const from = location.state?.from || '/shop';

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [tempUserId, setTempUserId] = useState(''); // Store userId during registration for OTP verification

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/shop');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (view === 'login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token);

                    // Sync Guest Cart to Server
                    const localCart = localStorage.getItem('cartItems');
                    if (localCart) {
                        const cartItems = JSON.parse(localCart);
                        for (const itemId in cartItems) {
                            for (const size in cartItems[itemId]) {
                                if (cartItems[itemId][size] > 0) {
                                    // Add each item to server inventory
                                    try {
                                        // We repeat the add call for the quantity
                                        // Actually backend addToCart increments by 1. 
                                        // So we should loop quantity times or update backend to accept quantity.
                                        // Current backend `addToCart` increments by 1.
                                        // Let's call `updateCart` instead which sets quantity directly!
                                        await axios.post(backendUrl + '/api/cart/update',
                                            { itemId, size, quantity: cartItems[itemId][size] },
                                            { headers: { token: data.token } }
                                        );
                                    } catch (err) {
                                        console.log("Sync error", err);
                                    }
                                }
                            }
                        }
                        localStorage.removeItem('cartItems'); // Clear local cart after sync
                    }

                    // Update Context
                    setToken(data.token);

                    toast.success("Welcome back!");
                    navigate(from);
                } else if (data.isNotVerified) {
                    toast.info(data.message);
                    setView('verify');
                } else {
                    toast.error(data.message);
                }
            }
            else if (view === 'signup') {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
                if (data.success) {
                    toast.success(data.message);
                    setView('verify');
                } else {
                    toast.error(data.message);
                }
            }
            else if (view === 'verify') {
                const { data } = await axios.post(backendUrl + '/api/user/verify-otp', { email, otp });
                if (data.success) {
                    toast.success(data.message);
                    setView('login');
                } else {
                    toast.error(data.message);
                }
            }
            else if (view === 'forgot') {
                const { data } = await axios.post(backendUrl + '/api/user/send-reset-otp', { email });
                if (data.success) {
                    toast.success(data.message);
                    setView('reset');
                } else {
                    toast.error(data.message);
                }
            }
            else if (view === 'reset') {
                const { data } = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword });
                if (data.success) {
                    toast.success(data.message);
                    setView('login');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-100/50 rounded-full blur-[100px]" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={view}
                className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 md:p-12 border border-gray-50 z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#1e1964] mb-2 uppercase tracking-tighter">
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'verify' && 'Verify Email'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'Set New Password'}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">
                        {view === 'login' && 'Enter your details to access your account'}
                        {view === 'signup' && 'Join the Kharnak community today'}
                        {view === 'verify' && 'Enter the 6-digit OTP sent to your email'}
                        {view === 'forgot' && 'Enter your email to receive a reset OTP'}
                        {view === 'reset' && 'Create a strong new password for your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {view === 'signup' && (
                        <div className="relative group">
                            <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e1964] transition-colors" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-[#fcf9f2] border-0 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1e1964]/10 transition-all outline-none"
                            />
                        </div>
                    )}

                    {(view === 'login' || view === 'signup' || view === 'forgot' || view === 'reset' || view === 'verify') && (
                        <div className="relative group">
                            <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e1964] transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full bg-[#fcf9f2] border-0 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1e1964]/10 transition-all outline-none disabled:opacity-50"
                                disabled={view === 'reset' || view === 'verify'}
                            />
                        </div>
                    )}

                    {(view === 'login' || view === 'signup') && (
                        <div className="relative group">
                            <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e1964] transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-[#fcf9f2] border-0 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1e1964]/10 transition-all outline-none"
                            />
                        </div>
                    )}

                    {(view === 'verify' || view === 'reset') && (
                        <div className="relative group">
                            <IoShieldCheckmarkOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e1964] transition-colors" />
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit OTP"
                                maxLength={6}
                                className="w-full bg-[#fcf9f2] border-0 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1e1964]/10 transition-all outline-none tracking-[0.5em] font-mono text-center"
                            />
                        </div>
                    )}

                    {view === 'reset' && (
                        <div className="relative group">
                            <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e1964] transition-colors" />
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full bg-[#fcf9f2] border-0 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1e1964]/10 transition-all outline-none"
                            />
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setView('forgot')}
                                className="text-xs text-gray-400 hover:text-[#1e1964] transition-colors font-bold uppercase tracking-widest"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1e1964] hover:bg-black text-white font-black uppercase text-xs tracking-widest py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-900/10"
                    >
                        {isLoading ? 'Processing...' : (
                            <>
                                {view === 'login' && 'Sign In'}
                                {view === 'signup' && 'Register'}
                                {view === 'verify' && 'Verify Account'}
                                {view === 'forgot' && 'Send OTP'}
                                {view === 'reset' && 'Reset Password'}
                                <IoArrowForwardOutline className="text-xl group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-gray-100">
                    {view === 'login' ? (
                        <p className="text-gray-400 text-xs">
                            Don't have an account? {' '}
                            <button onClick={() => setView('signup')} className="text-[#1e1964] font-black uppercase tracking-widest hover:underline">Sign Up</button>
                        </p>
                    ) : (
                        <button onClick={() => setView('login')} className="text-[#1e1964] font-black uppercase tracking-widest text-xs hover:underline underline-offset-4">
                            Back to Login
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
