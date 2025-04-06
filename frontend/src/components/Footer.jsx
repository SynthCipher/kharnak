import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
            eaque.Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Nostrum, harum cum quas temporibus expedita ad?
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
          <Link to="/" onClick={()=>scrollTo(0,0)}>
              <li>Home</li>
            </Link>
            <Link to="/about" onClick={()=>scrollTo(0,0)}>
              <li>About us</li>
            </Link>
            <Link>
              <li>Delivery</li>
            </Link>
            <Link>
              <li>Privacy policy</li>
            </Link>
          </ul>
        </div>
        <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-1 text-gray-600">
                <li>+91 9682574824</li>
                <li>jigmat@gmail.com</li>
                </ul>
        </div>
      </div>
      <div>
        <hr className="text-gray-400"/>
        <p className="py-3 pb-5 text-xs text-gray-500 text-left" >Copyright 2025 @SynthCipher - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
