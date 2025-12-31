import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { IoPersonOutline, IoChevronDownOutline, IoLogOutOutline, IoPersonCircleOutline } from 'react-icons/io5';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { getCartCount, backendUrl, logout, token } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Error fetching user data in navbar:", error);
    }
  };


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Link classes based on state
  const linkClass = (path) => {
    const active = location.pathname === path;
    const base = "font-medium text-sm tracking-widest hover:text-yellow-600 transition-colors uppercase duration-300";
    // If transparent navbar on home (not scrolled), usually white text looks best if hero is dark.
    // Assuming hero is dark video/image => white text.
    // If scrolled or inner page => dark text.
    if (isHome && !scrolled) {
      return `${base} text-white ${active ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`;
    }
    return `${base} text-gray-800 ${active ? 'text-yellow-700 font-bold' : ''}`;
  };

  const logoSrc = isHome && !scrolled ? "/img/logo1-removebg-preview.png" : "/img/logo1-removebg-preview.png"; // Can switch to dark version if needed
  const navBackground = isHome && !scrolled ? "bg-transparent py-4 md:py-6" : "bg-white/95 backdrop-blur-md shadow-md py-3 md:py-4";

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ease-in-out ${navBackground}`}>
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex justify-between items-center h-full">

          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 group">
            <img
              className={`transition-all duration-500 ${scrolled || !isHome ? 'h-10 md:h-12' : 'h-12 md:h-16 lg:h-20'} w-auto`}
              src={assets.logo}
              alt="Kharnak Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10 xl:space-x-12">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/culture" className={linkClass('/culture')}>Culture</Link>
            <Link to="/tourism" className={linkClass('/tourism')}>Tourism</Link>
            <Link to="/shop" className={linkClass('/shop')}>Shop</Link>
          </div>

          {/* Socials & Mobile Toggle */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Social Icons Desktop - HIDDEN */}
            <div className={`hidden lg:flex items-center gap-4 ${isHome && !scrolled ? 'text-white' : 'text-gray-600'}`}>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative group p-1">
              <div className={`transition-all ${isHome && !scrolled ? 'text-white' : 'text-black'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>

            {/* Auth Dropdown */}
            <div className="relative group p-1">
              {token ? (
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className={`rounded-full border transition-all p-1 ${isHome && !scrolled ? 'border-white text-white' : 'border-black text-black'}`}>
                    <IoPersonOutline size={18} />
                  </div>

                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 top-full pt-2 transition-all duration-300 opacity-0 scale-95 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}>
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-[200px] overflow-hidden">
                      {userData && (
                        <div className="px-4 py-3 mb-2 border-b border-gray-50">
                          <p className="text-xs font-black text-[#1e1964] uppercase tracking-widest">
                            Jullay! {userData.name.split(' ')[0]}
                          </p>
                        </div>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#1e1964] hover:bg-[#fcf9f2] rounded-xl transition-colors group/item"
                      >
                        <IoPersonCircleOutline className="text-xl text-gray-400 group-hover/item:text-[#1e1964]" />
                        <span>My Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-50" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors group/item"
                      >
                        <IoLogOutOutline className="text-xl text-red-300 group-hover/item:text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <button className={`${isHome && !scrolled ? 'text-white hover:text-yellow-400' : 'text-black hover:text-yellow-700'} font-bold uppercase text-[10px] tracking-[0.2em] transition-colors whitespace-nowrap`}>
                    Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* Hamburger */}
            <button onClick={() => setIsOpen(true)} className={`lg:hidden focus:outline-none p-1 ${isHome && !scrolled ? 'text-white' : 'text-black'}`}>
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 h-[100dvh] z-[101] bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 z-[102] w-full max-w-[300px] h-[100dvh] bg-[#fcf9f2] text-gray-800 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.77, 0, 0.175, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col relative text-gray-800">

          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200/50 flex-shrink-0">
            <a href="/">
              <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
            </a>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:rotate-90 transition-transform duration-300 p-2 -mr-2">
              <FaTimes size={24} />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-grow flex flex-col bg-gray-50 justify-center py-6 px-4 space-y-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/culture', label: 'Culture' },
              { path: '/tourism', label: 'Tourism' },
              { path: '/shop', label: 'Shop' }
            ].map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${isActive ? 'text-yellow-700 font-bold bg-transparent' : 'text-gray-800 hover:bg-black/5 hover:text-black'}`}
                >
                  {label}
                </Link>
              )
            })}

            <div className="my-4 border-t border-gray-200/50 mx-4"></div>

            {token ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-lg font-medium text-gray-800 hover:bg-black/5 hover:text-black rounded-xl transition-all duration-300">
                  <IoPersonCircleOutline size={24} className="mr-3 opacity-70" /> Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-lg font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 text-left"
                >
                  <IoLogOutOutline size={24} className="mr-3 opacity-70" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-2 pt-2">
                <button className="w-full border-2 border-black text-black py-3 uppercase tracking-widest text-xs font-bold hover:bg-black hover:text-white transition-all duration-300 rounded-lg">
                  Sign In
                </button>
              </Link>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-6">
            <div className="flex justify-center gap-8 text-gray-400">
              <a href="#" className="hover:text-pink-600 transition-colors transform hover:scale-110"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-blue-600 transition-colors transform hover:scale-110"><FaFacebookF size={24} /></a>
              <a href="#" className="hover:text-red-600 transition-colors transform hover:scale-110"><FaYoutube size={24} /></a>
            </div>

            <Link to="/tourism" onClick={() => setIsOpen(false)} className="block w-full">
              <button className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors shadow-lg rounded-xl">
                Plan Your Trip
              </button>
            </Link>

            <div className="flex items-center justify-center gap-2 pt-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-800 font-bold">KHARNAK</span>
              <span className="text-[10px] text-gray-400">✕</span>
              <a
                href="https://onela.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] text-gray-800 font-bold hover:text-black transition-colors"
              >
                onela
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
