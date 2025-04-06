import React, { useContext,  useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import {toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, setToken } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);
    const {data} = await axios.post(backendUrl + "/api/user/admin", {
      email,
      password,
    });
    if (data.success) {
      setToken(data.token);
      toast.success(data.message)
    }else {
        toast.error(data.message)
    }
    console.log(data.token)

  };

  //   awiat axios.post(import.env)
  //   useEffect(() => {
  //     console.log(email);
  //     console.log(password);
  //   }, [email, password]);
  return (
    <>
      <div className="flex items-center py-2 px-[4%] justify-between bg-white shadow-md fixed top-0 left-0 right-0">
        <img className="w-[max(10%,80px)]" src={assets.logo} alt="Logo" />
      </div>

      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-[4%]">
        <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Panel</h1>
          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                type="email"
                placeholder="admin email"
                required
              />
            </div>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                type="password"
                placeholder="admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 rounded-md text-white bg-black"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
