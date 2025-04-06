import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  // return showSearch ? <div></div> : null;
  return (
    showSearch &&
    visible && (
      <div className="border-t border-b border-gray-300 bg-gray-50 text-center">
        {/* // <div> */}

        <div className="mx-5 my-5 inline-flex w-3/4 items-center justify-center rounded-full border border-gray-400 px-5 py-2 sm:w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="F flex-1 bg-inherit text-sm outline-none"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <img src={assets.search_icon} alt="" className="w-4" />
        </div>
        <img
          onClick={() => setShowSearch(false)}
          className="inline w-3 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </div>
    )
  );
};

export default SearchBar;
