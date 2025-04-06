import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/shopContext";

const ProductItem = ({ _id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className="cursor-pointer text-gray-700" to={`/product/${_id}`}>
      {" "}
      <div className="overflow-hidden" onClick={()=>setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth', // Optional: Adds smooth scrolling
      });
    }, 100)}>
        {/* <p>{id}</p>
        <p>{name}</p>
        <p>{price}</p> */}
        <img
          className="transition ease-in-out hover:scale-110"
          src={image[0]}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
