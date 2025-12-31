import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, subscribed

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      toast.info("Please enter your email address.");
      return;
    }

    // Mock "already subscribed" logic
    const subscribedEmails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');

    if (subscribedEmails.includes(email.toLowerCase())) {
      toast.warning("You are already subscribed to our newsletter!");
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      subscribedEmails.push(email.toLowerCase());
      localStorage.setItem('newsletter_emails', JSON.stringify(subscribedEmails));

      setStatus('subscribed');
      toast.success("Thank you for subscribing! Keep an eye on your inbox.");
      setEmail('');

      // Reset status after a delay
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand / About */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={assets.logo} alt="Kharnak" className="h-20 w-auto opacity-90 invert brightness-0 grayscale-0" /> {/* Inverting logo for dark bg if needed, or assume logo works */}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Preserving the nomadic heritage of Kharnak. We are a community-driven initiative dedicated to sharing our culture, stories, and landscapes with the world.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/kharnak_junu_tsogspa/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E1306C] transition-colors duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition-colors duration-300">
                <FaFacebookF size={18} />
              </a>
              <a href="https://youtube.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition-colors duration-300">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold tracking-widest mb-6 text-white uppercase">Explore</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/culture" className="hover:text-yellow-500 transition-colors">Culture & Stories</Link></li>
              <li><Link to="/tourism" className="hover:text-yellow-500 transition-colors">Tourism & Stays</Link></li>
              <li><Link to="/shop" className="hover:text-yellow-500 transition-colors">Shop Local</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-bold tracking-widest mb-6 text-white uppercase">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-yellow-600" />
                <span>Kharnakling, Choglamsar,<br />Leh, Ladakh 194101</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-yellow-600" />
                <a href="mailto:kharnakchangthang@gmail.com" className="hover:text-white">kharnakchangthang@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-yellow-600" />
                <a href="tel:+919876543210" className="hover:text-white">+91 9469274946</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-serif font-bold tracking-widest mb-6 text-white uppercase">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get updates on our latest stories and products.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="bg-gray-800 text-white px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-600 disabled:opacity-50"
                disabled={status === 'loading' || status === 'subscribed'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'subscribed'}
                className={`font-bold uppercase text-xs tracking-widest py-3 rounded transition-all duration-300 ${status === 'subscribed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black hover:bg-yellow-500 hover:text-white'
                  } disabled:cursor-not-allowed`}
              >
                {status === 'loading' ? 'Subscribing...' : status === 'subscribed' ? 'Subscribed!' : 'Subscribe'}
              </button>
              {status === 'subscribed' && (
                <p className="text-green-500 text-xs animate-pulse">Thank you for subscribing!</p>
              )}
            </form>
          </div>
        </div>


        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Kharnak Junu Tsogspa. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
            <a href="https://onela.in" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-white">Powered by <span>Onela</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
