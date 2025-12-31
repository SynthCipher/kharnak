import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, setToken, setRole } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/user/admin-login", {
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        if (data.role) setRole(data.role); // Save role if provided
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="flex w-full h-screen overflow-hidden shadow-2xl bg-white">

        {/* Left Side - Image/Visual Section */}
        <div className="hidden lg:flex lg:w-3/5 relative">
          <img
            src="/admin-login-bg.png"
            alt="Nomadic Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
          <div className="absolute bottom-12 left-12 text-white z-10">
            <h1 className="text-6xl font-bold mb-4 tracking-tighter">མཁར་ནག་</h1>
            <p className="text-xl font-light tracking-widest uppercase opacity-90">Admin Central Portal</p>
          </div>
        </div>

        {/* Right Side - Login Form Section */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 md:px-16 lg:px-20 bg-white relative">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <img
                className="h-16 w-auto mb-8 mx-auto lg:mx-0"
                src={assets.logo}
                alt="Kharnak"
              />
              <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500 font-medium">Please enter your details to access the dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={onSubmitHandler}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@kharnak.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all duration-300 placeholder:text-gray-300"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Secret Key
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all duration-300 placeholder:text-gray-300"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] transition-all duration-300"
                >
                  Authorize Access
                </button>
              </div>
            </form>

            <div className="mt-12 text-center text-gray-400 text-sm">
              <p>© 2025 Kharnak Management Systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
