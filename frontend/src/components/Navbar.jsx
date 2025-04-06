import { assets } from "../assets/assets.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/shopContext.jsx";
import React, { useContext, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    showSearch,
    setShowSearch,
    getCartCount,
    setToken,
    setCartItems,
    token,
  } = useContext(ShopContext);

  const [visible, setVisible] = useState(false);

  const logout = async () => {
    localStorage.removeItem("token");
    navigate("/login");

    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-36 cursor-pointer"
      />

      <ul className="hidden gap-5 text-sm text-gray-700 sm:flex">
        <NavLink
          to="/"
          className="flex cursor-pointer flex-col items-center gap-1"
        >
          <p>HOME</p>
          <hr className="hidden h-[2px] w-2/4 border-none bg-gray-700" />
        </NavLink>
        <NavLink
          to="/collection"
          className="flex cursor-pointer flex-col items-center gap-1"
        >
          <p> COLLECTION</p>
          <hr className="hidden h-[2px] w-2/4 border-none bg-gray-700" />
        </NavLink>
        <NavLink
          to="/about"
          className="flex cursor-pointer flex-col items-center gap-1"
        >
          <p> ABOUT </p>
          <hr className="hidden h-[2px] w-2/4 border-none bg-gray-700" />
        </NavLink>
        <NavLink
          to="/contact"
          className="flex cursor-pointer flex-col items-center gap-1"
        >
          <p>CONTACT</p>
          <hr className="hidden h-[2px] w-2/4 border-none bg-gray-700" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(!showSearch)}
          src={assets.search_icon}
          alt=""
          className="w-5 cursor-pointer"
        />

        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />
          {/* DROPDOWN */}
          {token && (
            <div className="dropdown-menu absolute right-0 hidden pt-4 group-hover:block">
              <div className="flex w-36 flex-col gap-2 rounded bg-slate-100 px-5 py-3 text-gray-500">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] aspect-square w-4 rounded-full bg-black text-center text-[8px] leading-4 text-white">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* {SIde bar menu for small screen} */}
      <div
        onClick={() => setVisible(false)}
        className={`absolute top-0 right-0 bottom-0 overflow-hidden border-l border-gray-300 bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex cursor-pointer items-center gap-4 p-3"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>

          <NavLink
            className="sidebar-link border border-gray-200 py-2 pl-6"
            onClick={() => setVisible(false)}
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            className="sidebar-link border border-gray-200 py-2 pl-6"
            onClick={() => setVisible(false)}
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            className="sidebar-link border border-gray-200 py-2 pl-6"
            onClick={() => setVisible(false)}
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            className="sidebar-link border border-gray-200 py-2 pl-6"
            onClick={() => setVisible(false)}
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
